import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateExpenseCategoryDto, FindExpensesDto, GetExpenseCategorySummary, UpdateExpenseCategoryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseCategory } from './entities/expense-category.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Expense } from './entities';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepo: Repository<ExpenseCategory>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  public async findAll({ description, limit, offset, range = 'toToday', dateFrom }: FindExpensesDto) {
    const query = this.expenseRepo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .orderBy('expense.createdAt', 'ASC')
      .take(limit)
      .skip(offset);

    this.assignDateFilter(dateFrom, range, query);

    if (description) {
      query.andWhere('expense.description ILIKE :description', { description: `%${description}%` });
    }

    const [expenses, count] = await query.getManyAndCount();

    return { expenses, count };
  }

  public async find(id: string) {
    const expense = await this.expenseRepo.findOne({ where: { id }, relations: ['category'] });

    if (!expense) {
      throw new NotFoundException('Transaksi pengeluaran gak ketemu');
    }

    return expense;
  }

  public async getSummary({ dateFrom, range, description }: FindExpensesDto) {
    const query = this.expenseRepo
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.id)', 'totalCount')
      .leftJoin('expense.category', 'category');

    this.assignDateFilter(dateFrom, range, query);

    if (description) {
      query.andWhere('expense.description ILIKE :description', { description: `%${description}%` });
    }

    const result = await query.getRawOne();

    return {
      totalAmount: parseFloat(result.totalAmount) || 0,
      totalCount: parseInt(result.totalCount, 10) || 0,
    };
  }

  public async exportExcel(findExpensesDto: FindExpensesDto) {
    const { expenses } = await this.findAll(findExpensesDto);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transaksi');

    worksheet.columns = [
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Deskripsi', key: 'description', width: 50 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Tanggal', key: 'createdAt', width: 20 },
    ];

    worksheet.addRows(
      expenses.map((expense) => ({
        category: expense.category.name,
        description: expense.description,
        amount: expense.amount,
        createdAt: format(expense.createdAt, 'dd-MM-yyyy'),
      })),
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  public async create(createExpenseDto: CreateExpenseDto) {
    const { categoryId, amount, description } = createExpenseDto;
    const category = await this.findCategory(categoryId);

    const expense = this.expenseRepo.create({
      amount,
      description,
      category,
    });

    await this.expenseRepo.save(expense);

    return expense;
  }

  public async delete(id: string) {
    const expense = await this.find(id);

    return await this.expenseRepo.delete(expense.id);
  }

  public async findCategory(id: string) {
    const category = await this.expenseCategoryRepo.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Kategori gak ketemu');

    return category;
  }

  public async findAllCategories() {
    const categories = await this.expenseCategoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.expenseTransaction', 'expense')
      .loadRelationCountAndMap('category.transactionCount', 'category.expenseTransaction')
      .getMany();

    return categories;
  }

  public async getCategorySummary({ dateFrom, range }: GetExpenseCategorySummary) {
    const query = this.expenseCategoryRepo
      .createQueryBuilder('category')
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.id)', 'totalCount')
      .addSelect('category.name', 'name')
      .addSelect((qb) => {
        const subquery = qb.select('sum(expense.amount)').from(Expense, 'expense');

        this.assignDateFilter(dateFrom, range, subquery);

        return subquery;
      }, 'expenseTotal')
      .leftJoin('category.expenseTransaction', 'expense');

    this.assignDateFilter(dateFrom, range, query);

    query.groupBy('category.id');

    const result = await query.getRawMany();

    const categorySummary = result.map((item) => ({
      name: item.name,
      totalAmount: parseFloat(item.totalAmount) || 0,
      totalCount: parseInt(item.totalCount, 10) || 0,
      percentage: (((+item.totalAmount || 1) / (+item.expenseTotal || 1)) * 100).toFixed(2),
    }));

    return categorySummary;
  }

  public async createCategory(createCategoryDto: CreateExpenseCategoryDto) {
    const category = this.expenseCategoryRepo.create(createCategoryDto);

    this.expenseCategoryRepo.save(category);

    return category;
  }

  public async updateCategory(id: string, updateCategoryDto: UpdateExpenseCategoryDto) {
    const category = await this.findCategory(id);

    const updatedCategory = this.expenseCategoryRepo.merge(category, updateCategoryDto);
    await this.expenseCategoryRepo.save(updatedCategory);

    return updatedCategory;
  }

  public async deleteCategory(id: string) {
    const category = await this.findCategory(id);

    await this.expenseCategoryRepo.remove(category);

    return category;
  }

  private assignDateFilter(
    dateFrom: string,
    range: FindExpensesDto['range'],
    query: SelectQueryBuilder<Expense | ExpenseCategory>,
  ) {
    if (!dateFrom) {
      return;
    }

    let from = null;
    let to = null;

    if (range === 'daily' || !range) {
      from = startOfDay(dateFrom);
      to = endOfDay(dateFrom);
    } else if (range === 'weekly') {
      from = startOfWeek(dateFrom);
      to = endOfWeek(dateFrom);
    } else if (range === 'monthly') {
      from = startOfMonth(dateFrom);
      to = endOfMonth(dateFrom);
    } else if (range === 'yearly') {
      from = startOfYear(dateFrom);
      to = endOfYear(dateFrom);
    } else if (range === 'toToday') {
      from = startOfDay(dateFrom);
      to = endOfDay(new Date());
    } else {
      throw new UnprocessableEntityException('Tipe range gak valid');
    }

    query.where('expense.createdAt BETWEEN :from AND :to', { from, to });
  }
}
