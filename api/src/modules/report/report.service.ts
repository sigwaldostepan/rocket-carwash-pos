import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GetIncomeReportDto } from './dto/get-income-report.dto';
import { IncomeReportService } from './services/income-report.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly incomeReportService: IncomeReportService,
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
}
