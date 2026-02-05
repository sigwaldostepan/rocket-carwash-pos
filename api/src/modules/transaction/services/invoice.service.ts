import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoiceNo(): Promise<string> {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear() % 100).padStart(2, '0');

    const utcFrom = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const utcTo = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

    const transactionCount = await this.prisma.transaction.count({
      where: {
        createdAt: {
          lt: utcTo,
          gte: utcFrom,
        },
      },
    });

    const formattedDate = `${year}${month}${day}`;

    return `RO-${formattedDate}-${String(transactionCount + 1).padStart(4, '0')}`;
  }
}
