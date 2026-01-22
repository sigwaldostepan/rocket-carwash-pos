import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindItemsDto } from './dto/find-items.dto';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  const mockItem = {
    id: '1',
    name: 'Test Item',
    price: 10000,
    canBeComplimented: false,
    isGetPoint: true,
    isRedeemable: false,
  };

  const mockItemService = {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany', () => {
    it('should return items with pagination', async () => {
      const query: FindItemsDto = { search: 'test' };
      const expectedResult = {
        items: [mockItem],
        total: 1,
      };

      mockItemService.findMany.mockResolvedValue(expectedResult);

      const result = await controller.findMany(query);

      expect(result).toEqual(expectedResult);
      expect(service.findMany).toHaveBeenCalledWith(query);
    });
  });

  describe('findItem', () => {
    it('should return a single item', async () => {
      mockItemService.findById.mockResolvedValue(mockItem);

      const result = await controller.findItem('1');

      expect(result).toEqual(mockItem);
      expect(service.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if item not found', async () => {
      mockItemService.findById.mockResolvedValue(null);

      const result = await controller.findItem('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('createItem', () => {
    it('should create and return the created item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'New Item',
        price: 10000,
        canBeComplimented: false,
        isGetPoint: true,
        isRedeemable: false,
      };

      mockItemService.create.mockResolvedValue(mockItem);

      const result = await controller.createItem(createItemDto);

      expect(result).toEqual(mockItem);
      expect(service.create).toHaveBeenCalledWith(createItemDto);
    });
  });

  describe('editItem', () => {
    it('should update and return the updated item', async () => {
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
        price: 15000,
      };
      const updatedItem = { ...mockItem, ...updateItemDto };

      mockItemService.update.mockResolvedValue(updatedItem);

      const result = await controller.editItem('1', updateItemDto);

      expect(result).toEqual(updatedItem);
      expect(service.update).toHaveBeenCalledWith('1', updateItemDto);
    });
  });

  describe('deleteItem', () => {
    it('should delete the item and return success', async () => {
      const successResponse = { success: true };
      mockItemService.delete.mockResolvedValue(successResponse);

      const result = await controller.deleteItem('1');

      expect(result).toEqual(successResponse);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
