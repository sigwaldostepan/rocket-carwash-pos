import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { EXPENSE_CATEGORY_SELECT_WITH_EXPENSE_COUNT } from '../constants/expense-category.select';
import { CreateExpenseCategoryDto } from '../dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from '../dto/update-expense-category.dto';
import { BatchDeleteExpenseCategoryDto } from '../dto/batch-delete-expense-category.dto';
import { ExpenseCategoryStatus } from 'generated/prisma/client';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async findMany() {
    this.logger.info('Finding all expense categories');

    try {
      const expenseCategories = await this.prisma.expenseCategory.findMany({
        select: EXPENSE_CATEGORY_SELECT_WITH_EXPENSE_COUNT,
        where: { status: ExpenseCategoryStatus.active },
      });

      const data = expenseCategories.map((expenseCategory) => ({
        ...expenseCategory,
        expenseCount: expenseCategory._count.expense ?? 0,
      }));

      return data;
    } catch (error) {
      this.logger.error('Error finding all expense categories', error);
      throw error;
    }
  }

  public async findById(id: string) {
    this.logger.info(`Finding expense category with id ${id}`);

    try {
      const expenseCategory = await this.prisma.expenseCategory.findUnique({
        where: { id },
        select: EXPENSE_CATEGORY_SELECT_WITH_EXPENSE_COUNT,
      });

      const data = {
        ...expenseCategory,
        expenseCount: expenseCategory._count.expense ?? 0,
      };

      return data;
    } catch (error) {
      this.logger.error(`Error finding expense category with id ${id}`, error);
      throw error;
    }
  }

  public async create(data: CreateExpenseCategoryDto) {
    this.logger.info('Creating expense category', { data });

    try {
      const expenseCategory = await this.prisma.expenseCategory.create({
        data,
      });

      return expenseCategory;
    } catch (error) {
      this.logger.error('Error creating expense category', error);
      throw error;
    }
  }

  public async update(id: string, data: UpdateExpenseCategoryDto) {
    this.logger.info(`Updating expense category with id ${id}`, { data });

    try {
      const expenseCategory = await this.prisma.expenseCategory.update({
        where: { id },
        data,
      });

      if (!expenseCategory) {
        this.logger.error(`Expense category with id ${id} not found`);
        throw new NotFoundException(`Expense category with id ${id} not found`);
      }

      return expenseCategory;
    } catch (error) {
      this.logger.error(`Error updating expense category with id ${id}`, { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.info(`Deleting expense category with id ${id}`);

    try {
      const expenseCategory = await this.prisma.expenseCategory.update({
        where: { id },
        data: { status: ExpenseCategoryStatus.inactive },
      });

      if (!expenseCategory) {
        this.logger.error(`Expense category with id ${id} not found`);
        throw new NotFoundException(`Expense category with id ${id} not found`);
      }

      return expenseCategory;
    } catch (error) {
      this.logger.error(`Error deleting expense category with id ${id}`, { error });
      throw error;
    }
  }

  public async batchDelete({ ids }: BatchDeleteExpenseCategoryDto) {
    this.logger.info('Batch deleting expense categories', { ids });

    try {
      const result = await this.prisma.expenseCategory.updateMany({
        where: { id: { in: ids } },
        data: { status: ExpenseCategoryStatus.inactive },
      });

      return result;
    } catch (error) {
      this.logger.error('Error batch deleting expense categories', { error });
      throw error;
    }
  }
}
