import { Controller, Get, Query } from '@nestjs/common';
import { GetIncomeReportDto } from './dto/get-income-report.dto';
import { ReportService } from './report.service';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/client';
import { GetExpenseReportDto } from './dto/get-expense-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles([Role.owner, Role.cashier])
  @Get('income')
  getIncomeReport(@Query() dto: GetIncomeReportDto) {
    return this.reportService.getIncomeReport(dto);
  }

  @Roles([Role.owner])
  @Get('/expense')
  getExpenseReport(@Query() dto: GetExpenseReportDto) {
    return this.reportService.getExpenseReport(dto);
  }
}
