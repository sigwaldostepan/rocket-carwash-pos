import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { CustomerModule } from '../customer/customer.module';
import { ComplimentTransactionStrategy } from './strategy/compliment-transaction.strategy';
import { StandardTransactionStrategy } from './strategy/standard-transaction.strategy';
import { RedeemTransactionStrategy } from './strategy/redeem-transaction.strategy';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionFactoryService } from './services/transaction-factory.service';
import { InvoiceService } from './services/invoice.service';

@Module({
  imports: [PrismaModule, CustomerModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    StandardTransactionStrategy,
    RedeemTransactionStrategy,
    ComplimentTransactionStrategy,
    TransactionFactoryService,
    InvoiceService,
  ],
})
export class TransactionModule {}
