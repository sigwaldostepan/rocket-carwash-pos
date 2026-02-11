import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseCategoryService } from './expense-category.service';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';
import { ExpenseCategoryStatus } from 'generated/prisma/client';

const mockPrismaService = {
  expenseCategory: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('ExpenseCategoryService', () => {
  let service: ExpenseCategoryService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseCategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ExpenseCategoryService>(ExpenseCategoryService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return expense categories with expense count', async () => {
      const mockCategories = [
        { id: '1', name: 'Cat1', _count: { expense: 5 }, status: ExpenseCategoryStatus.active },
        { id: '2', name: 'Cat2', _count: { expense: null }, status: ExpenseCategoryStatus.active },
      ];

      mockPrismaService.expenseCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.findMany();

      expect(result).toEqual([
        { id: '1', name: 'Cat1', _count: { expense: 5 }, status: ExpenseCategoryStatus.active, expenseCount: 5 },
        { id: '2', name: 'Cat2', _count: { expense: null }, status: ExpenseCategoryStatus.active, expenseCount: 0 },
      ]);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expenseCategory.findMany.mockRejectedValue(error);

      await expect(service.findMany()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    const categoryId = '1';
    const mockCategory = { id: categoryId, name: 'Cat1', _count: { expense: 5 } };

    it('should return an expense category if found', async () => {
      mockPrismaService.expenseCategory.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findById(categoryId);

      expect(result).toEqual({ ...mockCategory, expenseCount: 5 });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expenseCategory.findUnique.mockRejectedValue(error);

      await expect(service.findById(categoryId)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createDto: any = { name: 'Cat1' };
    const mockCreatedCategory = { id: '1', name: 'Cat1' };

    it('should create an expense category', async () => {
      mockPrismaService.expenseCategory.create.mockResolvedValue(mockCreatedCategory);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedCategory);
      expect(mockPrismaService.expenseCategory.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('DB Error');
      mockPrismaService.expenseCategory.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const categoryId = '1';
    const updateDto: any = { name: 'NewName' };
    const mockUpdatedCategory = { id: categoryId, name: 'NewName' };

    it('should update an existing expense category', async () => {
      mockPrismaService.expenseCategory.update.mockResolvedValue(mockUpdatedCategory);

      const result = await service.update(categoryId, updateDto);

      expect(result).toEqual(mockUpdatedCategory);
      expect(mockPrismaService.expenseCategory.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if category does not exist (prisma returns null)', async () => {
      // Assuming behavior: update returns null if not found (though standard prisma throws P2025)
      // The service code specifically checks: if (!expenseCategory) { throw NotFoundException }
      // So we test that path by mocking it effectively returning null (or throwing a specific error that results in null if appropriate, but here we mock return value).
      // However, typical Prisma behavior is to throw.
      // If we mock it to return null:
      mockPrismaService.expenseCategory.update.mockResolvedValue(null);

      await expect(service.update(categoryId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockPrismaService.expenseCategory.update.mockRejectedValue(new Error('DB Error'));

      await expect(service.update(categoryId, updateDto)).rejects.toThrow('DB Error');
    });
  });

  describe('delete', () => {
    const categoryId = '1';
    const mockSoftDeletedCategory = { id: categoryId, status: ExpenseCategoryStatus.inactive };

    it('should soft delete an existing expense category', async () => {
      mockPrismaService.expenseCategory.update.mockResolvedValue(mockSoftDeletedCategory);

      const result = await service.delete(categoryId);

      expect(result).toEqual(mockSoftDeletedCategory);
      expect(mockPrismaService.expenseCategory.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: { status: ExpenseCategoryStatus.inactive },
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrismaService.expenseCategory.update.mockResolvedValue(null);

      await expect(service.delete(categoryId)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors', async () => {
      mockPrismaService.expenseCategory.update.mockRejectedValue(new Error('DB Error'));

      await expect(service.delete(categoryId)).rejects.toThrow('DB Error');
    });
  });

  describe('batchDelete', () => {
    const ids = ['1', '2'];

    it('should soft delete multiple expense categories', async () => {
      mockPrismaService.expenseCategory.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.batchDelete({ ids });

      expect(result).toEqual({ count: 2 });
      expect(mockPrismaService.expenseCategory.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
        data: { status: ExpenseCategoryStatus.inactive },
      });
    });

    it('should handle errors', async () => {
      mockPrismaService.expenseCategory.updateMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.batchDelete({ ids })).rejects.toThrow('DB Error');
    });
  });
});
