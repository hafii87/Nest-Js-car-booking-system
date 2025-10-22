import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupRulesDto } from './dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from './dto/update-group-rules.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @MessagePattern({ cmd: 'create_group' })
  async create(@Payload() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @MessagePattern({ cmd: 'find_all_groups' })
  async findAll() {
    return this.groupService.findAll();
  }

  @MessagePattern({ cmd: 'find_group_by_id' })
  async findById(@Payload() id: number) {
    return this.groupService.findById(id);
  }

  @MessagePattern({ cmd: 'find_group_by_creator' })
  async findByCreator(@Payload() createdBy: number) {
    return this.groupService.findByCreator(createdBy);
  }

  @MessagePattern({ cmd: 'update_group' })
  async update(@Payload() data: { id: number; updateGroupDto: UpdateGroupDto }) {
    return this.groupService.update(data.id, data.updateGroupDto);
  }

  @MessagePattern({ cmd: 'create_group_rules' })
  async createRules(@Payload() createGroupRulesDto: CreateGroupRulesDto) {
    return this.groupService.createRules(createGroupRulesDto);
  }

  @MessagePattern({ cmd: 'update_group_rules' })
  async updateRules(
    @Payload() data: { id: number; updateGroupRulesDto: UpdateGroupRulesDto },
  ) {
    return this.groupService.updateRules(data.id, data.updateGroupRulesDto);
  }

  @MessagePattern({ cmd: 'add_user_to_group' })
  async addUserToGroup(@Payload() addUserToGroupDto: AddUserToGroupDto) {
    return this.groupService.addUserToGroup(addUserToGroupDto);
  }

  @MessagePattern({ cmd: 'remove_user_from_group' })
  async removeUserFromGroup(@Payload() removeUserFromGroupDto: RemoveUserFromGroupDto) {
    return this.groupService.removeUserFromGroup(removeUserFromGroupDto);
  }

  @MessagePattern({ cmd: 'remove_group' })
  async remove(@Payload() id: number) {
    return this.groupService.remove(id);
  }

  @MessagePattern({ cmd: 'deactivate_group' })
  async deactivate(@Payload() id: number) {
    return this.groupService.deactivate(id);
  }
}