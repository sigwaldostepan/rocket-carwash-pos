import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionDetail } from './entities';
import { Item } from '../item/entities/item.entity';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/entities/customer.entity';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionDetail, Item, Customer]), CustomerModule, ExpenseModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
