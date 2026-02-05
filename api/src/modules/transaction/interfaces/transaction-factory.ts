import { StrategyMap } from './strategy-context';

export interface BaseStrategyResult<TType, TStrategy> {
  type: TType;
  strategy: TStrategy;
}

export interface NormalStrategyResult extends BaseStrategyResult<'standard', StrategyMap['standard']> {}

export interface RedeemStrategyResult extends BaseStrategyResult<'redeem', StrategyMap['redeem']> {}

export interface ComplimentStrategyResult extends BaseStrategyResult<'compliment', StrategyMap['compliment']> {}

export type TransactionFactoryResult = NormalStrategyResult | RedeemStrategyResult | ComplimentStrategyResult;
