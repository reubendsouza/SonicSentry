import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedSmartContractsController } from './verified-smart-contracts.controller';

describe('VerifiedSmartContractsController', () => {
  let controller: VerifiedSmartContractsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifiedSmartContractsController],
    }).compile();

    controller = module.get<VerifiedSmartContractsController>(
      VerifiedSmartContractsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
