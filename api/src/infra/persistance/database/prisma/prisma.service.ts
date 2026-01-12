import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { env } from 'src/config/env.config';
import { Logger } from 'winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    const connectionString = env.DATABASE_URL;

    if (!connectionString) {
      throw 'Missing DATABASE_URL environment variable';
    }

    const adapter = new PrismaPg({ url: connectionString });

    super({ adapter });
  }

  onModuleInit() {
    this.$connect()
      .then(() => {
        this.logger.info({ message: 'Database connected [ORM: Prisma]' });
      })
      .catch((err) => {
        console.log('Database connection error', err);
      });
  }

  onModuleDestroy() {
    this.$disconnect();
  }
}
