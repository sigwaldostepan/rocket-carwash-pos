import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { FindCustomersDto } from './dtos/find-customer.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  public async findCustomers({ limit, offset, q, by }: FindCustomersDto) {
    const query = this.customerRepo.createQueryBuilder('customer');

    const whitelistSearchBy = ['phoneNumber', 'name'];
    const searchBy = whitelistSearchBy.includes(by) ? by : 'name';

    if (q) {
      query.where(`customer.${searchBy} ILIKE :keyword`, { keyword: `%${q}%` });
    }

    const [customers, total] = await query.orderBy('customer.name', 'ASC').take(limit).skip(offset).getManyAndCount();

    return {
      customers,
      total,
    };
  }

  public async findCustomerById(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer nggak ketemu');
    }

    return customer;
  }

  public async createCustomer(createCustomerDto: CreateCustomerDto) {
    const { name, phoneNumber } = createCustomerDto;
    const customer = this.customerRepo.create({
      code: this.generateCustomerCode(),
      name,
      phoneNumber,
    });

    await this.customerRepo.save(customer);

    return customer;
  }

  public async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findCustomerById(id);

    const updatedCustomer = this.customerRepo.merge(customer, updateCustomerDto);
    await this.customerRepo.save(updatedCustomer);

    return updatedCustomer;
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

  public async deleteCustomer(id: string) {
    const customer = await this.findCustomerById(id);

    return await this.customerRepo.delete(customer);
  }
}
