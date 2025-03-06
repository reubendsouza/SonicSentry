import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { VerifiedSmartContractsService } from './verified-smart-contracts.service';

@Controller('verified-smart-contracts')
export class VerifiedSmartContractsController {
  constructor(
    private readonly verifiedSmartContractsService: VerifiedSmartContractsService,
  ) {}

  @Get()
  async getVerifiedContracts() {
    return this.verifiedSmartContractsService.getVerifiedContracts();
  }

  @Get(':id')
  async getContractDetails(@Param('id') id: string) {
    const contractDetails =
      await this.verifiedSmartContractsService.getContractDetails(id);
    if (!contractDetails) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contractDetails;
  }
}
