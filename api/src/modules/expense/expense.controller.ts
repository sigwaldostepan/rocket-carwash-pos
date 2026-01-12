import { Controller, Get, Post, Body, Param, Put, Query, Delete, Res } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseCategoryDto, CreateExpenseDto } from './dto';
import { paginateResponse } from 'src/common/helpers';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { FindExpensesDto } from './dto/find-expenses.dto';
import { Response } from 'express';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('/')
  public async findAll(@Query() findExpensesDto: FindExpensesDto) {
    const { page, limit } = findExpensesDto;
    const { expenses, count } = await this.expenseService.findAll(findExpensesDto);

    return paginateResponse(expenses, page, limit, count);
  }

  @Get('/summaries')
  public async getSummary(@Query() findExpensesDto: FindExpensesDto) {
    const summary = await this.expenseService.getSummary(findExpensesDto);
    const categorySummary = await this.expenseService.getCategorySummary(findExpensesDto);

    return {
      summary,
      categorySummary,
    };
  }

  @Get('/export-excel')
  public async exportSummaryToExcel(@Query() findExpensesDto: FindExpensesDto, @Res() res: Response) {
    findExpensesDto.limit = 1000000;
    findExpensesDto.page = 1;

    const buffer = await this.expenseService.exportExcel(findExpensesDto);
    return res.header('Content-Disposition', 'attachment; filename=laporan-pengeluaran.xlsx').send(buffer);
  }

  @Post()
  public async create(@Body() createCategoryDto: CreateExpenseDto) {
    return await this.expenseService.create(createCategoryDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return await this.expenseService.delete(id);
  }

  @Post('/categories')
  public async createCategory(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return await this.expenseService.createCategory(createExpenseCategoryDto);
  }

  @Put('/categories/:id')
  public async updateCategory(@Param('id') id: string, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto) {
    return await this.expenseService.updateCategory(id, updateExpenseCategoryDto);
  }

  @Get('/categories')
  findAllCategories() {
    const categories = this.expenseService.findAllCategories();

    return categories;
  }

  @Get('/categories/:id')
  findCategory(@Param('id') id: string) {
    const categories = this.expenseService.findCategory(id);

    return categories;
  }

  @Delete('/categories/:id')
  public async deleteCategory(@Param('id') id: string) {
    return await this.expenseService.deleteCategory(id);
  }
}
