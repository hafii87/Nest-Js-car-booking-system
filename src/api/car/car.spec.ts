import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

describe('CarService', () => {
  let service: CarService;
  let mockModel: any;

  const mockCar = {
    _id: '507f1f77bcf86cd799439011',
    id: 1,
    name: 'Tesla Model 3',
    description: 'Electric sedan',
    type: 'SEDAN',
    brand: 'Tesla',
    model: 'Model 3',
    color: 'Red',
    active: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    };

    mockModel.mockImplementation = jest.fn((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: '507f1f77bcf86cd799439011' }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken('Car'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        id: 1,
        name: 'Tesla Model 3',
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        model: 'Model 3',
        color: 'Red',
      };

      const mockInstance = {
        save: jest.fn().mockResolvedValue(mockCar),
      };

      mockModel.mockImplementation.mockReturnValue(mockInstance);

      const result = await service.create(createCarDto);

      expect(result.name).toBe('Tesla Model 3');
      expect(result.type).toBe('SEDAN');
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const cars = [mockCar];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cars),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Tesla Model 3');
    });
  });

  describe('findById', () => {
    it('should return a car by id', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      const result = await service.findById(1);

      expect(result.name).toBe('Tesla Model 3');
      expect(mockModel.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return cars by type', async () => {
      const cars = [mockCar];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cars),
      });

      const result = await service.findByType('SEDAN');

      expect(result).toHaveLength(1);
      expect(mockModel.find).toHaveBeenCalledWith({ type: 'SEDAN' });
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const updateCarDto: UpdateCarDto = {
        color: 'Blue',
      };

      const updatedCar = { ...mockCar, color: 'Blue' };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCar),
      });

      const result = await service.update(1, updateCarDto);

      expect(result.color).toBe('Blue');
    });
  });

  describe('deactivate', () => {
    it('should deactivate a car', async () => {
      const deactivatedCar = { ...mockCar, active: false };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedCar),
      });

      const result = await service.deactivate(1);

      expect(result.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a car', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      await service.remove(1);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
