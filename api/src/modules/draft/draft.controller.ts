import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { Role } from 'generated/prisma/client';
import { CreateDraftDto } from './dto/create-draft.dto';
import { DraftService } from './draft.service';

@Roles([Role.cashier, Role.owner])
@Controller('drafts')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Get()
  findMany() {
    return this.draftService.findMany();
  }

  @Post()
  create(@Body() createDraftDto: CreateDraftDto) {
    return this.draftService.create(createDraftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.draftService.delete(id);
  }
}