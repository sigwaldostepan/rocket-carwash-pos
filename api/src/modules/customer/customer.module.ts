import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/infra/logger/logger.module';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
