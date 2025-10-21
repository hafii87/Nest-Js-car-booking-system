import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from "./user.service";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  async findById(@Payload() id: number) {
    return this.userService.findById(id);
  }

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findByEmail(@Payload() email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(@Payload() data: { id: number; updateUserDto: UpdateUserDto }) {
    return this.userService.update(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  async remove(@Payload() id: number) {
    return this.userService.remove(id);
  }

  @MessagePattern({ cmd: 'deactivate_user' })
  async deactivate(@Payload() id: number) {
    return this.userService.deactivate(id);
  }
}
