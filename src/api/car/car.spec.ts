import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CarService } from '../car/car.service';
import { CarSchema } from './schema/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarRulesDto } from './dto/create-car-rules.dto';
import { UpdateCarRulesDto } from './dto/update-car-rules.dto';

describe('CarService with MongoDB Atlas', () => {
  let service: CarService;
  let module: TestingModule;
  const testPrefix = `test_car_${Date.now()}_`;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking-system';

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
      ],
      providers: [CarService],
    }).compile();

    service = module.get<CarService>(CarService);
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const CarModel = module.get('CarModel');
    if (CarModel) {
      await CarModel.deleteMany({ createdAt: { $gte: new Date(Date.now() - 60000) } });
    }
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const result = await service.create(createCarDto);

      expect(result.name).toContain('Tesla Model 3');
      expect(result.type).toBe('SEDAN');
      expect(result.active).toBe(true);
      expect(result.brand).toBe('Tesla');
      expect(result.carModel).toBe('Model 3');
    });

    it('should create multiple cars with different types', async () => {
      const createCarDto1: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createCarDto2: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}BMW X5`,
        description: 'Luxury SUV',
        type: 'SUV',
        brand: 'BMW',
        carModel: 'X5',
        color: 'Black',
      };

      const result1 = await service.create(createCarDto1);
      const result2 = await service.create(createCarDto2);

      expect(result1.type).toBe('SEDAN');
      expect(result2.type).toBe('SUV');
      expect(result1.brand).toBe('Tesla');
      expect(result2.brand).toBe('BMW');
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const createCarDto1: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createCarDto2: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}BMW X5`,
        description: 'Luxury SUV',
        type: 'SUV',
        brand: 'BMW',
        carModel: 'X5',
        color: 'Black',
      };

      await service.create(createCarDto1);
      await service.create(createCarDto2);

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should return cars array even when empty', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a car by id', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);
      const result = await service.findById(createdCar.id);

      expect(result.name).toContain('Tesla Model 3');
      expect(result.type).toBe('SEDAN');
      expect(result.brand).toBe('Tesla');
    });

    it('should throw NotFoundException when car does not exist', async () => {
      await expect(service.findById(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should return car with all properties', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Audi A4`,
        description: 'Premium sedan',
        type: 'SEDAN',
        brand: 'Audi',
        carModel: 'A4',
        color: 'Silver',
      };

      const createdCar = await service.create(createCarDto);
      const result = await service.findById(createdCar.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('carModel');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('active');
    });
  });

  describe('findByType', () => {
    it('should return cars by type SEDAN', async () => {
      const createCarDto1: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createCarDto2: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}BMW X5`,
        description: 'Luxury SUV',
        type: 'SUV',
        brand: 'BMW',
        carModel: 'X5',
        color: 'Black',
      };

      await service.create(createCarDto1);
      await service.create(createCarDto2);

      const result = await service.findByType('SEDAN');

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].type).toBe('SEDAN');
    });

    it('should return cars by type SUV', async () => {
      const createCarDto1: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}BMW X5`,
        description: 'Luxury SUV',
        type: 'SUV',
        brand: 'BMW',
        carModel: 'X5',
        color: 'Black',
      };

      const createCarDto2: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Toyota Highlander`,
        description: 'Family SUV',
        type: 'SUV',
        brand: 'Toyota',
        carModel: 'Highlander',
        color: 'White',
      };

      await service.create(createCarDto1);
      await service.create(createCarDto2);

      const result = await service.findByType('SUV');

      expect(result.length).toBeGreaterThanOrEqual(2);
      result.forEach(car => {
        expect(car.type).toBe('SUV');
      });
    });

    it('should return empty array for non-existent type', async () => {
      const result = await service.findByType('NONEXISTENT');

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update car color', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);

      const updateCarDto: UpdateCarDto = {
        color: 'Blue',
      };

      const result = await service.update(createdCar.id, updateCarDto);

      expect(result.color).toBe('Blue');
      expect(result.name).toContain('Tesla Model 3');
    });

    it('should update multiple car properties', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);

      const updateCarDto: UpdateCarDto = {
        color: 'Blue',
        description: 'Updated electric sedan',
      };

      const result = await service.update(createdCar.id, updateCarDto);

      expect(result.color).toBe('Blue');
      expect(result.description).toBe('Updated electric sedan');
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const updateCarDto: UpdateCarDto = {
        color: 'Blue',
      };

      await expect(service.update(999999999, updateCarDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createRules', () => {
    it('should create car rules', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);

      const createCarRulesDto: CreateCarRulesDto = {
        carId: createdCar.id,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      const result = await service.createRules(createCarRulesDto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const createCarRulesDto: CreateCarRulesDto = {
        carId: 999999999,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      await expect(service.createRules(createCarRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRules', () => {
    it('should update car rules', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);

      const updateCarRulesDto: UpdateCarRulesDto = {
        phoneVerification: true,
        emailVerification: false,
      };

      const result = await service.updateRules(createdCar.id, updateCarRulesDto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const updateCarRulesDto: UpdateCarRulesDto = {
        phoneVerification: true,
      };

      await expect(service.updateRules(999999999, updateCarRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a car', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);
      const result = await service.deactivate(createdCar.id);

      expect(result.active).toBe(false);
      expect(result.name).toContain('Tesla Model 3');
    });

    it('should throw NotFoundException when car does not exist', async () => {
      await expect(service.deactivate(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should allow reactivation by updating', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);
      await service.deactivate(createdCar.id);

      const deactivatedCar = await service.findById(createdCar.id);
      expect(deactivatedCar.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a car', async () => {
      const createCarDto: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createdCar = await service.create(createCarDto);
      await service.remove(createdCar.id);

      await expect(service.findById(createdCar.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      await expect(service.remove(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should delete multiple cars', async () => {
      const createCarDto1: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}Tesla Model 3`,
        description: 'Electric sedan',
        type: 'SEDAN',
        brand: 'Tesla',
        carModel: 'Model 3',
        color: 'Red',
      };

      const createCarDto2: CreateCarDto = {
        id: Math.random(),
        name: `${testPrefix}BMW X5`,
        description: 'Luxury SUV',
        type: 'SUV',
        brand: 'BMW',
        carModel: 'X5',
        color: 'Black',
      };

      const car1 = await service.create(createCarDto1);
      const car2 = await service.create(createCarDto2);

      await service.remove(car1.id);
      await service.remove(car2.id);

      await expect(service.findById(car1.id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(car2.id)).rejects.toThrow(NotFoundException);
    });
  });
});