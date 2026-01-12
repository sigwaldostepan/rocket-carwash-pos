import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FindCustomersDto } from './dtos/find-customer.dto';
import { CustomerService } from './customer.service';
import { paginateResponse } from '../../common/helpers';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  public async findCustomers(@Query() findCustomersDto: FindCustomersDto) {
    const { page, limit } = findCustomersDto;

    const { customers, total } = await this.customerService.findCustomers(findCustomersDto);

    return paginateResponse(customers, page, limit, total);
  }

  @Get(':id')
  public async findCustomer(@Param('id') id: string) {
    const customer = await this.customerService.findCustomerById(id);

    return customer;
  }

  @Post()
  public async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const updatedCustomer = await this.customerService.createCustomer(createCustomerDto);

    return updatedCustomer;
  }

  @Put(':id')
  public async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return await this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  public async deleteCustomer(@Param('id') id: string) {
    return await this.customerService.deleteCustomer(id);
  }
}
