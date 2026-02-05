import { Customer, Item } from 'generated/prisma/client';
import { TransactionStrategy } from '../strategy/transaction.strategy';

interface StandardTransactionStrategyContext {
  items: Item[];
}

interface RedeemTransactionStrategyContext {
  customer: Customer;
  items: Item[];
  pointCost: number;
}

interface ComplimentTransactionStrategyContext {
  items: Item[];
}

export interface StrategyMap {
  standard: TransactionStrategy<StandardTransactionStrategyContext>;
  redeem: TransactionStrategy<RedeemTransactionStrategyContext>;
  compliment: TransactionStrategy<ComplimentTransactionStrategyContext>;
}
