import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { FetchUserDto } from './dto/fetch-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  private isValidObjectId(id: any): boolean {
    return /^[0-9a-fA-F]{24}$/.test(String(id));
  }

  async create(createUserDto: CreateUserDto): Promise<FetchUserDto> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException(`User with email ${createUserDto.email} already exists`);
    }
    const user = new this.userModel(UserMapper.toDomain(createUserDto));
    const savedUser = await user.save();
    return UserMapper.toFetchUserDto(savedUser);
  }

  async findAll(): Promise<FetchUserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => UserMapper.toFetchUserDto(user));
  }

  async findById(id: number): Promise<FetchUserDto> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toFetchUserDto(user);
  }

  async findByEmail(email: string): Promise<FetchUserDto> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return UserMapper.toFetchUserDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<FetchUserDto> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toFetchUserDto(user);
  }

  async remove(id: number): Promise<void> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deactivate(id: number): Promise<FetchUserDto> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.userModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toFetchUserDto(user);
  }
}