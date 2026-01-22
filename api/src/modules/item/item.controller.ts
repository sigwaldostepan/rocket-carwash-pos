import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/enums';
import { CreateItemDto } from './dto/create-item.dto';
import { FindItemsDto } from './dto/find-items.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';

@Roles([Role.owner, Role.cashier])
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  public async findMany(@Query() findItemsDto: FindItemsDto) {
    const items = await this.itemService.findMany(findItemsDto);

    return items;
  }

  @Get(':id')
  public async findItem(@Param('id') id: string) {
    return await this.itemService.findById(id);
  }

  @Post()
  public async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto);
  }

  @Put(':id')
  public async editItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  public async deleteItem(@Param('id') id: string) {
    return this.itemService.delete(id);
  }
}
