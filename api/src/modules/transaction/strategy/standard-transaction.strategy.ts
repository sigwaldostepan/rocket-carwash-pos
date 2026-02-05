import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Item, Prisma, Transaction } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { POINT_REWARD } from 'src/constants/transaction';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { InvoiceService } from '../services/invoice.service';
import { TransactionStrategy } from './transaction.strategy';
import { CustomerService } from 'src/modules/customer/customer.service';

interface ValidatedData {
  items: Item[];
  isGetPoint: boolean;
}

@Injectable()
export class StandardTransactionStrategy implements TransactionStrategy<ValidatedData> {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async validate(dto: CreateTransactionDto): Promise<ValidatedData> {
    // Validate that all items exist
    const purchasedItemIds = dto.items.map((item) => item.itemId);

    const purchasedItems = await this.prisma.item.findMany({
      where: {
        id: { in: purchasedItemIds },
      },
    });

    const foundItemIds = purchasedItems.map((item) => item.id);
    const notFoundItems = purchasedItemIds.filter((itemId) => !foundItemIds.includes(itemId));

    if (notFoundItems.length > 0) {
      throw new NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
    }

    // check if customer purchased item(s) that get point
    const isGetPoint = purchasedItems.some((item) => item.isGetPoint);

    return { items: purchasedItems, isGetPoint };
  }

  async process(dto: CreateTransactionDto, validatedData: ValidatedData): Promise<Transaction> {
    this.logger.info('Processing transaction - [Strategy: Standard]');

    try {
      return this.prisma.$transaction(async (tx) => {
        const customer = dto.customerId ? await this.customerService.findById(dto.customerId, tx) : null;

        const invoiceNo = await this.invoiceService.generateInvoiceNo();
        const total = this.calculateTotal(dto.items, validatedData.items);

        const data: Prisma.TransactionCreateInput = {
          invoiceNo,
          complimentValue: 0,
          isCompliment: false,
          paymentMethod: dto.paymentMethod,
          isNightShift: false,
          total,
          subtotal: total,
          transactionDetail: {
            create: dto.items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              redeemedQuantity: 0,
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

        const result = await tx.transaction.create({ data });

        // if customer exists and purchased item(s) that get point
        // add customer point with POINT_REWARD
        if (validatedData.isGetPoint && !!customer) {
          await this.customerService.addPoints(customer.id, POINT_REWARD, tx);
        }

        return result;
      });
    } catch (error) {
      this.logger.error('Error processing transaction - [Strategy: Standard]', { error });
      throw error;
    } finally {
      this.logger.info('Transaction processed - [Strategy: Standard]');
    }
  }

  private calculateTotal(items: CreateTransactionDto['items'], validatedItems: Item[]) {
    return items.reduce((total, item) => {
      const matchedItem = validatedItems.find((it) => it.id === item.itemId);

      if (!matchedItem) {
        return total;
      }

      const price = new Prisma.Decimal(matchedItem.price);
      const quantity = new Prisma.Decimal(item.quantity);

      return total.add(price.mul(quantity));
    }, new Prisma.Decimal(0));
  }
}
