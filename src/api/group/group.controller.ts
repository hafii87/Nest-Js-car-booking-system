import { Controller, Post, Get, Put, Delete, Body, Param } from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupRulesDto } from './dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from './dto/update-group-rules.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.groupService.findById(id);
  }

  @Get('creator/:createdBy')
  async findByCreator(@Param('createdBy') createdBy: number) {
    return this.groupService.findByCreator(createdBy);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Post('rules')
  async createRules(@Body() createGroupRulesDto: CreateGroupRulesDto) {
    return this.groupService.createRules(createGroupRulesDto);
  }

  @Put(':id/rules')
  async updateRules(@Param('id') id: number, @Body() updateGroupRulesDto: UpdateGroupRulesDto) {
    return this.groupService.updateRules(id, updateGroupRulesDto);
  }

  @Post('members/add')
  async addUserToGroup(@Body() addUserToGroupDto: AddUserToGroupDto) {
    return this.groupService.addUserToGroup(addUserToGroupDto);
  }

  @Post('members/remove')
  async removeUserFromGroup(@Body() removeUserFromGroupDto: RemoveUserFromGroupDto) {
    return this.groupService.removeUserFromGroup(removeUserFromGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.groupService.remove(id);
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: number) {
    return this.groupService.deactivate(id);
  }
}