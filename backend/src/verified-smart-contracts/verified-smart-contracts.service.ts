import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import { VerifiedContract } from './entities/verified-contract.entity';
import { ContractSourceCode } from './entities/contract-source-code.entity';
import { AuditService } from '../audit/audit.service';
import { AuditResult } from 'src/audit/types';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';

interface SonicScanResponse {
  result: [
    {
      SourceCode?: string;
      ABI?: string;
      CompilerVersion?: string;
      OptimizationUsed?: string;
      Runs?: string;
    },
  ];
}

@Injectable()
export class VerifiedSmartContractsService {
  constructor(
    @InjectRepository(VerifiedContract)
    private verifiedContractsRepository: Repository<VerifiedContract>,
    @InjectRepository(ContractSourceCode)
    private sourceCodeRepository: Repository<ContractSourceCode>,
    private auditService: AuditService,
  ) {}

  async getVerifiedContracts() {
    try {
      const contracts = await this.verifiedContractsRepository.find({
        order: {
          createdAt: 'DESC', // Assuming you have a createdAt field, otherwise remove this
        },
      });

      return contracts.map((contract) => ({
        id: contract.id,
        address: contract.address,
        contractName: contract.contractName,
        compiler: contract.compiler,
        riskScore: contract.riskScore,
        // Include any other fields you want to expose
      }));
    } catch (error) {
      console.error('Error fetching verified contracts:', error);
      return [];
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'verified-contracts-cron',
  })
  async getVerifiedContractsCron() {
    try {
      console.log('Running verified contracts cron job...');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Set user agent to mimic a real browser
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      // Go to Etherscan verified contracts page
      await page.goto('https://sonicscan.org/contractsVerified?ps=10', {
        waitUntil: 'networkidle2',
      });

      // Wait for the table to load
      await page.waitForSelector('table tbody tr');

      // Extract contract information from the table
      // TODO: Add a check to see if the contract is already in the database
      const contracts = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.reverse().map((row) => {
          const columns = row.querySelectorAll('td');
          const addressSpan = columns[0]?.querySelector(
            'span[data-highlight-target]',
          );
          const fullAddress =
            addressSpan?.getAttribute('data-highlight-target') || '';
          return {
            address: fullAddress, // Use the full address from the data attribute
            contractName: columns[1]?.textContent?.trim() || '',
            compiler: columns[3]?.textContent?.trim() || '',
          };
        });
      });

      await browser.close();

      // Store contracts in database
      for (const contract of contracts) {
        const existingContract = await this.verifiedContractsRepository.findOne(
          {
            where: { address: contract.address },
          },
        );

        if (!existingContract) {
          const savedContract =
            await this.verifiedContractsRepository.save(contract);
          await this.fetchAndStoreSourceCode(savedContract);
        }
      }

      return contracts;
    } catch (error) {
      console.error('Error fetching verified contracts cron:', error);
      return [];
    }
  }

  private async fetchAndStoreSourceCode(contract: VerifiedContract) {
    try {
      const response = await axios.get<SonicScanResponse>(
        'https://api.sonicscan.org/api',
        {
          params: {
            module: 'contract',
            action: 'getsourcecode',
            address: contract.address,
            apikey: process.env.SONICSCAN_API_KEY,
          },
        },
      );

      // Get the source code from the response
      const sourceCodeContent = response.data.result[0]?.SourceCode;

      // Analyze the source code using AuditService if source code exists
      let auditResult: AuditResult | null = null;
      if (sourceCodeContent) {
        try {
          auditResult = await this.auditService.analyze(sourceCodeContent);

          // Update the contract with the risk score
          await this.verifiedContractsRepository.update(contract.id, {
            riskScore: auditResult?.riskScore || 0,
          });
        } catch (auditError) {
          console.error(
            `Error auditing contract ${contract.address}:`,
            auditError,
          );
        }
      }

      const sourceCode = {
        contractId: contract.id,
        sourceCode: sourceCodeContent,
        abi: response.data.result[0]?.ABI,
        compilerVersion: response.data.result[0]?.CompilerVersion,
        optimizationUsed: response.data.result[0]?.OptimizationUsed === '1',
        optimizationRuns: parseInt(response.data.result[0]?.Runs || '0'),
        rawResponse: response.data,
        // Store the audit result vulnerabilities if available
        vulnerabilities: auditResult?.vulnerabilities || null,
      };

      await this.sourceCodeRepository.save(sourceCode);
    } catch (error) {
      console.error(
        `Error fetching source code for ${contract.address}:`,
        error,
      );
    }
  }

  async getContractDetails(id: string) {
    try {
      // Find the contract
      const contract = await this.verifiedContractsRepository.findOne({
        where: { id: +id },
      });

      if (!contract) {
        return null;
      }

      // Find the source code and vulnerabilities
      const sourceCodeEntity = await this.sourceCodeRepository.findOne({
        where: { contractId: contract.id },
      });

      return {
        contract: {
          id: contract.id,
          address: contract.address,
          contractName: contract.contractName,
          compiler: contract.compiler,
          riskScore: contract.riskScore,
        },
        sourceCode: sourceCodeEntity?.sourceCode || null,
        abi: sourceCodeEntity?.abi || null,
        compilerVersion: sourceCodeEntity?.compilerVersion || null,
        optimizationUsed: sourceCodeEntity?.optimizationUsed || false,
        optimizationRuns: sourceCodeEntity?.optimizationRuns || 0,
        vulnerabilities: sourceCodeEntity?.vulnerabilities || [],
      };
    } catch (error) {
      console.error(`Error fetching contract details for ID ${id}:`, error);
      return null;
    }
  }
}
