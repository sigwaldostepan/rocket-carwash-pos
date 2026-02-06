import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseService } from './services/expense.service';
import { ExpenseCategoryService } from './services/expense-category.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExpenseController, ExpenseCategoryController],
  providers: [ExpenseService, ExpenseCategoryService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
