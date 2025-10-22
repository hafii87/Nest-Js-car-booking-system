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
import { CreateCarDto } from '../car/dto/create-car.dto';
import { UpdateCarDto } from '../car/dto/update-car.dto';
import { CreateCarRulesDto } from '../car/dto/create-car-rules.dto';
import { UpdateCarRulesDto } from '../car/dto/update-car-rules.dto';

@Controller('api/cars')
export class CarGatewayController {
  constructor(@Inject('CAR_SERVICE') private carClient: ClientProxy) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carClient.send({ cmd: 'create_car' }, createCarDto);
  }

  @Get()
  findAll() {
    return this.carClient.send({ cmd: 'find_all_cars' }, {});
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.carClient.send({ cmd: 'find_car_by_id' }, id);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.carClient.send({ cmd: 'find_car_by_type' }, type);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto) {
    return this.carClient.send({ cmd: 'update_car' }, { id, updateCarDto });
  }

  @Post('rules')
  createRules(@Body() createCarRulesDto: CreateCarRulesDto) {
    return this.carClient.send({ cmd: 'create_car_rules' }, createCarRulesDto);
  }

  @Put(':id/rules')
  updateRules(
    @Param('id') carId: number,
    @Body() updateCarRulesDto: UpdateCarRulesDto,
  ) {
    return this.carClient.send(
      { cmd: 'update_car_rules' },
      { carId, updateCarRulesDto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carClient.send({ cmd: 'remove_car' }, id);
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.carClient.send({ cmd: 'deactivate_car' }, id);
  }
}