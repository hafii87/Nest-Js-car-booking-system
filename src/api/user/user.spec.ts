import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
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

      const savedUser = {
        _id: '507f1f77bcf86cd799439011',
        ...createUserDto,
        active: true,
        createdAt: new Date(),
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const userInstance = {
        save: jest.fn().mockResolvedValue(savedUser),
      };

      mockUserModel.mockImplementation(() => userInstance);

      const result = await service.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
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

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: createUserDto.email }),
      });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { _id: '1', name: 'User 1', email: 'user1@example.com', phone: '123', active: true },
        { _id: '2', name: 'User 2', email: 'user2@example.com', phone: '456', active: true },
      ];

      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockUserModel.find).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = {
        _id: '507f1f77bcf86cd799439011',
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        active: true,
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findById(userId);

      expect(result.id).toBe(userId);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 999;

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john@example.com';
      const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email,
        phone: '1234567890',
        active: true,
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findByEmail(email);

      expect(result.email).toBe(email);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
    });

    it('should throw NotFoundException when email does not exist', async () => {
      const email = 'nonexistent@example.com';

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const updatedUser = {
        _id: '507f1f77bcf86cd799439011',
        id: userId,
        ...updateUserDto,
        phone: '1234567890',
        active: true,
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(userId, updateUserDto);

      expect(result.name).toBe(updateUserDto.name);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateUserDto, { new: true });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 999;
      const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user', async () => {
      const userId = 1;
      const deactivatedUser = {
        _id: '507f1f77bcf86cd799439011',
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        active: false,
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedUser),
      });

      const result = await service.deactivate(userId);

      expect(result.active).toBe(false);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, { active: false }, { new: true });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const user = { _id: '507f1f77bcf86cd799439011', id: userId };

      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      await service.remove(userId);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 999;

      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });
});