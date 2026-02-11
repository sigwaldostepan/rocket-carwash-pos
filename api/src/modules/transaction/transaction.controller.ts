import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { paginateResponse } from 'src/common/helpers';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { TransactionService } from './transaction.service';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/client';

@Roles([Role.cashier, Role.owner])
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async findMany(@Query() findTransactionDto: FindTransactionDto) {
    const { transactions, total } = await this.transactionService.findMany(findTransactionDto);

    return paginateResponse(transactions, findTransactionDto.page, findTransactionDto.limit, total);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findById(id);
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.delete(id);
  }
}
