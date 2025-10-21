import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarController } from './car.controller';
import { CarService } from '../car/car.service';
import { CarSchema } from './schema/car.schema';

@Module({
  controllers: [CarController],
  imports: [
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
  ],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}