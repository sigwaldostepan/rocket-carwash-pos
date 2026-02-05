import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { StrategyMap } from '../interfaces/strategy-context';
import { ComplimentTransactionStrategy } from '../strategy/compliment-transaction.strategy';
import { RedeemTransactionStrategy } from '../strategy/redeem-transaction.strategy';
import { StandardTransactionStrategy } from '../strategy/standard-transaction.strategy';

export interface BaseStrategyResult<TType, TStrategy> {
  type: TType;
  strategy: TStrategy;
}

export interface NormalStrategyResult extends BaseStrategyResult<'standard', StrategyMap['standard']> {}

export interface RedeemStrategyResult extends BaseStrategyResult<'redeem', StrategyMap['redeem']> {}

export interface ComplimentStrategyResult extends BaseStrategyResult<'compliment', StrategyMap['compliment']> {}

export type TransactionFactoryResult = NormalStrategyResult | RedeemStrategyResult | ComplimentStrategyResult;

@Injectable()
export class TransactionFactoryService {
  constructor(
    private readonly normalStrategy: StandardTransactionStrategy,
    private readonly redeemStrategy: RedeemTransactionStrategy,
    private readonly complimentStrategy: ComplimentTransactionStrategy,
  ) {}

  // determines the transaction type based on the DTO
  determineTransactionType(dto: CreateTransactionDto): 'standard' | 'redeem' | 'compliment' {
    // check if any item has redemption
    const hasRedemption = dto.items.some((item) => (item.redeemedQuantity ?? 0) > 0);
    if (hasRedemption) {
      return 'redeem';
    }

    // check if it's a compliment transaction or a night shift compliment
    const isCompliment = dto.isCompliment ?? (dto.complimentAmount ?? 0) > 0;

    console.log('isCompliment', isCompliment);
    const isNightShiftCompliment = dto.isNightShift;
    if (isCompliment || isNightShiftCompliment) {
      return 'compliment';
    }

    // default to standard transaction
    return 'standard';
  }

  // returns the appropriate strategy based on the transaction type
  getStrategy(dto: CreateTransactionDto): TransactionFactoryResult {
    const transactionType = this.determineTransactionType(dto);

    switch (transactionType) {
      case 'redeem':
        return { type: 'redeem', strategy: this.redeemStrategy };
      case 'compliment':
        return { type: 'compliment', strategy: this.complimentStrategy };
      case 'standard':
      default:
        return { type: 'standard', strategy: this.normalStrategy };
    }
  }
}
