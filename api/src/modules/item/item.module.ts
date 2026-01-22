import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { Item } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), PrismaModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
