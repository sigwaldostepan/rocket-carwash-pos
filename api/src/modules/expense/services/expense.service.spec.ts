import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';
import { EXPENSE_SELECT_WITH_CATEGORY } from '../constants/expense.select';

const mockPrismaService = {
  expense: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('ExpenseService', () => {
  let service: ExpenseService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    const dto = { limit: 10, offset: 0 };
    const mockExpenses = [
      { id: '1', amount: '100', category: { name: 'Cat1' } },
      { id: '2', amount: '200', category: { name: 'Cat2' } },
    ];
    const mockTotal = 2;

    it('should return expenses with numeric amount and total count', async () => {
      mockPrismaService.expense.findMany.mockResolvedValue(mockExpenses);
      mockPrismaService.expense.count.mockResolvedValue(mockTotal);

      const result = await service.findMany(dto);

      expect(result.expenses).toEqual([
        { id: '1', amount: 100, category: { name: 'Cat1' } },
        { id: '2', amount: 200, category: { name: 'Cat2' } },
      ]);
      expect(result.total).toEqual(mockTotal);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expense.findMany.mockRejectedValue(error);

      await expect(service.findMany(dto)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    const expenseId = '1';
    const mockExpense = { id: expenseId, amount: '100', category: { name: 'Cat1' } };

    it('should return an expense if found', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(mockExpense);

      const result = await service.findById(expenseId);

      expect(result).toEqual(mockExpense);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should return null if not found', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(null);

      const result = await service.findById(expenseId);

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expense.findUnique.mockRejectedValue(error);

      await expect(service.findById(expenseId)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createDto: any = { amount: 100, categoryId: 'cat1', note: 'test' };
    const mockCreatedExpense = { id: '1', amount: '100', categoryId: 'cat1' };

    it('should create an expense', async () => {
      mockPrismaService.expense.create.mockResolvedValue(mockCreatedExpense);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedExpense);
      expect(mockPrismaService.expense.create).toHaveBeenCalledWith({
        data: createDto,
        select: EXPENSE_SELECT_WITH_CATEGORY,
      });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expense.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const expenseId = '1';
    const updateDto: any = { amount: 150 };
    const mockExistingExpense = { id: expenseId, amount: '100' };
    const mockUpdatedExpense = { id: expenseId, amount: '150' };

    it('should update an existing expense', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(mockExistingExpense);
      mockPrismaService.expense.update.mockResolvedValue(mockUpdatedExpense);

      const result = await service.update(expenseId, updateDto);

      expect(result).toEqual(mockUpdatedExpense);
      expect(mockPrismaService.expense.update).toHaveBeenCalledWith({
        where: { id: expenseId },
        data: updateDto,
        select: EXPENSE_SELECT_WITH_CATEGORY,
      });
    });

    it('should throw NotFoundException if expense does not exist', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(null);

      await expect(service.update(expenseId, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(mockExistingExpense);
      mockPrismaService.expense.update.mockRejectedValue(new Error('DB Error'));

      await expect(service.update(expenseId, updateDto)).rejects.toThrow('DB Error');
    });
  });

  describe('delete', () => {
    const expenseId = '1';
    const mockExistingExpense = { id: expenseId, amount: '100' };

    it('should delete an existing expense', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(mockExistingExpense);
      mockPrismaService.expense.delete.mockResolvedValue(mockExistingExpense);

      const result = await service.delete(expenseId);

      expect(result).toEqual(mockExistingExpense);
      expect(mockPrismaService.expense.delete).toHaveBeenCalledWith({
        where: { id: expenseId },
      });
    });

    it('should throw NotFoundException if expense does not exist', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(null);

      await expect(service.delete(expenseId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('batchDelete', () => {
    const ids = ['1', '2'];

    it('should delete multiple expenses', async () => {
      mockPrismaService.expense.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.batchDelete({ ids });

      expect(result).toEqual({ count: 2 });
      expect(mockPrismaService.expense.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
      });
    });

    it('should handle errors', async () => {
      mockPrismaService.expense.deleteMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.batchDelete({ ids })).rejects.toThrow('DB Error');
    });
  });
});
