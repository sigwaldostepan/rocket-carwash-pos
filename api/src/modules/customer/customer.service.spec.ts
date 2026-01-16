import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';

const mockPrismaService = {
  customer: {
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
  warn: jest.fn(),
};

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('batchDelete', () => {
    const customerIds = ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'];
    const customers = [
      { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Customer 1' },
      { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Customer 2' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete multiple customers successfully', async () => {
      mockPrismaService.customer.findMany.mockResolvedValue(customers);
      mockPrismaService.customer.deleteMany.mockResolvedValue({ count: 2 });

      await service.batchDelete({ ids: customerIds });

      expect(mockPrismaService.customer.findMany).toHaveBeenCalledWith({
        where: { id: { in: customerIds } },
      });
      expect(mockPrismaService.customer.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: customerIds } },
      });
      expect(mockLogger.info).toHaveBeenCalledWith('Batch deleting customers', {
        ids: customerIds,
      });
    });

    it('should throw NotFoundException when some customers are not found', async () => {
      mockPrismaService.customer.findMany.mockResolvedValue([customers[0]]);

      await expect(service.batchDelete({ ids: customerIds })).rejects.toThrow(NotFoundException);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Batch delete failed: Customer with id ["123e4567-e89b-12d3-a456-426614174001"] not found',
      );
    });

    it('should log error when database operation fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.customer.findMany.mockRejectedValue(error);

      await expect(service.batchDelete({ ids: customerIds })).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error batch deleting customers', {
        error,
      });
    });
  });

  describe('findMany', () => {
    it('should return customers and total', async () => {
      const mockCustomer = { 
        id: '1',
        name: 'Test Customer',
        phoneNumber: '1234567890',
        _count: { transaction: 5 },
        // Add other required fields from CUSTOMER_SELECT_WITH_TRANSACTION_COUNT
      };
      
      prisma.customer.findMany.mockResolvedValue([mockCustomer]);
      prisma.customer.count.mockResolvedValue(1);

      const dto = { limit: 10, offset: 0 } as any;
      const result = await service.findMany(dto);

      expect(result).toEqual({ 
        customers: [{ 
          id: '1',
          name: 'Test Customer',
          phoneNumber: '1234567890',
          transactionCount: 5
        }], 
        total: 1 
      });
      expect(mockLogger.info).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      prisma.customer.findMany.mockRejectedValue(new Error('fail'));

      const dto = { limit: 10, offset: 0 } as any;
      await expect(service.findMany(dto)).rejects.toThrow('fail');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return customer if found', async () => {
      prisma.customer.findUnique.mockResolvedValue({ id: '1' });

      expect(await service.findById('1')).toEqual({ id: '1' });
    });
    it('should return null if not found', async () => {
      prisma.customer.findUnique.mockResolvedValue(null);

      expect(await service.findById('2')).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return customer', async () => {
      prisma.customer.create.mockResolvedValue({ id: '1' });

      const dto = { name: 'a', phoneNumber: 'b' };

      expect(await service.create(dto as any)).toEqual({ id: '1' });
      expect(mockLogger.info).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      prisma.customer.create.mockRejectedValue(new Error('fail'));

      await expect(service.create({} as any)).rejects.toThrow('fail');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return customer', async () => {
      prisma.customer.findUnique.mockResolvedValue({ id: '1' });
      prisma.customer.update.mockResolvedValue({ id: '1', name: 'b' });

      const dto = { name: 'b', phoneNumber: 'c', point: 10 };

      expect(await service.update('1', dto as any)).toEqual({ id: '1', name: 'b' });

      expect(mockLogger.info).toHaveBeenCalled();
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.customer.findUnique.mockResolvedValue(null);

      await expect(service.update('2', {} as any)).rejects.toThrow(NotFoundException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      prisma.customer.findUnique.mockResolvedValue({ id: '1' });
      prisma.customer.update.mockRejectedValue(new Error('fail'));

      await expect(service.update('1', {} as any)).rejects.toThrow('fail');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete and return customer', async () => {
      prisma.customer.delete.mockResolvedValue({ id: '1' });

      expect(await service.delete('1')).toEqual({ id: '1' });
      expect(mockLogger.warn).toHaveBeenCalled();
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.customer.delete.mockResolvedValue(null);

      await expect(service.delete('2')).rejects.toThrow(NotFoundException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
    it('should log and throw on error', async () => {
      prisma.customer.delete.mockRejectedValue(new Error('fail'));

      await expect(service.delete('1')).rejects.toThrow('fail');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
