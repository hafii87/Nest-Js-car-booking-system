import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { FetchGroupDto } from './dto/fetch-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupRulesDto } from './dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from './dto/update-group-rules.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';
import { GroupMapper } from './mapper/group.mapper';

@Injectable()
export class GroupService {
  constructor(@InjectModel('Group') private groupModel: Model<any>) {}

  async create(createGroupDto: CreateGroupDto): Promise<FetchGroupDto> {
    const group = new this.groupModel(GroupMapper.toDomain(createGroupDto));
    const savedGroup = await group.save();
    return GroupMapper.toFetchGroupDto(savedGroup);
  }

  async findAll(): Promise<FetchGroupDto[]> {
    const groups = await this.groupModel.find().exec();
    return groups.map(group => GroupMapper.toFetchGroupDto(group));
  }

  async findById(id: number): Promise<FetchGroupDto> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return GroupMapper.toFetchGroupDto(group);
  }

  async findByCreator(createdBy: number): Promise<FetchGroupDto[]> {
    const groups = await this.groupModel.find({ createdBy }).exec();
    return groups.map(group => GroupMapper.toFetchGroupDto(group));
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<FetchGroupDto> {
    const group = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return GroupMapper.toFetchGroupDto(group);
  }

  async createRules(createGroupRulesDto: CreateGroupRulesDto): Promise<any> {
    const group = await this.groupModel.findByIdAndUpdate(
      createGroupRulesDto.groupId,
      { groupRules: createGroupRulesDto },
      { new: true }
    ).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${createGroupRulesDto.groupId} not found`);
    }
    return GroupMapper.toFetchGroupWithRulesDto(group);
  }

  async updateRules(groupId: number, updateGroupRulesDto: UpdateGroupRulesDto): Promise<any> {
    const group = await this.groupModel.findByIdAndUpdate(
      groupId,
      { $set: { 'groupRules': updateGroupRulesDto } },
      { new: true }
    ).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return GroupMapper.toFetchGroupWithRulesDto(group);
  }

  async addUserToGroup(addUserToGroupDto: AddUserToGroupDto): Promise<any> {
    const group = await this.groupModel.findByIdAndUpdate(
      addUserToGroupDto.groupId,
      { $addToSet: { users: addUserToGroupDto.userId } },
      { new: true }
    ).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${addUserToGroupDto.groupId} not found`);
    }
    return GroupMapper.toFetchGroupWithMembersDto(group);
  }

  async removeUserFromGroup(removeUserFromGroupDto: RemoveUserFromGroupDto): Promise<any> {
    const group = await this.groupModel.findByIdAndUpdate(
      removeUserFromGroupDto.groupId,
      { $pull: { users: removeUserFromGroupDto.userId } },
      { new: true }
    ).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${removeUserFromGroupDto.groupId} not found`);
    }
    return GroupMapper.toFetchGroupWithMembersDto(group);
  }

  async remove(id: number): Promise<void> {
    const group = await this.groupModel.findByIdAndDelete(id).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }

  async deactivate(id: number): Promise<FetchGroupDto> {
    const group = await this.groupModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return GroupMapper.toFetchGroupDto(group);
  }
}