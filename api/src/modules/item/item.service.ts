import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  public async findItems(keyword: string) {
    const query = this.itemRepo.createQueryBuilder('item');

    if (keyword) {
      query.where('item.name ILIKE :keyword', { keyword: `%${keyword}%` });
    }

    const items = await query.orderBy('item.name', 'ASC').getMany();

    return items;
  }

  public async findItemById(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item gak ketemu');
    }

    return item;
  }

  public async createItem(createItemDto: CreateItemDto) {
    const { name, price, isRedeemable, isGetPoint, canBeComplimented } = createItemDto;

    const item = this.itemRepo.create({
      name,
      price,
      isRedeemable,
      isGetPoint,
      canBeComplimented,
    });

    return this.itemRepo.save(item);
  }

  public async updateItem(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.findItemById(id);

    const updatedItem = this.itemRepo.merge(item, updateItemDto);
    await this.itemRepo.save(updatedItem);

    return updatedItem;
  }

  public async deleteItem(id: string) {
    const item = await this.findItemById(id);

    return await this.itemRepo.delete(item);
  }
}
