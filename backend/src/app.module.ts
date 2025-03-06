import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { VerifiedSmartContractsController } from './verified-smart-contracts/verified-smart-contracts.controller';
import { VerifiedSmartContractsService } from './verified-smart-contracts/verified-smart-contracts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifiedContract } from './verified-smart-contracts/entities/verified-contract.entity';
import { ContractSourceCode } from './verified-smart-contracts/entities/contract-source-code.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [VerifiedContract, ContractSourceCode],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([VerifiedContract, ContractSourceCode]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuditController,
    VerifiedSmartContractsController,
  ],
  providers: [AppService, AuditService, VerifiedSmartContractsService],
})
export class AppModule {}
