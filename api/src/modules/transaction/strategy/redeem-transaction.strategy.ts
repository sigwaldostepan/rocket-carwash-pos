import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Customer, Item, Prisma } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { REDEEM_POINT_COST } from 'src/constants/transaction';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { CustomerService } from 'src/modules/customer/customer.service';
import { Logger } from 'winston';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { InvoiceService } from '../services/invoice.service';
import { TransactionStrategy } from './transaction.strategy';

interface ValidatedData {
  customer: Customer;
  items: Item[];
  pointCost: number;
}

@Injectable()
export class RedeemTransactionStrategy implements TransactionStrategy<ValidatedData> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly customerService: CustomerService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async validate(dto: CreateTransactionDto): Promise<ValidatedData> {
    // Validate customer existance
    if (!dto?.customerId?.trim()) {
      throw new UnprocessableEntityException('Transaksi redeem harus memiliki customer');
    }

    const customer = dto.customerId ? await this.customerService.findById(dto.customerId) : null;
    if (!customer) {
      throw new NotFoundException('Customer tidak ditemukan');
    }

    // Validate all items existance
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

    /*
      sum total redeemed items
      for example:
      items: [
        { redeemedQuantity: 1 },
        { redeemedQuantity: 2 },
      ]
      totalRedeemedItems = 3
    */
    const totalRedeemedItems = dto.items.reduce((acc, item) => acc + (item.redeemedQuantity ?? 0), 0);

    /*
      Validate customer has enough points
      calculate point needed
      e.g: totalRedeemedItems = 3, REDEEM_POINT_COST = 10 (the point cost for redeeming an item)
      requiredPoint = 3 * 10 = 30
    */
    const pointCost = totalRedeemedItems * REDEEM_POINT_COST;
    if (customer.point < pointCost) {
      throw new UnprocessableEntityException(
        `Point customer tidak cukup. Dibutuhkan: ${pointCost}, Tersedia: ${customer.point}`,
      );
    }

    // create map of purchased items, for easier lookup
    const itemMap = new Map(purchasedItems.map((item) => [item.id, item]));
    // Validate items are redeemable
    dto.items.forEach((purchasedItem) => {
      if (purchasedItem.redeemedQuantity > 0) {
        const item = itemMap.get(purchasedItem.itemId);

        if (item && !item.isRedeemable) {
          throw new UnprocessableEntityException(`Item ${item.name} tidak bisa diredeem`);
        }

        // Validate redeemed quantity doesn't exceed purchased quantity
        if (purchasedItem.redeemedQuantity > purchasedItem.quantity) {
          throw new UnprocessableEntityException(
            `Jumlah redeem (${purchasedItem.redeemedQuantity}) tidak boleh lebih dari jumlah beli (${purchasedItem.quantity})`,
          );
        }
      }
    });

    return {
      customer,
      items: purchasedItems,
      pointCost,
    };
  }

  async process(dto: CreateTransactionDto, validatedData: ValidatedData) {
    this.logger.info('Processing transaction - [Strategy: Redeem]');

    try {
      return this.prisma.$transaction(async (tx) => {
        const invoiceNo = await this.invoiceService.generateInvoiceNo();

        // transaction total calculation
        const subtotal = this.calculateSubtotal(dto.items, validatedData.items);
        const total = subtotal.add(validatedData.pointCost);

        const data: Prisma.TransactionCreateInput = {
          invoiceNo,
          complimentValue: 0,
          isCompliment: false,
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

        // save transaction
        const createdTransaction = await tx.transaction.create({ data });

        // update customer point
        await this.customerService.deductPoints(validatedData.customer.id, validatedData.pointCost, tx);

        return createdTransaction;
      });
    } catch (error) {
      this.logger.error('Error processing transaction - [Strategy: Redeem]', { error });
      throw error;
    } finally {
      this.logger.info('Transaction processed - [Strategy: Redeem]');
    }
  }

  private calculateSubtotal(items: CreateTransactionDto['items'], validatedItems: Item[]) {
    return items.reduce((total, item) => {
      const matchedItem = validatedItems.find((it) => it.id === item.itemId);

      // convert price and qty into decimal
      const price = new Prisma.Decimal(matchedItem.price);
      const quantity = new Prisma.Decimal(item.quantity);

      const value = price.mul(quantity);

      return total.add(value);
    }, new Prisma.Decimal(0));
  }

  private calculateTotal(items: CreateTransactionDto['items'], validatedItems: Item[]) {
    return items.reduce((total, item) => {
      const matchedItem = validatedItems.find((it) => it.id === item.itemId);

      // convert price and qty into decimal
      const price = new Prisma.Decimal(matchedItem.price);
      const quantity = new Prisma.Decimal(item.quantity);

      const value = item.redeemedQuantity ? 0 : price.mul(quantity);

      return total.add(value);
    }, new Prisma.Decimal(0));
  }
}
