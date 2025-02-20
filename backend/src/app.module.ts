import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';

@Module({
  imports: [],
  controllers: [AppController, AuditController],
  providers: [AppService, AuditService],
})
export class AppModule {}
