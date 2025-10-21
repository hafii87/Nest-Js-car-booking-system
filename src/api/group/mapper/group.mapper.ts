import { CreateGroupDto } from '../dto/create-group.dto';
import { FetchGroupDto } from '../dto/fetch-group.dto';
import { FetchGroupWithMembersDto } from '../dto/fetch-group-with-members.dto';
import { FetchGroupWithRulesDto } from '../dto/fetch-group-with-rules.dto';
import { FetchGroupWithAllDetailsDto } from '../dto/fetch-group-with-all-details.dto';

export class GroupMapper {
  static toFetchGroupDto(group: any): FetchGroupDto {
    return {
      id: group._id || group.id,
      name: group.name,
      description: group.description,
      active: group.active,
    };
  }

  static toFetchGroupWithMembersDto(group: any): FetchGroupWithMembersDto {
    return {
      id: group._id || group.id,
      name: group.name,
      description: group.description,
      users: group.users || [],
    };
  }

  static toFetchGroupWithRulesDto(group: any): FetchGroupWithRulesDto {
    return {
      id: group._id || group.id,
      name: group.name,
      description: group.description,
      groupRules: group.groupRules || {},
    };
  }

  static toFetchGroupWithAllDetailsDto(group: any): FetchGroupWithAllDetailsDto {
    return {
      id: group._id || group.id,
      name: group.name,
      description: group.description,
      groupRules: group.groupRules || {},
      users: group.users || [],
      bookings: group.bookings || [],
    };
  }

  static toDomain(createGroupDto: CreateGroupDto): any {
    return {
      name: createGroupDto.name,
      description: createGroupDto.description,
      createdBy: createGroupDto.createdBy,
      active: true,
      createdAt: new Date(),
    };
  }
}