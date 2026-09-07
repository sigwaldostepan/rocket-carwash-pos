import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateDraftDto } from './dto/create-draft.dto';
import { DRAFT_SELECT } from './draft.select';

@Injectable()
export class DraftService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async create(dto: CreateDraftDto) {
    this.logger.info('Creating draft');

    try {
      return await this.prisma.draft.create({
        data: {
          customerId: dto.customerId,
          detail: {
            create: dto.items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              redeemedQuantity: item.redeemedQuantity ?? 0,
            })),
          },
        },
      });
    } catch (error) {
      this.logger.error('Error creating draft', { error });
      throw error;
    }
  }

  public async findMany() {
    this.logger.info('Finding drafts');

    try {
      const drafts = await this.prisma.draft.findMany({
        select: DRAFT_SELECT,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return drafts;
    } catch (error) {
      this.logger.error('Error finding drafts', { error });
      throw error;
    }
  }

  public async delete(id: string) {
    this.logger.info(`Deleting draft with id ${id}`);

    try {
      return await this.prisma.draft.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting draft with id ${id}`, { error });
      throw error;
    }
  }
}
