import { Transaction } from 'generated/prisma/client';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

export interface TransactionStrategy<TValidated> {
  validate(dto: CreateTransactionDto): Promise<TValidated>;
  process(dto: CreateTransactionDto, validatedData: TValidated): Promise<Transaction>;
}
