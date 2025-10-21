import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    active: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
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
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };

      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const mockInstance = {
        save: jest.fn().mockResolvedValue(mockUser),
      };

      mockModel.mockImplementation.mockReturnValue(mockInstance);

      const result = await service.create(createUserDto);

      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('john@example.com');
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(1);

      expect(result.name).toBe('John Doe');
      expect(mockModel.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail('john@example.com');

      expect(result.email).toBe('john@example.com');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should throw NotFoundException when email does not exist', async () => {
      mockModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
      };

      const updatedUser = { ...mockUser, name: 'Jane Doe' };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(1, updateUserDto);

      expect(result.name).toBe('Jane Doe');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(1, updateUserDto, { new: true });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user', async () => {
      const deactivatedUser = { ...mockUser, active: false };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedUser),
      });

      const result = await service.deactivate(1);

      expect(result.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await service.remove(1);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});