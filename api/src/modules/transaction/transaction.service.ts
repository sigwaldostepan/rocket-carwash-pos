import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Transaction } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { TransactionFactoryService } from './services/transaction-factory.service';
import { TRANSACTION_SELECT_WITH_CUSTOMER, TRANSACTION_SELECT_WITH_DETAILS } from './transaction.select';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly transactionFactory: TransactionFactoryService,
  ) {}

  public async findMany(dto: FindTransactionDto) {
    this.logger.info('Finding transactions');

    try {
      const where = this.construcWhere(dto);

      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          take: dto.limit,
          skip: dto.offset,
          where,
          select: TRANSACTION_SELECT_WITH_CUSTOMER,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.transaction.count({ where }),
      ]);

      const data = transactions.map((transaction) => ({
        ...transaction,
        total: +transaction.total,
        subtotal: +transaction.subtotal,
        complimentValue: +transaction.complimentValue,
      }));

      return {
        transactions: data,
        total,
      };
    } catch (error) {
      this.logger.error('Error finding transactions', { error });
      throw error;
    }
  }

  public async findById(id: string) {
    this.logger.info(`Finding transaction with id ${id}`);

    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
        select: TRANSACTION_SELECT_WITH_DETAILS,
      });

      return transaction;
    } catch (error) {
      this.logger.error(`Error finding transaction with id ${id}`, { error });
      throw error;
    }
  }

  public async create(dto: CreateTransactionDto) {
    this.logger.info('Creating transaction');

    try {
      const factoryResult = this.transactionFactory.getStrategy(dto);

      let result: Transaction | null = null;

      // use type narrowing to handle different strategy typesafety
      switch (factoryResult.type) {
        case 'standard': {
          const validatedItems = await factoryResult.strategy.validate(dto);
          result = await factoryResult.strategy.process(dto, validatedItems);
          break;
        }
        case 'redeem': {
          const validatedItems = await factoryResult.strategy.validate(dto);
          result = await factoryResult.strategy.process(dto, validatedItems);
          break;
        }
        case 'compliment': {
          const validatedItems = await factoryResult.strategy.validate(dto);
          result = await factoryResult.strategy.process(dto, validatedItems);
          break;
        }
      }

      return result;
    } catch (error) {
      console.error(error);
      this.logger.error('Error creating transaction', { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.info(`Deleting transaction with id ${id}`);

    try {
      const transaction = await this.prisma.transaction.delete({
        where: { id },
        include: {
          transactionDetail: true,
        },
      });

      return transaction;
    } catch (error) {
      this.logger.error(`Error deleting transaction with id ${id}`, { error });
      throw error;
    }
  }

  private construcWhere(dto: FindTransactionDto) {
    const where: Prisma.TransactionWhereInput = {};

    if (dto.dateFrom && dto.dateTo) {
      const dateFrom = new Date(dto.dateFrom);
      const dateTo = new Date(dto.dateTo);

      dateFrom.setHours(0, 0, 0, 0);
      dateTo.setHours(23, 59, 59, 999);

      where.createdAt = {
        gte: dateFrom,
        lte: dateTo,
      };
    }

    return where;
  }
}
