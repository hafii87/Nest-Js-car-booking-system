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
  let mockGroupModel: any;

  beforeEach(async () => {
    mockGroupModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getModelToken('Group'),
          useValue: mockGroupModel,
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

      const savedGroup = {
        _id: '507f1f77bcf86cd799439011',
        ...createGroupDto,
        active: true,
        users: [],
        createdAt: new Date(),
      };

      const groupInstance = {
        save: jest.fn().mockResolvedValue(savedGroup),
      };

      mockGroupModel.mockImplementation(() => groupInstance);

      const result = await service.create(createGroupDto);

      expect(result.name).toBe(createGroupDto.name);
      expect(result.description).toBe(createGroupDto.description);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const groups = [
        {
          _id: '1',
          name: 'Weekend Drivers',
          description: 'Weekend bookings',
          createdBy: 1,
          active: true,
        },
        {
          _id: '2',
          name: 'Business Travelers',
          description: 'Business trip bookings',
          createdBy: 2,
          active: true,
        },
      ];

      mockGroupModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groups),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockGroupModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a group by id', async () => {
      const groupId = 1;
      const group = {
        _id: '507f1f77bcf86cd799439011',
        id: groupId,
        name: 'Weekend Drivers',
        description: 'Weekend bookings',
        active: true,
      };

      mockGroupModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(group),
      });

      const result = await service.findById(groupId);

      expect(result.name).toBe(group.name);
      expect(mockGroupModel.findById).toHaveBeenCalledWith(groupId);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;

      mockGroupModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(groupId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCreator', () => {
    it('should return groups created by a user', async () => {
      const createdBy = 1;
      const groups = [
        {
          _id: '1',
          name: 'Weekend Drivers',
          createdBy,
          active: true,
        },
      ];

      mockGroupModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groups),
      });

      const result = await service.findByCreator(createdBy);

      expect(result).toHaveLength(1);
      expect(mockGroupModel.find).toHaveBeenCalledWith({ createdBy });
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const groupId = 1;
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Group Name',
        description: 'Updated description',
      };

      const updatedGroup = {
        _id: '507f1f77bcf86cd799439011',
        id: groupId,
        ...updateGroupDto,
        active: true,
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedGroup),
      });

      const result = await service.update(groupId, updateGroupDto);

      expect(result.name).toBe(updateGroupDto.name);
      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(groupId, updateGroupDto, { new: true });
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;
      const updateGroupDto: UpdateGroupDto = { name: 'New Name' };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(groupId, updateGroupDto)).rejects.toThrow(NotFoundException);
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
        _id: '507f1f77bcf86cd799439011',
        id: 1,
        name: 'Weekend Drivers',
        groupRules: createGroupRulesDto,
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithRules),
      });

      const result = await service.createRules(createGroupRulesDto);

      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
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

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.createRules(createGroupRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRules', () => {
    it('should update group rules', async () => {
      const groupId = 1;
      const updateGroupRulesDto: UpdateGroupRulesDto = {
        phoneVerification: false,
      };

      const groupWithUpdatedRules = {
        _id: '507f1f77bcf86cd799439011',
        id: groupId,
        groupRules: updateGroupRulesDto,
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithUpdatedRules),
      });

      const result = await service.updateRules(groupId, updateGroupRulesDto);

      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        groupId,
        { $set: { groupRules: updateGroupRulesDto } },
        { new: true }
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;
      const updateGroupRulesDto: UpdateGroupRulesDto = { phoneVerification: true };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateRules(groupId, updateGroupRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group', async () => {
      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: 1,
        userId: 1,
      };

      const groupWithUser = {
        _id: '507f1f77bcf86cd799439011',
        id: 1,
        name: 'Weekend Drivers',
        users: [1],
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithUser),
      });

      const result = await service.addUserToGroup(addUserToGroupDto);

      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
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

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.addUserToGroup(addUserToGroupDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group', async () => {
      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: 1,
        userId: 1,
      };

      const groupWithoutUser = {
        _id: '507f1f77bcf86cd799439011',
        id: 1,
        name: 'Weekend Drivers',
        users: [],
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(groupWithoutUser),
      });

      const result = await service.removeUserFromGroup(removeUserFromGroupDto);

      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
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

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.removeUserFromGroup(removeUserFromGroupDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a group', async () => {
      const groupId = 1;
      const deactivatedGroup = {
        _id: '507f1f77bcf86cd799439011',
        id: groupId,
        name: 'Weekend Drivers',
        active: false,
      };

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deactivatedGroup),
      });

      const result = await service.deactivate(groupId);

      expect(result.active).toBe(false);
      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(groupId, { active: false }, { new: true });
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;

      mockGroupModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deactivate(groupId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const groupId = 1;
      const group = { _id: '507f1f77bcf86cd799439011', id: groupId };

      mockGroupModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(group),
      });

      await service.remove(groupId);

      expect(mockGroupModel.findByIdAndDelete).toHaveBeenCalledWith(groupId);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const groupId = 999;

      mockGroupModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(groupId)).rejects.toThrow(NotFoundException);
    });
  });
});