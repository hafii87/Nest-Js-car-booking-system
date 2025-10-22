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
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('api/users')
export class UserGatewayController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userClient.send({ cmd: 'create_user' }, createUserDto);
  }

  @Get()
  findAll() {
    return this.userClient.send({ cmd: 'find_all_users' }, {});
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userClient.send({ cmd: 'find_user_by_id' }, id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userClient.send({ cmd: 'find_user_by_email' }, email);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userClient.send(
      { cmd: 'update_user' },
      { id, updateUserDto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userClient.send({ cmd: 'remove_user' }, id);
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.userClient.send({ cmd: 'deactivate_user' }, id);
  }
}