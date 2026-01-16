import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { FindCustomersDto } from './dtos/find-customers.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockService = {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    batchDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [{ provide: CustomerService, useValue: mockService }],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('batchDelete', () => {
    it('should call customerService.batchDelete with correct parameters', async () => {
      const dto = { ids: ['uuid-1', 'uuid-2'] };
      await controller.batchDelete(dto);
      expect(mockService.batchDelete).toHaveBeenCalledWith(dto);
    });

    it('should return the result from customerService.batchDelete', async () => {
      const dto = { ids: ['uuid-1'] };
      const expectedResult = { success: true };
      mockService.batchDelete.mockResolvedValue(expectedResult);
      
      const result = await controller.batchDelete(dto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findMany', () => {
    it('should return paginated customers', async () => {
      mockService.findMany.mockResolvedValue({ customers: [{ id: '1' }], total: 1 });
      const dto = { page: 1, limit: 10 } as FindCustomersDto;

      const res = await controller.findMany(dto);

      expect(res.data).toEqual([{ id: '1' }]);
      expect(res.meta.currentPage).toBe(1);
      expect(res.meta.perPage).toBe(10);
      expect(res.meta.totalItems).toBe(1);
      expect(mockService.findMany).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should return a customer', async () => {
      mockService.findById.mockResolvedValue({ id: '1' });

      expect(await controller.findById('1')).toEqual({ id: '1' });
    });
  });

  describe('create', () => {
    it('should create a customer', async () => {
      mockService.create.mockResolvedValue({ id: '1' });

      const dto: CreateCustomerDto = { name: 'a', phoneNumber: 'b' } as any;

      expect(await controller.create(dto)).toEqual({ id: '1' });
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      mockService.update.mockResolvedValue({ id: '1', name: 'b' });

      const dto: UpdateCustomerDto = { name: 'b', phoneNumber: 'c', point: 10 } as any;

      expect(await controller.update('1', dto)).toEqual({ id: '1', name: 'b' });
      expect(mockService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      mockService.delete.mockResolvedValue({ id: '1' });

      expect(await controller.delete('1')).toEqual({ id: '1' });
      expect(mockService.delete).toHaveBeenCalledWith('1');
    });
  });
});
