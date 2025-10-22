import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarRulesDto } from './dto/create-car-rules.dto';
import { UpdateCarRulesDto } from './dto/update-car-rules.dto';

@Controller()
export class CarController {
  constructor(private readonly carService: CarService) {}

  @MessagePattern({ cmd: 'create_car' })
  async create(@Payload() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @MessagePattern({ cmd: 'find_all_cars' })
  async findAll() {
    return this.carService.findAll();
  }

  @MessagePattern({ cmd: 'find_car_by_id' })
  async findById(@Payload() id: number) {
    return this.carService.findById(id);
  }

  @MessagePattern({ cmd: 'find_car_by_type' })
  async findByType(@Payload() type: string) {
    return this.carService.findByType(type);
  }

  @MessagePattern({ cmd: 'update_car' })
  async update(@Payload() data: { id: number; updateCarDto: UpdateCarDto }) {
    return this.carService.update(data.id, data.updateCarDto);
  }

  @MessagePattern({ cmd: 'create_car_rules' })
  async createRules(@Payload() createCarRulesDto: CreateCarRulesDto) {
    return this.carService.createRules(createCarRulesDto);
  }

  @MessagePattern({ cmd: 'update_car_rules' })
  async updateRules(
    @Payload() data: { carId: number; updateCarRulesDto: UpdateCarRulesDto },
  ) {
    return this.carService.updateRules(data.carId, data.updateCarRulesDto);
  }

  @MessagePattern({ cmd: 'remove_car' })
  async remove(@Payload() id: number) {
    return this.carService.remove(id);
  }

  @MessagePattern({ cmd: 'deactivate_car' })
  async deactivate(@Payload() id: number) {
    return this.carService.deactivate(id);
  }
}