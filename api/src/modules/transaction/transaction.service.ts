import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionDetail } from './entities';
import { Between, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';
import { POINT_REWARD, REDEEM_POINT_COST } from './transaction.constant';
import { FindTransactionDto } from './dto/find-transaction.dto';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import * as ExcelJS from 'exceljs';
import { ComplimentSummary, PaymentMethodSummary } from './types';
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly custService: CustomerService,
    @InjectRepository(Transaction)
    private readonly transRepo: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private readonly transDetailRepo: Repository<TransactionDetail>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(Customer)
    private readonly custRepo: Repository<Customer>,
    private readonly expenseService: ExpenseService,
  ) {}

  public async findTransactions(findTransactionDto: FindTransactionDto) {
    const { limit, offset, dateFrom, range } = findTransactionDto;

    const query = this.transRepo
      .createQueryBuilder('transaction')
      .orderBy('transaction.invoiceNo', 'ASC')
      .leftJoinAndSelect('transaction.customer', 'customer')
      .leftJoinAndSelect('transaction.details', 'details')
      .leftJoinAndSelect('details.item', 'item')
      .take(limit)
      .skip(offset);

    this.assignDateFilter(dateFrom, range, query);

    const [transactions, total] = await query.getManyAndCount();

    return {
      transactions,
      total,
    };
  }

  public async getTransactionSummary(findTransactionDto: FindTransactionDto) {
    const [transactionCount, transactionTotalAmount, paymentMethodSummary, complimentSummary, netIncomeResult] =
      await Promise.all([
        this.getTransactionCount(findTransactionDto),
        this.getTransactionTotalAmount(findTransactionDto),
        this.getPaymentMethodSummary(findTransactionDto),
        this.getComplimentSummary(findTransactionDto),
        this.getNetIncomeAndTotalExpenses(findTransactionDto),
      ]);

    const { complimentSummary: formattedComplimentSummary, paymentMethodSummary: formattedPaymentMethodSummary } =
      this.formatSummaryResponse(complimentSummary, paymentMethodSummary, transactionTotalAmount);

    return {
      transactionCount,
      transactionTotalAmount,
      paymentMethodSummary: formattedPaymentMethodSummary,
      complimentSummary: formattedComplimentSummary,
      netIncome: netIncomeResult.netIncome,
      totalExpense: netIncomeResult.totalExpense,
    };
  }

  public async exportTransactionsExcel(exportTransactionExcelDto: FindTransactionDto) {
    const { transactions } = await this.findTransactions(exportTransactionExcelDto);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transaksi');

    worksheet.columns = [
      { header: 'Invoice No', key: 'invoiceNo' },
      { header: 'Customer', key: 'customer' },
      { header: 'Payment Method', key: 'paymentMethod' },
      { header: 'Tanggal', key: 'createdAt' },
      { header: 'Item', key: 'item' },
      { header: 'Subtotal', key: 'subtotal' },
      { header: 'Diskon (komplimen/tukar poin)', key: 'discount' },
      { header: 'Komplimen Shift Malam', key: 'nightShiftCompliment' },
      { header: 'Total Uang Masuk', key: 'transTotal' },
    ];

    worksheet.addRows(
      transactions.map((transaction) => {
        const subtotal = transaction.details.reduce((total, detail) => {
          const itemPrice = detail.item?.price ?? 0;
          const quantity = detail.quantity;
          const redeemedQuantity = detail.redeemedQuantity;

          return total + (itemPrice * quantity - itemPrice * redeemedQuantity);
        }, 0);

        const discount = transaction.details.reduce((total, detail) => {
          const itemPrice = detail.item?.price ?? 0;
          const redeemedQuantity = detail.redeemedQuantity;

          const redeemedAmount = +redeemedQuantity * +itemPrice;
          const { complimentValue, isNightShift } = transaction;

          const complimentAmount = isNightShift ? 0 : +complimentValue;

          return total + redeemedAmount + complimentAmount;
        }, 0);

        return {
          invoiceNo: transaction.invoiceNo,
          customer: transaction.customer?.name || '-',
          paymentMethod: transaction.paymentMethod,
          createdAt: transaction.createdAt,
          item: transaction.details.map((detail) => detail.item?.name ?? '-').join(', '),
          subtotal,
          discount,
          nightShiftCompliment: transaction.isNightShift ? transaction.complimentValue : 0,
          transTotal: transaction.transTotal,
        };
      }),
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  public async findTransactionById(id: string) {
    const transaction = await this.transRepo.findOne({
      where: {
        id,
      },
      relations: ['details', 'details.item'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi gak ketemu');
    }

    return transaction;
  }

  public async createTransaction(createTransactionDto: CreateTransactionDto) {
    let customer = null;

    if (createTransactionDto.customerId) {
      customer = await this.custService.findById(createTransactionDto.customerId);
    }

    const dtoItemsId = createTransactionDto.items.map((dtoItem) => dtoItem.itemId);
    const items = await this.itemRepo.find({
      where: {
        id: In(dtoItemsId),
      },
    });

    const foundItemIds = items.map((item) => item.id);
    const notFoundItems = createTransactionDto.items.filter((dtoItem) => !foundItemIds.includes(dtoItem.itemId));

    if (notFoundItems.length > 0) {
      throw new NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
    }

    const totalRedeemedItems = createTransactionDto.items.reduce(
      (total, item) => total + (item.redeemedQuantity ?? 0),
      0,
    );
    const isRedeemPoints = totalRedeemedItems > 0;

    if (!customer && isRedeemPoints) {
      throw new UnprocessableEntityException('Transaksi tanpa customer, tidak bisa redeem point');
    }

    if (isRedeemPoints && customer) {
      const requiredPoint = REDEEM_POINT_COST * totalRedeemedItems;
      if (customer.point < requiredPoint) {
        throw new BadRequestException('Point customer gak cukup');
      }

      customer.point -= requiredPoint;
    }

    const addPointTransaction = items.some((item) => !!item.isGetPoint);

    const itemMap = new Map(items.map((item) => [item.id, item]));
    if (addPointTransaction && customer) {
      const pointsToAdd = createTransactionDto.items.reduce((total, dtoItem) => {
        const item = itemMap.get(dtoItem.itemId);

        if (item.isGetPoint) {
          const notRedeemedQuantity = dtoItem.quantity - (dtoItem.redeemedQuantity ?? 0);

          return (total += POINT_REWARD * notRedeemedQuantity);
        }

        return total;
      }, 0);

      customer.point += pointsToAdd;
    }

    let nightShiftCompliment = 0;

    const transactionDetail: TransactionDetail[] = createTransactionDto.items.map((dtoItem) => {
      const isRedeemed = dtoItem.redeemedQuantity > 0;
      const matchedItem = itemMap.get(dtoItem.itemId);
      if (!matchedItem) {
        throw new NotFoundException(`Item ${matchedItem.name} gak ketemu`);
      }

      if (!matchedItem.isRedeemable && isRedeemed) {
        throw new UnprocessableEntityException(`Item ${matchedItem.name} gak bisa diredeem`);
      }

      const isCompliment = createTransactionDto.isCompliment && createTransactionDto.complimentAmount > 0;
      const isItemComplimentable = matchedItem.canBeComplimented;

      if (isCompliment && !isItemComplimentable) {
        throw new UnprocessableEntityException(`Item ${matchedItem.name} tidak bisa diberikan sebagai komplimen`);
      }

      if (createTransactionDto.isNightShift && matchedItem.canBeComplimented) {
        nightShiftCompliment += (matchedItem.price - matchedItem.price * 0.4) * dtoItem.quantity;
      }

      const entity = this.transDetailRepo.create({
        item: matchedItem,
        quantity: dtoItem.quantity,
        redeemedQuantity: dtoItem.redeemedQuantity ?? 0,
      });

      return entity;
    });

    const invoiceNo = await this.generateInvoiceNo();

    if (customer) {
      await this.custRepo.update(customer.id, { point: customer.point });
    }

    const complimentValue = createTransactionDto.isNightShift
      ? nightShiftCompliment
      : createTransactionDto.complimentAmount;
    const transTotal = this.calculateTransTotal({
      detail: transactionDetail,
      isNightShift: createTransactionDto.isNightShift,
    });

    const transaction = this.transRepo.create({
      invoiceNo,
      customer,
      transTotal,
      isCompliment: createTransactionDto.isCompliment,
      paymentMethod: createTransactionDto.paymentMethod,
      isNightShift: createTransactionDto.isNightShift,
      details: transactionDetail,
      complimentValue,
    });
    await this.transRepo.save(transaction);

    return {
      ...transaction,
      details: transactionDetail,
    };
  }

  public async deleteTransaction(id: string) {
    const transaction = await this.findTransactionById(id);

    return await this.transRepo.remove(transaction);
  }

  private assignDateFilter(
    dateFrom: string,
    range: FindTransactionDto['range'],
    query: SelectQueryBuilder<Transaction>,
  ) {
    if (!dateFrom) {
      return;
    }

    let from = null;
    let to = null;

    if (range === 'daily' || !range) {
      from = startOfDay(dateFrom);
      to = endOfDay(dateFrom);
    } else if (range === 'weekly') {
      from = startOfWeek(dateFrom);
      to = endOfWeek(dateFrom);
    } else if (range === 'monthly') {
      from = startOfMonth(dateFrom);
      to = endOfMonth(dateFrom);
    } else if (range === 'yearly') {
      from = startOfYear(dateFrom);
      to = endOfYear(dateFrom);
    } else if (range === 'toToday') {
      from = startOfDay(dateFrom);
      to = endOfDay(new Date());
    } else {
      throw new UnprocessableEntityException('Tipe range gak valid');
    }

    query.where('transaction.createdAt BETWEEN :from AND :to', { from, to });
  }

  private async getTransactionCount(findTransactionDto: FindTransactionDto) {
    const { dateFrom, range } = findTransactionDto;
    const query = this.transRepo.createQueryBuilder('transaction').select('COUNT(*)', 'transactionCount');

    this.assignDateFilter(dateFrom, range, query);

    const { transactionCount } = await query.getRawOne();
    return +transactionCount;
  }

  private async getTransactionTotalAmount(findTransactionDto: FindTransactionDto) {
    const { dateFrom, range } = findTransactionDto;
    const query = this.transRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.transTotal)', 'sumTransTotal');

    this.assignDateFilter(dateFrom, range, query);

    const { sumTransTotal } = await query.getRawOne();
    return +sumTransTotal;
  }

  private async getPaymentMethodSummary(findTransactionDto: FindTransactionDto): Promise<PaymentMethodSummary[]> {
    const { dateFrom, range } = findTransactionDto;
    const query = this.transRepo
      .createQueryBuilder('transaction')
      .select('transaction.paymentMethod', 'paymentMethod')
      .addSelect('COUNT(transaction.id)', 'count')
      .addSelect('SUM(transaction.transTotal)', 'totalAmount')
      .addGroupBy('transaction.paymentMethod');

    this.assignDateFilter(dateFrom, range, query);

    const result = await query.getRawMany();

    return result;
  }

  private async getComplimentSummary(findTransactionDto: FindTransactionDto): Promise<ComplimentSummary> {
    const { dateFrom, range } = findTransactionDto;
    const query = this.transRepo
      .createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN transaction.isNightShift = true THEN transaction.complimentValue ELSE 0 END)',
        'nightShiftComplimentAmount',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.isNightShift = false THEN transaction.complimentValue ELSE 0 END)',
        'normalComplimentAmount',
      )
      .addSelect('COUNT(*)', 'complimentCount')
      .addSelect('COUNT(CASE WHEN transaction.isNightShift = true THEN 1 END)', 'nightShiftComplimentCount')
      .addSelect('COUNT(CASE WHEN transaction.isNightShift = false THEN 1 END)', 'normalComplimentCount');

    this.assignDateFilter(dateFrom, range, query);

    query.andWhere('transaction.isCompliment = :isCompliment', { isCompliment: true });

    const result = await query.getRawOne();

    return result;
  }

  private async getNetIncomeAndTotalExpenses(findTransactionDto: FindTransactionDto) {
    const { dateFrom, range } = findTransactionDto;

    const totalIncomeQuery = this.transRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.transTotal)', 'totalIncome');

    this.assignDateFilter(dateFrom, range, totalIncomeQuery);
    const { totalIncome } = await totalIncomeQuery.getRawOne();

    const { totalAmount: totalExpense } = await this.expenseService.getSummary({
      dateFrom,
      range,
      offset: 0,
    });

    const netIncome = +totalIncome - +totalExpense;

    return { netIncome, totalExpense };
  }

  private formatSummaryResponse(
    complimentSummary: ComplimentSummary,
    paymentMethodSummary: PaymentMethodSummary[],
    totalAmount: number,
  ) {
    const { nightShiftComplimentAmount, nightShiftComplimentCount, normalComplimentAmount, normalComplimentCount } =
      complimentSummary;

    const updatedPaymentMethodSummary = paymentMethodSummary.map((summary) => ({
      ...summary,
      percentage: totalAmount > 0 ? ((+summary.totalAmount / totalAmount) * 100).toFixed(2) : 0,
    }));

    const nightShiftPercentage =
      totalAmount && +totalAmount > 0 ? -((+nightShiftComplimentAmount / +totalAmount) * 100).toFixed(2) : '0.00';
    const normalComplimentPercentage =
      totalAmount && +totalAmount > 0 ? ((+normalComplimentAmount / +totalAmount) * 100).toFixed(2) : '0.00';

    return {
      paymentMethodSummary: updatedPaymentMethodSummary,
      complimentSummary: {
        normalCompliment: {
          value: normalComplimentAmount,
          count: normalComplimentCount,
          percentage: normalComplimentPercentage,
        },
        nightShiftCompliment: {
          value: nightShiftComplimentAmount,
          count: nightShiftComplimentCount,
          percentage: nightShiftPercentage,
        },
      },
    };
  }

  private calculateTransTotal({ detail, isNightShift }: { detail: TransactionDetail[]; isNightShift: boolean }) {
    const transTotal = detail.reduce((total, detail) => {
      const { item, quantity, redeemedQuantity } = detail;
      const notRedeemedQuantity = quantity - redeemedQuantity;

      let transTotal = item.price * notRedeemedQuantity;

      if (isNightShift) {
        if (item.canBeComplimented) transTotal -= transTotal * 0.4;
      }

      return total + transTotal;
    }, 0);

    return transTotal;
  }

  private async generateInvoiceNo(): Promise<string> {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear() % 100).padStart(2, '0');

    const utcFrom = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const utcTo = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

    const countToday = await this.transRepo.count({
      where: {
        createdAt: Between(utcFrom, utcTo),
      },
    });

    const formattedDate = `${year}${month}${day}`;

    return `RO-${formattedDate}-${String(countToday + 1).padStart(4, '0')}`;
  }
}
