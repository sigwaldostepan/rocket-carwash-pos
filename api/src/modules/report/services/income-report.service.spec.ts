import { Test, TestingModule } from '@nestjs/testing';
import { IncomeReportService } from './income-report.service';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Prisma } from 'generated/prisma/client';

const mockPrismaService = {
  transaction: {
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('IncomeReportService', () => {
  let service: IncomeReportService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeReportService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<IncomeReportService>(IncomeReportService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIncomeReport', () => {
    const dto = {
      dateFrom: '2026-02-01',
      dateTo: '2026-02-09',
    };

    const mockTransactionCount = 150;
    const mockAggregates = {
      _sum: {
        subtotal: new Prisma.Decimal(20000000),
        total: new Prisma.Decimal(18000000),
        complimentValue: new Prisma.Decimal(500000),
      },
    };
    const mockPaymentMethodGroupBy = [
      {
        paymentMethod: 'Tunai',
        _count: { id: 80 },
        _sum: { total: new Prisma.Decimal(10000000) },
      },
      {
        paymentMethod: 'QRIS',
        _count: { id: 50 },
        _sum: { total: new Prisma.Decimal(6000000) },
      },
      {
        paymentMethod: 'EDC',
        _count: { id: 20 },
        _sum: { total: new Prisma.Decimal(2000000) },
      },
    ];

    beforeEach(() => {
      mockPrismaService.transaction.count.mockResolvedValue(mockTransactionCount);
      mockPrismaService.transaction.aggregate.mockResolvedValue(mockAggregates);
      mockPrismaService.transaction.groupBy.mockResolvedValue(mockPaymentMethodGroupBy);
    });

    it('should return income report with summary and payment method breakdown', async () => {
      const result = await service.getIncomeReport(dto);

      expect(result.summary).toBeDefined();
      expect(result.paymentMethodSummary).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith('Getting income reports', { data: dto });
    });

    it('should return correct transaction summary values', async () => {
      const result = await service.getIncomeReport(dto);

      expect(result.summary.transactionCount).toBe(150);
      expect(result.summary.grossProfit).toBe(20000000);
      expect(result.summary.netProfit).toBe(18000000);
      expect(result.summary.complimentValue).toBe(500000);
    });

    it('should return payment method summary with contribution percentages', async () => {
      const result = await service.getIncomeReport(dto);

      expect(result.paymentMethodSummary).toHaveLength(3);

      // Tunai: 10M / 18M * 100 = 55.56%
      const tunai = result.paymentMethodSummary.find((p) => p.paymentMethod === 'Tunai');
      expect(tunai).toBeDefined();
      expect(tunai?.transactionCount).toBe(80);
      expect(tunai?.totalAmount).toBe(10000000);
      expect(tunai?.contributionPercent).toBeCloseTo(55.56, 1);

      // QRIS: 6M / 18M * 100 = 33.33%
      const qris = result.paymentMethodSummary.find((p) => p.paymentMethod === 'QRIS');
      expect(qris).toBeDefined();
      expect(qris?.contributionPercent).toBeCloseTo(33.33, 1);

      // EDC: 2M / 18M * 100 = 11.11%
      const edc = result.paymentMethodSummary.find((p) => p.paymentMethod === 'EDC');
      expect(edc).toBeDefined();
      expect(edc?.contributionPercent).toBeCloseTo(11.11, 1);
    });

    it('should call prisma with correct date range filter', async () => {
      await service.getIncomeReport(dto);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      });

      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
        _sum: {
          total: true,
          subtotal: true,
          complimentValue: true,
        },
      });

      expect(mockPrismaService.transaction.groupBy).toHaveBeenCalledWith({
        by: 'paymentMethod',
        _sum: { total: true },
        _count: { id: true },
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
      });
    });

    it('should handle zero transactions gracefully', async () => {
      mockPrismaService.transaction.count.mockResolvedValue(0);
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: {
          subtotal: null,
          total: null,
          complimentValue: null,
        },
      });
      mockPrismaService.transaction.groupBy.mockResolvedValue([]);

      const result = await service.getIncomeReport(dto);

      expect(result.summary.transactionCount).toBe(0);
      expect(result.summary.grossProfit).toBe(0);
      expect(result.summary.netProfit).toBe(0);
      expect(result.summary.complimentValue).toBe(0);
      expect(result.paymentMethodSummary).toHaveLength(0);
    });

    it('should handle null aggregate values with default of 0', async () => {
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: {
          subtotal: null,
          total: null,
          complimentValue: null,
        },
      });

      const result = await service.getIncomeReport(dto);

      expect(result.summary.grossProfit).toBe(0);
      expect(result.summary.netProfit).toBe(0);
      expect(result.summary.complimentValue).toBe(0);
    });

    it('should handle undefined date range (default to today)', async () => {
      const dtoWithUndefined = {
        dateFrom: undefined,
        dateTo: undefined,
      };

      await service.getIncomeReport(dtoWithUndefined);

      expect(mockPrismaService.transaction.count).toHaveBeenCalled();
      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalled();
      expect(mockPrismaService.transaction.groupBy).toHaveBeenCalled();
    });

    it('should handle single payment method', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          paymentMethod: 'Tunai',
          _count: { id: 100 },
          _sum: { total: new Prisma.Decimal(18000000) },
        },
      ]);

      const result = await service.getIncomeReport(dto);

      expect(result.paymentMethodSummary).toHaveLength(1);
      expect(result.paymentMethodSummary[0].contributionPercent).toBe(100);
    });

    it('should handle legacy payment methods from old POS system', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          paymentMethod: 'Cash',
          _count: { id: 10 },
          _sum: { total: new Prisma.Decimal(1000000) },
        },
        {
          paymentMethod: 'Bank Transfer, QRIS',
          _count: { id: 5 },
          _sum: { total: new Prisma.Decimal(500000) },
        },
        {
          paymentMethod: '',
          _count: { id: 2 },
          _sum: { total: new Prisma.Decimal(200000) },
        },
      ]);

      const result = await service.getIncomeReport(dto);

      expect(result.paymentMethodSummary).toHaveLength(3);
      expect(result.paymentMethodSummary.find((p) => p.paymentMethod === 'Cash')).toBeDefined();
      expect(result.paymentMethodSummary.find((p) => p.paymentMethod === 'Bank Transfer, QRIS')).toBeDefined();
      expect(result.paymentMethodSummary.find((p) => p.paymentMethod === '')).toBeDefined();
    });

    it('should log and rethrow error when database fails', async () => {
      const error = new Error('Database connection failed');
      mockPrismaService.transaction.count.mockRejectedValue(error);

      await expect(service.getIncomeReport(dto)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error getting income report', { error });
    });

    it('should handle Komplimen payment method with correct data', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          paymentMethod: 'Tunai',
          _count: { id: 100 },
          _sum: { total: new Prisma.Decimal(17500000) },
        },
        {
          paymentMethod: 'Komplimen',
          _count: { id: 10 },
          _sum: { total: new Prisma.Decimal(500000) },
        },
      ]);

      const result = await service.getIncomeReport(dto);

      const komplimen = result.paymentMethodSummary.find((p) => p.paymentMethod === 'Komplimen');
      expect(komplimen).toBeDefined();
      expect(komplimen?.totalAmount).toBe(500000);
    });
  });
});
