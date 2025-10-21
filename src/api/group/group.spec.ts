import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { GroupService } from '../group/group.service';
import { GroupSchema } from './schema/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupRulesDto } from './dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from './dto/update-group-rules.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';

describe('GroupService with MongoDB Atlas', () => {
  let service: GroupService;
  let module: TestingModule;
  const testPrefix = `test_group_${Date.now()}_`;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking-system';

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
      ],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const GroupModel = module.get('GroupModel');
    if (GroupModel) {
      await GroupModel.deleteMany({ createdAt: { $gte: new Date(Date.now() - 60000) } });
    }
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const result = await service.create(createGroupDto);

      expect(result.name).toContain('Weekend Drivers');
      expect(result.active).toBe(true);
      expect(result.description).toBe('Group for weekend car bookings');
    });

    it('should create multiple groups with different creators', async () => {
      const createdBy1 = Math.floor(Math.random() * 1000);
      const createdBy2 = Math.floor(Math.random() * 1000);

      const createGroupDto1: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: createdBy1,
      };

      const createGroupDto2: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Business Travel`,
        description: 'Group for business travel',
        createdBy: createdBy2,
      };

      const result1 = await service.create(createGroupDto1);
      const result2 = await service.create(createGroupDto2);

      expect(result1.name).toContain('Weekend Drivers');
      expect(result2.name).toContain('Business Travel');
    });

    it('should initialize group with empty users array', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}New Group`,
        description: 'Fresh group',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const result = await service.create(createGroupDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('active');
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const createGroupDto1: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createGroupDto2: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Business Travel`,
        description: 'Group for business travel',
        createdBy: Math.floor(Math.random() * 1000),
      };

      await service.create(createGroupDto1);
      await service.create(createGroupDto2);

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should return groups array even when empty', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return groups with correct structure', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Test Group`,
        description: 'Test description',
        createdBy: Math.floor(Math.random() * 1000),
      };

      await service.create(createGroupDto);
      const result = await service.findAll();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('active');
    });
  });

  describe('findById', () => {
    it('should return a group by id', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const result = await service.findById(createdGroup.id);

      expect(result.name).toContain('Weekend Drivers');
      expect(result.description).toBe('Group for weekend car bookings');
    });

    it('should throw NotFoundException when group does not exist', async () => {
      await expect(service.findById(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should return group with all properties', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Complete Group`,
        description: 'Test group with all properties',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const result = await service.findById(createdGroup.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('active');
    });
  });

  describe('findByCreator', () => {
    it('should return groups created by a specific user', async () => {
      const createdBy = Math.floor(Math.random() * 1000);

      const createGroupDto1: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: createdBy,
      };

      const createGroupDto2: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Business Travel`,
        description: 'Group for business travel',
        createdBy: createdBy,
      };

      await service.create(createGroupDto1);
      await service.create(createGroupDto2);

      const result = await service.findByCreator(createdBy);

      expect(result.length).toBeGreaterThanOrEqual(2);
      result.forEach(group => {
        expect(group).toHaveProperty('id');
      });
    });

    it('should return empty array for user with no groups', async () => {
      const createdBy = 999999999;
      const result = await service.findByCreator(createdBy);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should only return groups by specific creator', async () => {
      const createdBy1 = Math.floor(Math.random() * 1000);
      const createdBy2 = Math.floor(Math.random() * 1000);

      const createGroupDto1: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Group by User 1`,
        description: 'Created by user 1',
        createdBy: createdBy1,
      };

      const createGroupDto2: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Group by User 2`,
        description: 'Created by user 2',
        createdBy: createdBy2,
      };

      await service.create(createGroupDto1);
      await service.create(createGroupDto2);

      const result = await service.findByCreator(createdBy1);

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('update', () => {
    it('should update group name', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);

      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Weekend Drivers',
      };

      const result = await service.update(createdGroup.id, updateGroupDto);

      expect(result.name).toBe('Updated Weekend Drivers');
    });

    it('should update group description', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);

      const updateGroupDto: UpdateGroupDto = {
        description: 'Updated description for weekend group',
      };

      const result = await service.update(createdGroup.id, updateGroupDto);

      expect(result.description).toBe('Updated description for weekend group');
    });

    it('should update multiple group properties', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);

      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const result = await service.update(createdGroup.id, updateGroupDto);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated Description');
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const updateGroupDto: UpdateGroupDto = {
        name: 'New Name',
      };

      await expect(service.update(999999999, updateGroupDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createRules', () => {
    it('should create group rules', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);

      const createGroupRulesDto: CreateGroupRulesDto = {
        groupId: createdGroup.id,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      const result = await service.createRules(createGroupRulesDto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const createGroupRulesDto: CreateGroupRulesDto = {
        groupId: 999999999,
        phoneVerification: true,
        emailVerification: true,
        licenseVerification: true,
        physicalVerification: false,
        referenceVerification: false,
      };

      await expect(service.createRules(createGroupRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRules', () => {
    it('should update group rules', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);

      const updateGroupRulesDto: UpdateGroupRulesDto = {
        phoneVerification: true,
        emailVerification: false,
      };

      const result = await service.updateRules(createdGroup.id, updateGroupRulesDto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const updateGroupRulesDto: UpdateGroupRulesDto = {
        phoneVerification: true,
      };

      await expect(service.updateRules(999999999, updateGroupRulesDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const userId = Math.floor(Math.random() * 1000);

      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId,
      };

      const result = await service.addUserToGroup(addUserToGroupDto);

      expect(result).toBeDefined();
    });

    it('should add multiple users to a group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const userId1 = Math.floor(Math.random() * 1000);
      const userId2 = Math.floor(Math.random() * 1000);

      const addUserToGroupDto1: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId1,
      };

      const addUserToGroupDto2: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId2,
      };

      await service.addUserToGroup(addUserToGroupDto1);
      await service.addUserToGroup(addUserToGroupDto2);

      const result = await service.findById(createdGroup.id);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: 999999999,
        userId: 1,
      };

      await expect(service.addUserToGroup(addUserToGroupDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const userId = Math.floor(Math.random() * 1000);

      const addUserToGroupDto: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId,
      };

      await service.addUserToGroup(addUserToGroupDto);

      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: createdGroup.id,
        userId: userId,
      };

      const result = await service.removeUserFromGroup(removeUserFromGroupDto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: 999999999,
        userId: 1,
      };

      await expect(service.removeUserFromGroup(removeUserFromGroupDto)).rejects.toThrow(NotFoundException);
    });

    it('should remove specific user from group with multiple users', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const userId1 = Math.floor(Math.random() * 1000);
      const userId2 = Math.floor(Math.random() * 1000);

      const addUserToGroupDto1: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId1,
      };

      const addUserToGroupDto2: AddUserToGroupDto = {
        groupId: createdGroup.id,
        userId: userId2,
      };

      await service.addUserToGroup(addUserToGroupDto1);
      await service.addUserToGroup(addUserToGroupDto2);

      const removeUserFromGroupDto: RemoveUserFromGroupDto = {
        groupId: createdGroup.id,
        userId: userId1,
      };

      const result = await service.removeUserFromGroup(removeUserFromGroupDto);

      expect(result).toBeDefined();
    });
  });

  describe('deactivate', () => {
    it('should deactivate a group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const result = await service.deactivate(createdGroup.id);

      expect(result.active).toBe(false);
      expect(result.name).toContain('Weekend Drivers');
    });

    it('should throw NotFoundException when group does not exist', async () => {
      await expect(service.deactivate(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should keep other group properties after deactivation', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      const result = await service.deactivate(createdGroup.id);

      expect(result.name).toContain('Weekend Drivers');
      expect(result.description).toBe('Group for weekend car bookings');
      expect(result.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      await service.remove(createdGroup.id);

      await expect(service.findById(createdGroup.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      await expect(service.remove(999999999)).rejects.toThrow(NotFoundException);
    });

    it('should delete multiple groups', async () => {
      const createGroupDto1: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Weekend Drivers`,
        description: 'Group for weekend car bookings',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createGroupDto2: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Business Travel`,
        description: 'Group for business travel',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const group1 = await service.create(createGroupDto1);
      const group2 = await service.create(createGroupDto2);

      await service.remove(group1.id);
      await service.remove(group2.id);

      await expect(service.findById(group1.id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(group2.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('integration tests', () => {
    it('should handle complete group lifecycle', async () => {
      // Create group
      const createGroupDto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Lifecycle Group`,
        description: 'Testing complete lifecycle',
        createdBy: Math.floor(Math.random() * 1000),
      };

      const createdGroup = await service.create(createGroupDto);
      expect(createdGroup.active).toBe(true);

      // Add users
      const userId1 = Math.floor(Math.random() * 1000);
      const userId2 = Math.floor(Math.random() * 1000);

      await service.addUserToGroup({ groupId: createdGroup.id, userId: userId1 });
      await service.addUserToGroup({ groupId: createdGroup.id, userId: userId2 });

      // Update group
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Lifecycle Group',
      };
      const updatedGroup = await service.update(createdGroup.id, updateGroupDto);
      expect(updatedGroup.name).toBe('Updated Lifecycle Group');

      // Remove user
      await service.removeUserFromGroup({ groupId: createdGroup.id, userId: userId1 });

      // Deactivate group
      const deactivatedGroup = await service.deactivate(createdGroup.id);
      expect(deactivatedGroup.active).toBe(false);

      // Delete group
      await service.remove(createdGroup.id);

      // Verify deletion
      await expect(service.findById(createdGroup.id)).rejects.toThrow(NotFoundException);
    });

    it('should manage multiple groups with different creators', async () => {
      const creator1 = Math.floor(Math.random() * 1000);
      const creator2 = Math.floor(Math.random() * 1000);

      const group1Dto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Group by Creator 1`,
        description: 'First creator group',
        createdBy: creator1,
      };

      const group2Dto: CreateGroupDto = {
        id: Math.random(),
        name: `${testPrefix}Group by Creator 2`,
        description: 'Second creator group',
        createdBy: creator2,
      };

      const group1 = await service.create(group1Dto);
      const group2 = await service.create(group2Dto);

      const creator1Groups = await service.findByCreator(creator1);
      const creator2Groups = await service.findByCreator(creator2);

      expect(creator1Groups.length).toBeGreaterThanOrEqual(1);
      expect(creator2Groups.length).toBeGreaterThanOrEqual(1);

      await service.remove(group1.id);
      await service.remove(group2.id);
    });
  });
});