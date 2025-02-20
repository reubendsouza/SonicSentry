import { Controller, Post, Body } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditResult } from './types';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  async analyzeContract(
    @Body('code') code: string,
  ): Promise<{ result: AuditResult }> {
    const result = await this.auditService.analyze(code);
    return { result };
  }
}
