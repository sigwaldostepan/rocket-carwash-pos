import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GetIncomeReportDto } from './dto/get-income-report.dto';
import { IncomeReportService } from './services/income-report.service';
import { ExpenseReportService } from './services/expense-report.service';
import { GetExpenseReportDto } from './dto/get-expense-report.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly incomeReportService: IncomeReportService,
    private readonly expenseReportService: ExpenseReportService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async getIncomeReport(dto: GetIncomeReportDto) {
    try {
      return await this.incomeReportService.getIncomeReport(dto);
    } catch (error) {
      this.logger.error('Error getting income report', { error });
      throw error;
    }
  }

  public async getExpenseReport(dto: GetExpenseReportDto) {
    try {
      return await this.expenseReportService.getExpenseReport(dto);
    } catch (error) {
      this.logger.error('Error getting expense report', { error });
      throw error;
    }
  }
}
