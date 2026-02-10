import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseReportService } from './expense-report.service';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Prisma } from 'generated/prisma/client';

const mockPrismaService = {
  expense: {
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  expenseCategory: {
    findMany: jest.fn(),
  },
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('ExpenseReportService', () => {
  let service: ExpenseReportService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ExpenseReportService>(ExpenseReportService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExpenseReport', () => {
    const dto = {
      dateFrom: '2026-02-01',
      dateTo: '2026-02-09',
    };

    const mockExpenseCount = 25;
    const mockAggregates = {
      _sum: {
        amount: new Prisma.Decimal(5000000),
      },
    };
    const mockCategoryGroupBy = [
      {
        categoryId: 'cat-1',
        _count: { id: 10 },
        _sum: { amount: new Prisma.Decimal(3000000) },
      },
      {
        categoryId: 'cat-2',
        _count: { id: 8 },
        _sum: { amount: new Prisma.Decimal(1500000) },
      },
      {
        categoryId: 'cat-3',
        _count: { id: 7 },
        _sum: { amount: new Prisma.Decimal(500000) },
      },
    ];
    const mockCategories = [
      { id: 'cat-1', name: 'Bahan Baku' },
      { id: 'cat-2', name: 'Listrik & Air' },
      { id: 'cat-3', name: 'Gaji Karyawan' },
    ];

    beforeEach(() => {
      mockPrismaService.expense.count.mockResolvedValue(mockExpenseCount);
      mockPrismaService.expense.aggregate.mockResolvedValue(mockAggregates);
      mockPrismaService.expense.groupBy.mockResolvedValue(mockCategoryGroupBy);
      mockPrismaService.expenseCategory.findMany.mockResolvedValue(mockCategories);
    });

    it('should return expense report with summary and category breakdown', async () => {
      const result = await service.getExpenseReport(dto);

      expect(result.summary).toBeDefined();
      expect(result.categorySummary).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith('Getting expense report', { data: dto });
    });

    it('should return correct expense summary values', async () => {
      const result = await service.getExpenseReport(dto);

      expect(result.summary.expenseCount).toBe(25);
      expect(result.summary.totalAmount).toBe(5000000);
    });

    it('should return category summary with contribution percentages', async () => {
      const result = await service.getExpenseReport(dto);

      expect(result.categorySummary).toHaveLength(3);

      // Bahan Baku: 3M / 5M * 100 = 60%
      const bahanBaku = result.categorySummary.find((c) => c.category.id === 'cat-1');
      expect(bahanBaku).toBeDefined();
      expect(bahanBaku?.category.name).toBe('Bahan Baku');
      expect(bahanBaku?.expenseCount).toBe(10);
      expect(bahanBaku?.total).toBe(3000000);
      expect(bahanBaku?.contributionPercent).toBe(60);

      // Listrik & Air: 1.5M / 5M * 100 = 30%
      const listrik = result.categorySummary.find((c) => c.category.id === 'cat-2');
      expect(listrik).toBeDefined();
      expect(listrik?.contributionPercent).toBe(30);

      // Gaji Karyawan: 0.5M / 5M * 100 = 10%
      const gaji = result.categorySummary.find((c) => c.category.id === 'cat-3');
      expect(gaji).toBeDefined();
      expect(gaji?.contributionPercent).toBe(10);
    });

    it('should call prisma with correct date range filter', async () => {
      await service.getExpenseReport(dto);

      expect(mockPrismaService.expense.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      });

      expect(mockPrismaService.expense.aggregate).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
        _sum: {
          amount: true,
        },
      });

      expect(mockPrismaService.expense.groupBy).toHaveBeenCalledWith({
        by: 'categoryId',
        _sum: { amount: true },
        _count: { id: true },
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
      });
    });

    it('should fetch category names for all grouped category IDs', async () => {
      await service.getExpenseReport(dto);

      expect(mockPrismaService.expenseCategory.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['cat-1', 'cat-2', 'cat-3'],
          },
        },
      });
    });

    it('should handle zero expenses gracefully', async () => {
      mockPrismaService.expense.count.mockResolvedValue(0);
      mockPrismaService.expense.aggregate.mockResolvedValue({
        _sum: { amount: null },
      });
      mockPrismaService.expense.groupBy.mockResolvedValue([]);
      mockPrismaService.expenseCategory.findMany.mockResolvedValue([]);

      const result = await service.getExpenseReport(dto);

      expect(result.summary.expenseCount).toBe(0);
      expect(result.summary.totalAmount).toBe(0);
      expect(result.categorySummary).toHaveLength(0);
    });

    it('should handle null aggregate amount with default of 0', async () => {
      mockPrismaService.expense.aggregate.mockResolvedValue({
        _sum: { amount: null },
      });

      const result = await service.getExpenseReport(dto);

      expect(result.summary.totalAmount).toBe(0);
    });

    it('should handle undefined date range (default to today)', async () => {
      const dtoWithUndefined = {
        dateFrom: undefined,
        dateTo: undefined,
      };

      await service.getExpenseReport(dtoWithUndefined);

      expect(mockPrismaService.expense.count).toHaveBeenCalled();
      expect(mockPrismaService.expense.aggregate).toHaveBeenCalled();
      expect(mockPrismaService.expense.groupBy).toHaveBeenCalled();
    });

    it('should handle single category', async () => {
      mockPrismaService.expense.groupBy.mockResolvedValue([
        {
          categoryId: 'cat-1',
          _count: { id: 25 },
          _sum: { amount: new Prisma.Decimal(5000000) },
        },
      ]);
      mockPrismaService.expenseCategory.findMany.mockResolvedValue([{ id: 'cat-1', name: 'Bahan Baku' }]);

      const result = await service.getExpenseReport(dto);

      expect(result.categorySummary).toHaveLength(1);
      expect(result.categorySummary[0].contributionPercent).toBe(100);
    });

    it('should handle missing category name gracefully', async () => {
      mockPrismaService.expenseCategory.findMany.mockResolvedValue([
        { id: 'cat-1', name: 'Bahan Baku' },
        // cat-2 missing from results
      ]);
      mockPrismaService.expense.groupBy.mockResolvedValue([
        {
          categoryId: 'cat-1',
          _count: { id: 10 },
          _sum: { amount: new Prisma.Decimal(3000000) },
        },
        {
          categoryId: 'cat-2',
          _count: { id: 8 },
          _sum: { amount: new Prisma.Decimal(2000000) },
        },
      ]);

      const result = await service.getExpenseReport(dto);

      const missingCategory = result.categorySummary.find((c) => c.category.id === 'cat-2');
      expect(missingCategory).toBeDefined();
      expect(missingCategory?.category.name).toBeUndefined();
    });

    it('should log and rethrow error when database fails', async () => {
      const error = new Error('Database connection failed');
      mockPrismaService.expense.count.mockRejectedValue(error);

      await expect(service.getExpenseReport(dto)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error getting expense report', { error });
    });

    it('should log and rethrow error when category summary query fails', async () => {
      const error = new Error('GroupBy query failed');
      mockPrismaService.expense.groupBy.mockRejectedValue(error);

      await expect(service.getExpenseReport(dto)).rejects.toThrow(error);
    });
  });
});
