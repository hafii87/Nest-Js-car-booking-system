import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarRulesDto } from './dto/create-car-rules.dto';
import { UpdateCarRulesDto } from './dto/update-car-rules.dto';

describe('CarService', () => {
  let service: CarService;
  let mockCarModel: any;

  beforeEach(async () => {
    mockCarModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken('Car'),
          useValue: mockCarModel,
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

      const savedCar = {
        _id: '507f1f77bcf86cd799439011',
        ...createCarDto,
        active: true,
        createdAt: new Date(),
      };

      const carInstance = {
        save: jest.fn().mockResolvedValue(savedCar),
      };

      mockCarModel.mockImplementation(() => carInstance);

      const result = await service.create(createCarDto);

      expect(result.name).toBe(createCarDto.name);
      expect(result.type).toBe(createCarDto.type);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const cars = [
        { _id: '1', name: 'Tesla Model 3', type: 'SEDAN', brand: 'Tesla', model: 'Model 3', color: 'Red', active: true },
        { _id: '2', name: 'BMW X5', type: 'SUV', brand: 'BMW', model: 'X5', color: 'Black', active: true },
      ];

      mockCarModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cars),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockCarModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a car by id', async () => {
      const carId = 1;
      const car = {
        _id: '507f1f77bcf86cd799439011',
        id: carId,
        name: 'Tesla Model 3',
        type: 'SEDAN',
        brand: 'Tesla',
        active: true,
      };

      mockCarModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(car),
      });

      const result = await service.findById(carId);

      expect(result.name).toBe(car.name);
      expect(mockCarModel.findById).toHaveBeenCalledWith(carId);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const carId = 999;

      mockCarModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(carId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return cars by type', async () => {
      const type = 'SEDAN';
      const cars = [
        { _id: '1', name: 'Tesla Model 3', type, brand: 'Tesla', active: true },
        { _id: '2', name: 'BMW 3 Series', type, brand: 'BMW', active: true },
      ];

      mockCarModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cars),
      });

      const result = await service.findByType(type);

      expect(result).toHaveLength(2);
      expect(mockCarModel.find).toHaveBeenCalledWith({ type });
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const carId = 1;
      const updateCarDto: UpdateCarDto = {
        color: 'Blue',
        description: 'Updated description',
      };

      const updatedCar = {
        _id: '507f1f77bcf86cd799439011',
        id: carId,
        name: 'Tesla Model 3',
        ...updateCarDto,
        active: true,
      };

      mockCarModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCar),
      });

      const result = await service.update(carId, updateCarDto);

      expect(result.color).toBe(updateCarDto.color);
      expect(mockCarModel.findByIdAndUpdate).toHaveBeenCalledWith(carId, updateCarDto, { new: true });
    });
  });

  describe('createRules', () => {
    it('should create car rules', async () => {
      const createCarRulesDto: CreateCarRulesDto = {
        carId: 1,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      const carWithRules = {
        _id: '507f1f77bcf86cd799439011',
        id: 1,
        name: 'Tesla Model 3',
        carRules: createCarRulesDto,
      };

      mockCarModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(carWithRules),
      });

      const result = await service.createRules(createCarRulesDto);

      expect(mockCarModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createCarRulesDto.carId,
        { carRules: createCarRulesDto },
        { new: true }
      );
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const createCarRulesDto: CreateCarRulesDto = {
        carId: 999,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      mockCarModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.createRules(createCarRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRules', () => {
    it('should update car rules', async () => {
      const carId = 1;
      const updateCarRulesDto: UpdateCarRulesDto = {
        phoneVerification: false,
      };

      const carWithUpdatedRules = {
        _id: '507f1f77bcf86cd799439011',
        id: carId,
        carRules: updateCarRulesDto,
      };

      mockCarModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(carWithUpdatedRules),
      });

      const result = await service.updateRules(carId, updateCarRulesDto);

      expect(mockCarModel.findByIdAndUpdate).toHaveBeenCalledWith(
        carId,
        { $set: { carRules: updateCarRulesDto } },
        { new: true }
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate a car', async () => {
      const carId = 1;
      const deactivatedCar = {
        _id: '507f1f77bcf86cd799439011',
        id: carId,
        name: 'Tesla Model 3',
        active: false,
      };

      mockCarModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedCar),
      });

      const result = await service.deactivate(carId);

      expect(result.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a car', async () => {
      const carId = 1;
      const car = { _id: '507f1f77bcf86cd799439011', id: carId };

      mockCarModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(car),
      });

      await service.remove(carId);

      expect(mockCarModel.findByIdAndDelete).toHaveBeenCalledWith(carId);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const carId = 999;

      mockCarModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(carId)).rejects.toThrow(NotFoundException);
    });
  });
});