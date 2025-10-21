import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { GroupService } from '../group/group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupRulesDto } from './dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from './dto/update-group-rules.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';

describe('GroupService', () => {
  let service: GroupService;
  let mockModel: any;

  const mockGroup = {
    _id: '507f1f77bcf86cd799439011',
    id: 1,
    name: 'Weekend Drivers',
    description: 'Weekend bookings',
    createdBy: 1,
    active: true,
    users: [],
    groupRules: {},
    bookings: [],
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
        GroupService,
        {
          provide: getModelToken('Group'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: 1,
        name: 'Weekend Drivers',
        description: 'Group for weekend car bookings',
        createdBy: 1,
      };

      const mockInstance = {
        save: jest.fn().mockResolvedValue(mockGroup),
      };

      mockModel.mockImplementation.mockReturnValue(mockInstance);

      const result = await service.create(createGroupDto);

      expect(result.name).toBe('Weekend Drivers');
      expect(result.description).toBe('Group for weekend car bookings');
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const groups = [mockGroup];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groups),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Weekend Drivers');
    });
  });

  describe('findById', () => {
    it('should return a group by id', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGroup),
      });

      const result = await service.findById(1);

      expect(result.name).toBe('Weekend Drivers');
      expect(mockModel.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCreator', () => {
    it('should return groups created by a user', async () => {
      const groups = [mockGroup];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groups),
      });

      const result = await service.findByCreator(1);

      expect(result).toHaveLength(1);
      expect(mockModel.find).toHaveBeenCalledWith({ createdBy: 1 });
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Group Name',
        description: 'Updated description',
      };

      const updatedGroup = { ...mockGroup, ...updateGroupDto };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedGroup),
      });

      const result = await service.update(1, updateGroupDto);

      expect(result.name).toBe('Updated Group Name');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(1, updateGroupDto, { new: true });
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('createRules', () => {
    it('should create group rules', async () => {
      const createGroupRulesDto: CreateGroupRulesDto = {
        groupId: 1,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      const groupWithRules = {
        ...mockGroup,
        groupRules: createGroupRulesDto,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithRules),
      });

      const result = await service.createRules(createGroupRulesDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createGroupRulesDto.groupId,
        { groupRules: createGroupRulesDto },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const createGroupRulesDto: CreateGroupRulesDto = {
        groupId: 999,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.createRules(createGroupRulesDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateRules', () => {
    it('should update group rules', async () => {
      const groupId = 1;
      const updateGroupRulesDto: UpdateGroupRulesDto = {
        phoneVerification: false,
      };

      const groupWithUpdatedRules = {
        ...mockGroup,
        groupRules: updateGroupRulesDto,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithUpdatedRules),
      });

      const result = await service.updateRules(groupId, updateGroupRulesDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        groupId,
        { $set: { groupRules: updateGroupRulesDto } },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;
      const updateGroupRulesDto: UpdateGroupRulesDto = { phoneVerification: true };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateRules(groupId, updateGroupRulesDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group', async () => {
      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: 1,
        userId: 1,
      };

      const groupWithUser = { ...mockGroup, users: [1] };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithUser),
      });

      const result = await service.addUserToGroup(addUserToGroupDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        addUserToGroupDto.groupId,
        { $addToSet: { users: addUserToGroupDto.userId } },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: 999,
        userId: 1,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.addUserToGroup(addUserToGroupDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group', async () => {
      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: 1,
        userId: 1,
      };

      const groupWithoutUser = { ...mockGroup, users: [] };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithoutUser),
      });

      const result = await service.removeUserFromGroup(removeUserFromGroupDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        removeUserFromGroupDto.groupId,
        { $pull: { users: removeUserFromGroupDto.userId } },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: 999,
        userId: 1,
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.removeUserFromGroup(removeUserFromGroupDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate a group', async () => {
      const groupId = 1;
      const deactivatedGroup = { ...mockGroup, active: false };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedGroup),
      });

      const result = await service.deactivate(groupId);

      expect(result.active).toBe(false);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        groupId,
        { active: false },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deactivate(groupId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const groupId = 1;

      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGroup),
      });

      await service.remove(groupId);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(groupId);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;

      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(groupId)).rejects.toThrow(NotFoundException);
    });
  });
});