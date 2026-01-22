import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateItemDto } from './dto/create-item.dto';
import { FindItemsDto } from './dto/find-items.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async findMany(dto: FindItemsDto) {
    try {
      this.logger.info('Finding many items', { query: dto });
      const whereClause = this.constructWhere(dto);

      const items = await this.prisma.item.findMany({
        where: whereClause,
        orderBy: {
          name: 'asc',
        },
      });

      return items;
    } catch (error) {
      this.logger.error('Error finding many items', { error });
      throw error;
    }
  }

  public async findById(id: string) {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id },
      });

      if (!item) {
        this.logger.warn(`Item with id: ${id} not found`);
        return null;
      }

      return item;
    } catch (error) {
      this.logger.error(`Error finding item with id: ${id}`, { error });
      throw error;
    }
  }

  public async create(createItemDto: CreateItemDto) {
    this.logger.info('Creating a new item', { data: createItemDto });

    try {
      const item = await this.prisma.item.create({
        data: createItemDto,
      });

      this.logger.info('Item created successfully', { itemId: item.id });
      return item;
    } catch (error) {
      this.logger.error('Error creating new item', { error, data: createItemDto });
      throw error;
    }
  }

  public async update(id: string, updateItemDto: UpdateItemDto) {
    this.logger.info(`Updating item with id: ${id}`, { data: updateItemDto });

    try {
      const existingItem = await this.findById(id);

      if (!existingItem) {
        this.logger.error(`Item with id: ${id} not found`);
        throw new NotFoundException('Item tidak ditemukan');
      }

      const updatedItem = await this.prisma.item.update({
        where: { id },
        data: {
          name: updateItemDto.name,
          price: updateItemDto.price,
          canBeComplimented: updateItemDto.canBeComplimented,
          isGetPoint: updateItemDto.isGetPoint,
          isRedeemable: updateItemDto.isRedeemable,
        },
      });

      this.logger.info(`Item with id: ${id} updated successfully`);
      return updatedItem;
    } catch (error) {
      this.logger.error(`Error updating item with id: ${id}`, { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.warn(`Deleting item with id: ${id}`);

    try {
      const existingItem = await this.findById(id);

      if (!existingItem) {
        this.logger.error(`Item with id: ${id} not found`);
        throw new NotFoundException('Item tidak ditemukan');
      }

      await this.prisma.item.delete({
        where: { id },
      });

      this.logger.info(`Item with id: ${id} deleted successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting item with id: ${id}`, { error });
      throw error;
    }
  }

  private constructWhere(dto: FindItemsDto): Prisma.ItemWhereInput {
    const where: Prisma.ItemWhereInput = {};

    if (dto.search) {
      where.name = {
        contains: dto.search,
        mode: 'insensitive',
      };
    }

    return where;
  }
}
