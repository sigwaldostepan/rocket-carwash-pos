import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from './infra/persistance/database/typeorm/typeorm.module';
import { PrismaModule } from './infra/persistance/database/prisma/prisma.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { ItemModule } from './modules/item/item.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { envConfig } from './config/env.config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './infra/auth/auth.config';
import { LoggerModule } from './infra/logger/logger.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    CustomerModule,
    ItemModule,
    TransactionModule,
    ExpenseModule,
    LoggerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
