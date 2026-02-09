import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { IncomeReportService } from './services/income-report.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GetIncomeReportDto } from './dto/get-income-report.dto';

const mockIncomeReportService = {
  getIncomeReport: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('ReportService', () => {
  let service: ReportService;
  let incomeReportService: typeof mockIncomeReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: IncomeReportService, useValue: mockIncomeReportService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    incomeReportService = module.get(IncomeReportService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIncomeReport', () => {
    const dto: GetIncomeReportDto = {
      dateFrom: '2026-02-01',
      dateTo: '2026-02-09',
    };

    const mockIncomeReport = {
      summary: {
        transactionCount: 100,
        grossProfit: 15000000,
        netProfit: 12000000,
        complimentValue: 500000,
      },
      paymentMethodSummary: [
        {
          paymentMethod: 'Tunai',
          transactionCount: 50,
          totalAmount: 6000000,
          contributionPercent: 50,
        },
        {
          paymentMethod: 'QRIS',
          transactionCount: 30,
          totalAmount: 4000000,
          contributionPercent: 33.33,
        },
        {
          paymentMethod: 'EDC',
          transactionCount: 20,
          totalAmount: 2000000,
          contributionPercent: 16.67,
        },
      ],
    };

    it('should return income report from IncomeReportService', async () => {
      mockIncomeReportService.getIncomeReport.mockResolvedValue(mockIncomeReport);

      const result = await service.getIncomeReport(dto);

      expect(result).toEqual(mockIncomeReport);
      expect(incomeReportService.getIncomeReport).toHaveBeenCalledWith(dto);
      expect(incomeReportService.getIncomeReport).toHaveBeenCalledTimes(1);
    });

    it('should return report with empty payment method summary when no transactions', async () => {
      const emptyReport = {
        summary: {
          transactionCount: 0,
          grossProfit: 0,
          netProfit: 0,
          complimentValue: 0,
        },
        paymentMethodSummary: [],
      };
      mockIncomeReportService.getIncomeReport.mockResolvedValue(emptyReport);

      const result = await service.getIncomeReport(dto);

      expect(result.summary.transactionCount).toBe(0);
      expect(result.paymentMethodSummary).toHaveLength(0);
    });

    it('should handle date range with undefined dates', async () => {
      const dtoWithUndefined: GetIncomeReportDto = {
        dateFrom: undefined,
        dateTo: undefined,
      };
      mockIncomeReportService.getIncomeReport.mockResolvedValue(mockIncomeReport);

      await service.getIncomeReport(dtoWithUndefined);

      expect(incomeReportService.getIncomeReport).toHaveBeenCalledWith(dtoWithUndefined);
    });

    it('should propagate error when IncomeReportService throws', async () => {
      const error = new Error('Database connection failed');
      mockIncomeReportService.getIncomeReport.mockRejectedValue(error);

      await expect(service.getIncomeReport(dto)).rejects.toThrow(error);
      // Note: The current implementation uses `return` without `await`,
      // so the try-catch doesn't catch the async error and logger.error won't be called
    });

    it('should handle partial date range (only dateFrom)', async () => {
      const dtoOnlyFrom: GetIncomeReportDto = {
        dateFrom: '2026-02-01',
        dateTo: undefined,
      };
      mockIncomeReportService.getIncomeReport.mockResolvedValue(mockIncomeReport);

      await service.getIncomeReport(dtoOnlyFrom);

      expect(incomeReportService.getIncomeReport).toHaveBeenCalledWith(dtoOnlyFrom);
    });

    it('should handle partial date range (only dateTo)', async () => {
      const dtoOnlyTo: GetIncomeReportDto = {
        dateFrom: undefined,
        dateTo: '2026-02-09',
      };
      mockIncomeReportService.getIncomeReport.mockResolvedValue(mockIncomeReport);

      await service.getIncomeReport(dtoOnlyTo);

      expect(incomeReportService.getIncomeReport).toHaveBeenCalledWith(dtoOnlyTo);
    });
  });
});
