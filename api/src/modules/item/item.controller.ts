import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  public async findItems(@Query('q') keywordParams: string) {
    const keyword = decodeURIComponent(keywordParams ?? '');

    return await this.itemService.findItems(keyword);
  }

  @Get(':id')
  public async findItem(@Param('id') id: string) {
    return await this.itemService.findItemById(id);
  }

  @Post()
  public async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }

  @Put(':id')
  public async editItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  public async deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }
}
