import { Controller, Post, Get, Put, Delete, Body, Param } from "@nestjs/common";
import { CarService } from "./car.service";
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarRulesDto } from './dto/create-car-rules.dto';
import { UpdateCarRulesDto } from './dto/update-car-rules.dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}
  
  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  async findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.carService.findById(id);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string) {
    return this.carService.findByType(type);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(id, updateCarDto);
  }

  @Post('rules')
  async createRules(@Body() createCarRulesDto: CreateCarRulesDto) {
    return this.carService.createRules(createCarRulesDto);
  }

  @Put('rules/:carId')
  async updateRules(@Param('carId') carId: number, @Body() updateCarRulesDto: UpdateCarRulesDto) {
    return this.carService.updateRules(carId, updateCarRulesDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.carService.remove(id);
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: number) {
    return this.carService.deactivate(id);
  }
}