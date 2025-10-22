import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { UpdateGroupDto } from '../group/dto/update-group.dto';
import { CreateGroupRulesDto } from '../group/dto/create-group-rules.dto';
import { UpdateGroupRulesDto } from '../group/dto/update-group-rules.dto';
import { AddUserToGroupDto } from '../group/dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from '../group/dto/remove-user-from-group.dto';

@Controller('api/groups')
export class GroupGatewayController {
  constructor(@Inject('GROUP_SERVICE') private groupClient: ClientProxy) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupClient.send({ cmd: 'create_group' }, createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupClient.send({ cmd: 'find_all_groups' }, {});
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.groupClient.send({ cmd: 'find_group_by_id' }, id);
  }

  @Get('creator/:createdBy')
  findByCreator(@Param('createdBy') createdBy: number) {
    return this.groupClient.send({ cmd: 'find_group_by_creator' }, createdBy);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupClient.send(
      { cmd: 'update_group' },
      { id, updateGroupDto },
    );
  }

  @Post('rules')
  createRules(@Body() createGroupRulesDto: CreateGroupRulesDto) {
    return this.groupClient.send({ cmd: 'create_group_rules' }, createGroupRulesDto);
  }

  @Put(':id/rules')
  updateRules(
    @Param('id') id: number,
    @Body() updateGroupRulesDto: UpdateGroupRulesDto,
  ) {
    return this.groupClient.send(
      { cmd: 'update_group_rules' },
      { id, updateGroupRulesDto },
    );
  }

  @Post('add-user')
  addUserToGroup(@Body() addUserToGroupDto: AddUserToGroupDto) {
    return this.groupClient.send({ cmd: 'add_user_to_group' }, addUserToGroupDto);
  }

  @Post('remove-user')
  removeUserFromGroup(@Body() removeUserFromGroupDto: RemoveUserFromGroupDto) {
    return this.groupClient.send(
      { cmd: 'remove_user_from_group' },
      removeUserFromGroupDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupClient.send({ cmd: 'remove_group' }, id);
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.groupClient.send({ cmd: 'deactivate_group' }, id);
  }
}