import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { EXPENSE_SELECT_WITH_CATEGORY } from '../constants/expense.select';
import { FindExpensesDto } from '../dto/find-expenses.dto';
import { BatchDeleteExpenseDto } from '../dto/batch-delete-expense.dto';
import { Prisma } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async findMany(dto: FindExpensesDto) {
    this.logger.info('Finding all expenses', { data: dto });

    try {
      const where = this.constructWhere(dto);

      const [expenses, total] = await Promise.all([
        this.prisma.expense.findMany({
          select: EXPENSE_SELECT_WITH_CATEGORY,
          where,
          skip: dto.offset,
          take: dto.limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.expense.count({
          where,
        }),
      ]);

      const data = expenses.map((expense) => ({
        ...expense,
        amount: +expense.amount,
      }));

      return {
        expenses: data,
        total,
      };
    } catch (error) {
      this.logger.error('Error finding all expenses', { error });
      throw error;
    }
  }

  public async findById(id: string) {
    this.logger.info(`Finding expense with id ${id}`);

    try {
      const expense = await this.prisma.expense.findUnique({
        where: { id },
        select: EXPENSE_SELECT_WITH_CATEGORY,
      });

      return expense;
    } catch (error) {
      this.logger.error(`Error finding expense with id ${id}`, { error });
      throw error;
    }
  }

  public async create(data: CreateExpenseDto) {
    this.logger.info('Creating expense', { data });

    try {
      const expense = await this.prisma.expense.create({
        data,
        select: EXPENSE_SELECT_WITH_CATEGORY,
      });

      return expense;
    } catch (error) {
      this.logger.error('Error creating expense', { error });
      throw error;
    }
  }

  public async update(id: string, data: UpdateExpenseDto) {
    this.logger.info(`Updating expense with id ${id}`, { data });

    try {
      const expense = await this.findById(id);

      if (!expense) {
        this.logger.error(`Expense with id ${id} not found`);
        throw new NotFoundException(`Expense with id ${id} not found`);
      }

      const updatedExpense = await this.prisma.expense.update({
        where: { id },
        data,
        select: EXPENSE_SELECT_WITH_CATEGORY,
      });

      return updatedExpense;
    } catch (error) {
      this.logger.error(`Error updating expense with id ${id}`, { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.info(`Deleting expense with id ${id}`);

    try {
      const expense = await this.findById(id);

      if (!expense) {
        this.logger.error(`Expense with id ${id} not found`);
        throw new NotFoundException(`Expense with id ${id} not found`);
      }

      await this.prisma.expense.delete({
        where: { id },
      });

      return expense;
    } catch (error) {
      this.logger.error(`Error deleting expense with id ${id}`, { error });
      throw error;
    }
  }

  public async batchDelete({ ids }: BatchDeleteExpenseDto) {
    this.logger.info('Batch deleting expenses', { ids });

    try {
      const result = await this.prisma.expense.deleteMany({
        where: { id: { in: ids } },
      });

      return result;
    } catch (error) {
      this.logger.error('Error batch deleting expenses', { error });
      throw error;
    }
  }

  private constructWhere(dto: FindExpensesDto) {
    const whereClause: Prisma.ExpenseWhereInput = {};

    if (dto.dateFrom) {
      const dateFrom = new Date(dto.dateFrom);

      dateFrom.setHours(0, 0, 0, 0);

      whereClause.createdAt = {
        gte: dateFrom,
      };
    }

    if (dto.dateTo) {
      const dateTo = new Date(dto.dateTo);

      dateTo.setHours(23, 59, 59, 999);

      whereClause.createdAt = {
        lte: dateTo,
      };
    }

    return whereClause;
  }
}
