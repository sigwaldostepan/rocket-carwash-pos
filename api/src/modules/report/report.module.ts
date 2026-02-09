import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { IncomeReportService } from './services/income-report.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService, IncomeReportService],
})
export class ReportModule {}
