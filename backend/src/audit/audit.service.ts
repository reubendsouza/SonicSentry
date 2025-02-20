import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { Vulnerability, AuditResult } from './types';

const execAsync = promisify(exec);

@Injectable()
export class AuditService {
  async analyze(code: string): Promise<AuditResult> {
    if (!code || code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }

    const filePath = path.join(__dirname, 'temp.sol');

    try {
      // Save the code to a temporary Solidity file
      fs.writeFileSync(filePath, code);

      // Run Slither on the file
      const { stdout } = await execAsync(`slither ${filePath} --json -`);

      // Parse Slither's JSON output
      const vulnerabilities = this.parseSlitherOutput(stdout);

      return {
        vulnerabilities,
        riskScore: this.calculateRiskScore(vulnerabilities),
      };
    } catch (error) {
      if (error.stdout) {
        const vulnerabilities = this.parseSlitherOutput(error.stdout);
        return {
          vulnerabilities,
          riskScore: this.calculateRiskScore(vulnerabilities),
        };
      }
      throw new Error(`Audit failed: ${error.message}`);
    } finally {
      // Clean up the temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  private parseSlitherOutput(output: string): Vulnerability[] {
    try {
      const slitherResults = JSON.parse(output);
      return slitherResults.results.detectors.map((detector) => ({
        type: detector.check,
        description: detector.description,
        severity: detector.impact,
        line: detector.elements[0]?.source_mapping?.lines?.[0] || 0,
      }));
    } catch (error) {
      throw new Error(`Failed to parse Slither output: ${error.message}`);
    }
  }

  private calculateRiskScore(vulnerabilities: Vulnerability[]): number {
    if (vulnerabilities.length === 0) return 0;

    const severityWeights = {
      High: 10,
      Medium: 5,
      Low: 1,
    };

    const totalScore = vulnerabilities.reduce((score, vuln) => {
      return score + (severityWeights[vuln.severity] || 0);
    }, 0);

    // Normalize the score to a range of 0-100
    return Math.min(totalScore, 100);
  }
}