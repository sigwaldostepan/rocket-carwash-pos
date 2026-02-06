import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Item, Prisma, Transaction } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NIGHT_SHIFT_COMPLIMENT_RATE, POINT_REWARD } from 'src/constants/transaction';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { InvoiceService } from '../services/invoice.service';
import { TransactionStrategy } from './transaction.strategy';
import { CustomerService } from 'src/modules/customer/customer.service';

interface ValidatedData {
  items: Item[];
}

@Injectable()
export class ComplimentTransactionStrategy implements TransactionStrategy<ValidatedData> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
    private readonly customerService: CustomerService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async validate(dto: CreateTransactionDto): Promise<ValidatedData> {
    const purchasedItems = dto.items;
    const purchasedItemIds = purchasedItems.map((item) => item.itemId);

    // get purchased items
    const items = await this.prisma.item.findMany({
      where: {
        id: { in: purchasedItemIds },
      },
    });

    // create item Map for easier checking
    const itemsMap = new Map(items.map((item) => [item.id, item]));

    // check each purchased items
    purchasedItems.forEach((item) => {
      const matchedItem = itemsMap.get(item.itemId);

      // if purchased item not found
      if (!matchedItem) {
        throw new NotFoundException(`Item dengan id ${item.itemId} gak ketemu`);
      }

      // if purchased item can't be complimented
      if (!matchedItem.canBeComplimented) {
        throw new UnprocessableEntityException(`Item ${matchedItem.name} tidak bisa dikomplimen`);
      }
    });

    const transTotal = this.calculateSubtotal(dto.items, items);
    if (transTotal.lt(dto.complimentAmount)) {
      throw new UnprocessableEntityException('Komplimen tidak boleh melebihi total harga transaksi');
    }

    return {
      items,
    };
  }

  async process(dto: CreateTransactionDto, validatedData: ValidatedData): Promise<Transaction> {
    switch (dto.isNightShift) {
      case true:
        return this.handleNightShiftTransaction(dto, validatedData);
      default:
        return this.handleComplimentTransaction(dto, validatedData);
    }
  }

  private async handleComplimentTransaction(dto: CreateTransactionDto, validatedData: ValidatedData) {
    this.logger.info('Processing transaction - [Strategy: Compliment]');

    try {
      return this.prisma.$transaction(async (tx) => {
        const invoiceNo = await this.invoiceService.generateInvoiceNo();
        const customer = dto.customerId ? await this.customerService.findById(dto.customerId, tx) : null;

        const subtotal = this.calculateSubtotal(dto.items, validatedData.items);
        const total = subtotal.sub(dto.complimentAmount);

        const data: Prisma.TransactionCreateInput = {
          invoiceNo,
          complimentValue: dto.complimentAmount,
          isCompliment: true,
          paymentMethod: dto.paymentMethod,
          isNightShift: false,
          subtotal,
          total,
          transactionDetail: {
            create: dto.items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              redeemedQuantity: item.redeemedQuantity ?? 0,
            })),
          },
        };

        if (customer) {
          data.customer = {
            connect: {
              id: customer.id,
            },
          };
        }

        const createdTransaction = await tx.transaction.create({ data });

        const canGetPoint = validatedData.items.some((item) => item.isGetPoint) && !!customer;
        if (canGetPoint) {
          await this.customerService.addPoints(customer.id, POINT_REWARD, tx);
        }

        return createdTransaction;
      });
    } catch (error) {
      this.logger.error('Failed to process transaction - [Strategy: Compliment]', error);
      throw error;
    } finally {
      this.logger.info('Transaction processed - [Strategy: Compliment]');
    }
  }

  private async handleNightShiftTransaction(dto: CreateTransactionDto, validatedData: ValidatedData) {
    this.logger.info('Processing transaction - [Strategy: Night Shift Compliment]');

    try {
      return this.prisma.$transaction(async (tx) => {
        const invoiceNo = await this.invoiceService.generateInvoiceNo();
        const customer = dto.customerId ? await this.customerService.findById(dto.customerId, tx) : null;

        const subtotal = this.calculateSubtotal(dto.items, validatedData.items);

        // night shift total = subtotal - night shift compliment total
        const nightShiftComplimentAmount = this.calculateNightShiftComplimentAmount(dto.items, validatedData.items);
        const total = subtotal.sub(nightShiftComplimentAmount);

        const data: Prisma.TransactionCreateInput = {
          invoiceNo,
          complimentValue: nightShiftComplimentAmount,
          isCompliment: true,
          paymentMethod: dto.paymentMethod,
          isNightShift: true,
          subtotal,
          total,
          transactionDetail: {
            create: dto.items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              redeemedQuantity: item.redeemedQuantity ?? 0,
            })),
          },
        };

        if (!!customer) {
          data.customer = {
            connect: {
              id: customer.id,
            },
          };
        }

        const createdTransaction = await tx.transaction.create({ data });

        if (customer) {
          await this.customerService.addPoints(customer.id, POINT_REWARD, tx);
        }

        return createdTransaction;
      });
    } catch (error) {
      this.logger.error('Failed to process transaction - [Strategy: Night Shift Compliment]', error);
      throw error;
    } finally {
      this.logger.info('Transaction processed - [Strategy: Night Shift Compliment]');
    }
  }

  private calculateSubtotal(dtoItems: CreateTransactionDto['items'], validatedItems: Item[]) {
    return dtoItems.reduce((total, item) => {
      const matchedItem = validatedItems.find((it) => it.id === item.itemId);

      // convert price and qty into decimal
      const price = new Prisma.Decimal(matchedItem.price);
      const quantity = new Prisma.Decimal(item.quantity);

      const value = price.mul(quantity);

      return total.add(value);
    }, new Prisma.Decimal(0));
  }

  private calculateNightShiftComplimentAmount(dtoItems: CreateTransactionDto['items'], validatedItems: Item[]) {
    return dtoItems.reduce((total, item) => {
      const matchedItem = validatedItems.find((it) => it.id === item.itemId);

      let value = new Prisma.Decimal(0);

      if (matchedItem.canBeComplimented) {
        const quantity = new Prisma.Decimal(item.quantity);
        const price = new Prisma.Decimal(matchedItem.price);
        const rate = new Prisma.Decimal(NIGHT_SHIFT_COMPLIMENT_RATE);

        // price * NIGHT_SHIFT_COMPLIMENT_RATE * quantity
        value = price.mul(rate).mul(quantity);
      }

      return total.add(value);
    }, new Prisma.Decimal(0));
  }
}
