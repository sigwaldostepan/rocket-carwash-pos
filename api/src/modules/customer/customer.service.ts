import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CUSTOMER_BASE_SELECT, CUSTOMER_SELECT_WITH_TRANSACTION_COUNT } from './customer.select';
import { BatchDeleteCustomerDto } from './dtos/batch-delete-customer.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { FindCustomersDto } from './dtos/find-customers.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { isPhoneNumber } from 'class-validator';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async findMany(dto: FindCustomersDto) {
    try {
      this.logger.info('Finding many customers', { query: dto });
      const whereClause = this.constructWhere(dto);

      const [customers, total] = await Promise.all([
        this.prisma.customer.findMany({
          where: whereClause,
          take: dto.limit,
          skip: dto.offset,
          select: CUSTOMER_SELECT_WITH_TRANSACTION_COUNT,
          orderBy: {
            name: 'asc',
          },
        }),
        this.prisma.customer.count({
          where: whereClause,
        }),
      ]);

      const customersData = customers.map(({ _count, ...customer }) => ({
        ...customer,
        transactionCount: _count.transaction,
      }));

      return {
        customers: customersData,
        total,
      };
    } catch (error) {
      this.logger.error('Error finding many customers', { error });
      throw error;
    }
  }

  public async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: CUSTOMER_BASE_SELECT,
    });

    return customer ?? null;
  }

  public async create(dto: CreateCustomerDto) {
    this.logger.info('Creating a new customer', { data: dto });

    try {
      const customer = await this.prisma.customer.create({
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          code: this.generateCustomerCode(),
        },
      });

      return customer;
    } catch (error) {
      this.logger.error('Error creating new customer', { error });
      throw error;
    }
  }

  public async update(id: string, dto: UpdateCustomerDto) {
    this.logger.info(`Updating customer with id: ${id}`, { data: dto });

    try {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!existingCustomer) {
        this.logger.error(`Customer with id: ${id} not found`);
        throw new NotFoundException('Customer nggak ketemu');
      }

      const updatedCustomer = await this.prisma.customer.update({
        where: { id },
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          point: dto.point,
        },
      });

      return updatedCustomer;
    } catch (error) {
      this.logger.error('Error updating customer', { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.warn(`Deleting customer with id: ${id}`);

    try {
      const existingCustomer = await this.prisma.customer.delete({
        where: { id },
      });

      if (!existingCustomer) {
        this.logger.error(`Customer with id: ${id} nggak ketemu`);
        throw new NotFoundException('Customer nggak ketemu');
      }

      return existingCustomer;
    } catch (error) {
      this.logger.error('Error deleting customer', { error });
      throw error;
    }
  }

  public async batchDelete(batchDeleteCustomerDto: BatchDeleteCustomerDto) {
    this.logger.info('Batch deleting customers', { ids: batchDeleteCustomerDto.ids });

    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          id: {
            in: batchDeleteCustomerDto.ids,
          },
        },
      });

      if (customers.length !== batchDeleteCustomerDto.ids.length) {
        const notFoundCustomers = batchDeleteCustomerDto.ids.filter(
          (id) => !customers.some((customer) => customer.id === id),
        );

        this.logger.error(`Batch delete failed: Customer with id ["${notFoundCustomers.join(', ')}"] not found`);

        throw new NotFoundException(`Customer ${notFoundCustomers.join(', ')} nggak ketemu`);
      }

      await this.prisma.customer.deleteMany({
        where: {
          id: {
            in: batchDeleteCustomerDto.ids,
          },
        },
      });
    } catch (error) {
      this.logger.error('Error batch deleting customers', { error });
      throw error;
    }
  }

  private constructWhere(dto: FindCustomersDto) {
    const where: Prisma.CustomerWhereInput = {};

    // search
    if (dto.search) {
      const field = isPhoneNumber(dto.search ?? '') ? 'phoneNumber' : 'name';

      where[field] = {
        startsWith: dto.search,
        mode: 'insensitive',
      };
    }

    return where;
  }

  private generateCustomerCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const now = new Date();
    const year = now.getFullYear() % 100;
    const date = now.getDate().toString().padStart(2, '0');
    const month = now.getMonth().toString().padStart(2, '0');

    let uniqueCode = '';

    for (let i = 0; i < 5; i++) {
      uniqueCode += chars.charAt(Math.random() * chars.length).toUpperCase();
    }

    const customerCode = `RO${year}${month}${date}${uniqueCode}`;

    return customerCode;
  }
}
