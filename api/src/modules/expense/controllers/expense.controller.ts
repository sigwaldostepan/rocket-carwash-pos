import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/enums';
import { paginateResponse } from 'src/common/helpers';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { FindExpensesDto } from '../dto/find-expenses.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { BatchDeleteExpenseDto } from '../dto/batch-delete-expense.dto';
import { ExpenseService } from '../services/expense.service';

@Roles([Role.owner])
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  public async findAll(@Query() findExpensesDto: FindExpensesDto) {
    const { page, limit } = findExpensesDto;
    const { expenses, total } = await this.expenseService.findMany(findExpensesDto);

    return paginateResponse(expenses, page, limit, total);
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    const expense = await this.expenseService.findById(id);

    return expense;
  }

  @Post()
  public async create(@Body() createExpenseDto: CreateExpenseDto) {
    return await this.expenseService.create(createExpenseDto);
  }

  @Put(':id')
  public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return await this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.expenseService.delete(id);
  }

  @Post('/batch-delete')
  public async batchDelete(@Body() dto: BatchDeleteExpenseDto) {
    return await this.expenseService.batchDelete(dto);
  }
}
