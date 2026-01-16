import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { LoggerModule } from 'src/infra/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), PrismaModule, LoggerModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
