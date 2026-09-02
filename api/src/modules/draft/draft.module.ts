import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/persistance/database/prisma/prisma.module';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

@Module({
  imports: [PrismaModule],
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}