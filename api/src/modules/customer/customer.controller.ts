import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/enums';
import { paginateResponse } from '../../common/helpers';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { FindCustomersDto } from './dtos/find-customers.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { BatchDeleteCustomerDto } from './dtos/batch-delete-customer.dto';

@Roles([Role.cashier, Role.owner])
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  public async findMany(@Query() dto: FindCustomersDto) {
    const { page, limit } = dto;

    const { customers, total } = await this.customerService.findMany(dto);

    return paginateResponse(customers, page, limit, total);
  }

  @Get(':id')
  public async findById(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customerService.findById(id);

    return customer;
  }

  @Post()
  public async create(@Body() dto: CreateCustomerDto) {
    const updatedCustomer = await this.customerService.create(dto);

    return updatedCustomer;
  }

  @Put(':id')
  public async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCustomerDto) {
    return await this.customerService.update(id, dto);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.customerService.delete(id);
  }

  @Post('/batch-delete')
  public async batchDelete(@Body() dto: BatchDeleteCustomerDto) {
    return await this.customerService.batchDelete(dto);
  }
}
