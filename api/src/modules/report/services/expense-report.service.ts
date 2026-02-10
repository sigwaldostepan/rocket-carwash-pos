import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { GetExpenseReportDto } from '../dto/get-expense-report.dto';
import { buildDateRangeWhere } from 'src/utils/date-range';

@Injectable()
export class ExpenseReportService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async getExpenseReport(dto: GetExpenseReportDto) {
    try {
      this.logger.info('Getting expense report', { data: dto });

      const [summary, categorySummary] = await Promise.all([
        this.getExpenseSummary(dto),
        this.getExpenseCategorySummary(dto),
      ]);

      const enrichedExpenseCategorySummary = categorySummary.map((sum) => {
        const contributionPercent = Number(((sum.total / summary.totalAmount) * 100).toFixed(2));

        return { ...sum, contributionPercent };
      });

      return {
        summary,
        categorySummary: enrichedExpenseCategorySummary,
      };
    } catch (error) {
      this.logger.error('Error getting expense report', { error });
      throw error;
    }
  }

  private async getExpenseSummary(dto: GetExpenseReportDto) {
    try {
      const where = buildDateRangeWhere(dto.dateFrom, dto.dateTo);

      const [expenseCount, { _sum: expenseAggregates }] = await Promise.all([
        this.prisma.expense.count({ where }),
        this.prisma.expense.aggregate({
          where,
          _sum: {
            amount: true,
          },
        }),
      ]);

      return {
        expenseCount: Number(expenseCount),
        totalAmount: Number(expenseAggregates.amount),
      };
    } catch (error) {
      this.logger.error('Error getting expense summary', { error });
      throw error;
    }
  }

  private async getExpenseCategorySummary(dto: GetExpenseReportDto) {
    try {
      const where = buildDateRangeWhere(dto.dateFrom, dto.dateTo);

      const summary = await this.prisma.expense.groupBy({
        by: 'categoryId',
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        where,
      });

      const categoryIds = summary.map((item) => item.categoryId);
      const expenseCategories = await this.prisma.expenseCategory.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      const data = summary.map((item) => ({
        category: {
          id: item.categoryId,
          name: expenseCategories.find((category) => category.id === item.categoryId)?.name,
        },
        expenseCount: item._count.id,
        total: Number(item._sum.amount),
      }));

      return data;
    } catch (error) {
      this.logger.error('Error getting expense category summary', { error });
      throw error;
    }
  }
}
