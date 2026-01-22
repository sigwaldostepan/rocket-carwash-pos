import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/infra/persistance/database/prisma/prisma.service';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindItemsDto } from './dto/find-items.dto';
import { NotFoundException } from '@nestjs/common';

describe('ItemService', () => {
  let service: ItemService;
  let prisma: PrismaService;

  const mockPrismaService = {
    item: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return items', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Test Item',
          price: 10000,
          isRedeemable: false,
          isGetPoint: true,
          canBeComplimented: false,
        },
      ] as any;
      const mockCount = 1;
      const query: FindItemsDto = { search: 'test' };

      mockPrismaService.item.findMany.mockResolvedValue(mockItems);
      mockPrismaService.item.count.mockResolvedValue(mockCount);

      const result = await service.findMany(query);

      expect(result).toEqual(mockItems);
      expect(mockPrismaService.item.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });

  describe('findById', () => {
    it('should return item if found', async () => {
      const mockItem = {
        id: '1',
        name: 'Test Item',
        price: 10000,
        isRedeemable: false,
        isGetPoint: true,
        canBeComplimented: false,
      } as any;
      mockPrismaService.item.findUnique.mockResolvedValue(mockItem);

      const result = await service.findById('1');

      expect(result).toEqual(mockItem);
      expect(mockPrismaService.item.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if item not found', async () => {
      mockPrismaService.item.findUnique.mockResolvedValue(null);

      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Item with id: non-existent-id not found');
    });
  });

  describe('create', () => {
    it('should create and return new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'New Item',
        price: 10000,
        canBeComplimented: false,
        isGetPoint: true,
        isRedeemable: false,
      };
      const createdItem = { id: '1', ...createItemDto };

      mockPrismaService.item.create.mockResolvedValue(createdItem);

      const result = await service.create(createItemDto);

      expect(result).toEqual(createdItem);
      expect(mockPrismaService.item.create).toHaveBeenCalledWith({
        data: createItemDto,
      });
      expect(mockLogger.info).toHaveBeenCalledWith('Creating a new item', {
        data: createItemDto,
      });
    });
  });

  describe('update', () => {
    const updateData: UpdateItemDto = {
      name: 'Updated Item',
      price: 15000,
      canBeComplimented: true,
      isGetPoint: true,
      isRedeemable: false,
    };

    it('should update and return updated item', async () => {
      const existingItem = {
        id: '1',
        name: 'Test Item',
        price: 10000,
        isRedeemable: false,
        isGetPoint: true,
        canBeComplimented: false,
      } as any;
      const updatedItem = { ...existingItem, ...updateData };

      jest.spyOn(service, 'findById').mockResolvedValue(existingItem);
      mockPrismaService.item.update.mockResolvedValue(updatedItem);

      const result = await service.update('1', updateData);

      expect(result).toEqual(updatedItem);
      expect(service.findById).toHaveBeenCalledWith('1');
      expect(mockPrismaService.item.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateData)).rejects.toThrow(NotFoundException);
      expect(mockLogger.error).toHaveBeenCalledWith('Item with id: non-existent-id not found');
    });
  });

  describe('delete', () => {
    it('should delete item and return success', async () => {
      const existingItem = {
        id: '1',
        name: 'Test Item',
        price: 10000,
        isRedeemable: false,
        isGetPoint: true,
        canBeComplimented: false,
      } as any;
      jest.spyOn(service, 'findById').mockResolvedValue(existingItem);
      mockPrismaService.item.delete.mockResolvedValue(existingItem);

      const result = await service.delete('1');

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.item.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
