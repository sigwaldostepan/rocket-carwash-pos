import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/enums';
import { CreateExpenseCategoryDto } from '../dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from '../dto/update-expense-category.dto';
import { BatchDeleteExpenseCategoryDto } from '../dto/batch-delete-expense-category.dto';
import { ExpenseCategoryService } from '../services/expense-category.service';

@Roles([Role.owner])
@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(private readonly expenseCategoryService: ExpenseCategoryService) {}

  @Get()
  public async findMany() {
    const expenseCategories = await this.expenseCategoryService.findMany();

    return expenseCategories;
  }

  @Get(':id')
  public async findById(@Param('id', ParseUUIDPipe) id: string) {
    const expenseCategory = await this.expenseCategoryService.findById(id);

    return expenseCategory;
  }

  @Post()
  public async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    const expenseCategory = await this.expenseCategoryService.create(createExpenseCategoryDto);

    return expenseCategory;
  }

  @Put(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    const expenseCategory = await this.expenseCategoryService.update(id, updateExpenseCategoryDto);

    return expenseCategory;
  }

  @Delete(':id')
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    const expenseCategory = await this.expenseCategoryService.delete(id);

    return expenseCategory;
  }

  @Post('/batch-delete')
  public async batchDelete(@Body() dto: BatchDeleteExpenseCategoryDto) {
    return await this.expenseCategoryService.batchDelete(dto);
  }
}
