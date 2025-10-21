import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserSchema } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService with MongoDB Atlas', () => {
  let service: UserService;
  let module: TestingModule;
  const testPrefix = `test_user_${Date.now()}_`;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking-system';

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const UserModel = module.get('UserModel');
    if (UserModel) {
      await UserModel.deleteMany({ email: new RegExp(`^${testPrefix}`) });
    }
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john@example.com`,
        phone: '1234567890',
        address: '123 Main St',
      };

      const result = await service.create(createUserDto);

      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
      expect(result.active).toBe(true);
    });

    it('should throw ConflictException if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_duplicate@example.com`,
        phone: '1234567890',
      };

      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const createUserDto1: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_all1@example.com`,
        phone: '1234567890',
      };

      const createUserDto2: CreateUserDto = {
        id: 2,
        name: 'Jane Doe',
        email: `${testPrefix}jane_all@example.com`,
        phone: '0987654321',
      };

      await service.create(createUserDto1);
      await service.create(createUserDto2);

      const result = await service.findAll();

      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should return users array', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_byid@example.com`,
        phone: '1234567890',
      };

      const createdUser = await service.create(createUserDto);
      const result = await service.findById(createdUser.id);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(service.findById(999999999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const testEmail = `${testPrefix}john_byemail@example.com`;
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: testEmail,
        phone: '1234567890',
      };

      await service.create(createUserDto);
      const result = await service.findByEmail(testEmail);

      expect(result.email).toBe(testEmail);
      expect(result.name).toBe('John Doe');
    });

    it('should throw NotFoundException when email does not exist', async () => {
      await expect(service.findByEmail(`${testPrefix}nonexistent_${Date.now()}@example.com`)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_update@example.com`,
        phone: '1234567890',
      };

      const createdUser = await service.create(createUserDto);

      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
        phone: '9876543210',
      };

      const result = await service.update(createdUser.id, updateUserDto);

      expect(result.name).toBe('Jane Doe');
      expect(result.phone).toBe('9876543210');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
      };

      await expect(service.update(999999999, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_deactivate@example.com`,
        phone: '1234567890',
      };

      const createdUser = await service.create(createUserDto);
      const result = await service.deactivate(createdUser.id);

      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(service.deactivate(999999999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: `${testPrefix}john_remove@example.com`,
        phone: '1234567890',
      };

      const createdUser = await service.create(createUserDto);
      await service.remove(createdUser.id);

      await expect(service.findById(createdUser.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(service.remove(999999999)).rejects.toThrow(NotFoundException);
    });
  });
});