import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { FetchCarDto } from './dto/fetch-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarRulesDto } from './dto/create-car-rules.dto';
import { UpdateCarRulesDto } from './dto/update-car-rules.dto';
import { CarMapper } from './mapper/car.mapper';

@Injectable()
export class CarService {
  constructor(@InjectModel('Car') private carModel: Model<any>) {}

  async create(createCarDto: CreateCarDto): Promise<FetchCarDto> {
    const car = new this.carModel(CarMapper.toDomain(createCarDto));
    const savedCar = await car.save();
    return CarMapper.toFetchCarDto(savedCar);
  }

  async findAll(): Promise<FetchCarDto[]> {
    const cars = await this.carModel.find().exec();
    return cars.map(car => CarMapper.toFetchCarDto(car));
  }
   async findById(id: number): Promise<FetchCarDto> {
    const car = await this.carModel.findById(id).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return CarMapper.toFetchCarDto(car);
  }

  async findByType(type: string): Promise<FetchCarDto[]> {
    const cars = await this.carModel.find({ type }).exec();
    return cars.map(car => CarMapper.toFetchCarDto(car));
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<FetchCarDto> {
    const car = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return CarMapper.toFetchCarDto(car);
  }

  async createRules(createCarRulesDto: CreateCarRulesDto): Promise<any> {
    const car = await this.carModel.findByIdAndUpdate(
      createCarRulesDto.carId,
      { carRules: createCarRulesDto },
      { new: true }
    ).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${createCarRulesDto.carId} not found`);
    }
    return CarMapper.toFetchCarWithRulesDto(car);
  }

  async updateRules(carId: number, updateCarRulesDto: UpdateCarRulesDto): Promise<any> {
    const car = await this.carModel.findByIdAndUpdate(
      carId,
      { $set: { 'carRules': updateCarRulesDto } },
      { new: true }
    ).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }
    return CarMapper.toFetchCarWithRulesDto(car);
  }

  async remove(id: number): Promise<void> {
    const car = await this.carModel.findByIdAndDelete(id).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
  }

  async deactivate(id: number): Promise<FetchCarDto> {
    const car = await this.carModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec();
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return CarMapper.toFetchCarDto(car);
  }
}
