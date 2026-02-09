import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { buildDateRangeWhere } from 'src/utils/date-range';
import { Logger } from 'winston';
import { GetIncomeReportDto } from '../dto/get-income-report.dto';

@Injectable()
export class IncomeReportService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async getIncomeReport(dto: GetIncomeReportDto) {
    try {
      this.logger.info('Getting income reports', { data: dto });

      const [summary, paymentMethodSummary] = await Promise.all([
        this.getTransactionSummary(dto),
        this.getTransactionPaymentMethodSummary(dto),
      ]);

      const enrichedPaymentMethodSummary = paymentMethodSummary.map((sum) => {
        const contributionPercent = Number(((sum.totalAmount / summary.netProfit) * 100).toFixed(2));

        return { ...sum, contributionPercent };
      });

      return {
        summary,
        paymentMethodSummary: enrichedPaymentMethodSummary,
      };
    } catch (error) {
      this.logger.error('Error getting income report', { error });
      throw error;
    }
  }

  private async getTransactionSummary(dto: GetIncomeReportDto) {
    try {
      const where = buildDateRangeWhere(dto.dateFrom, dto.dateTo);

      const [transactionCount, { _sum: incomeAggregates }] = await Promise.all([
        this.prisma.transaction.count({
          where,
        }),
        this.prisma.transaction.aggregate({
          where,
          _sum: {
            total: true,
            subtotal: true,
            complimentValue: true,
          },
        }),
      ]);

      const grossProfit = incomeAggregates.subtotal ?? new Prisma.Decimal(0);
      const netProfit = incomeAggregates.total ?? new Prisma.Decimal(0);
      const complimentValue = incomeAggregates.complimentValue ?? new Prisma.Decimal(0);

      return {
        transactionCount: Number(transactionCount),
        grossProfit: Number(grossProfit),
        netProfit: Number(netProfit),
        complimentValue: Number(complimentValue),
      };
    } catch (error) {
      this.logger.error('Error getting transaction summary', { error });
      console.log(error);
      throw error;
    }
  }

  private async getTransactionPaymentMethodSummary(dto: GetIncomeReportDto) {
    try {
      const where = buildDateRangeWhere(dto.dateFrom, dto.dateTo);

      const summary = await this.prisma.transaction.groupBy({
        by: 'paymentMethod',
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
        where,
      });

      const data = summary.map((item) => ({
        paymentMethod: item.paymentMethod,
        transactionCount: item._count.id,
        totalAmount: Number(item._sum.total),
      }));

      return data;
    } catch (error) {
      this.logger.error('Error getting transaction summary', { error });
      console.log(error);
      throw error;
    }
  }
}
