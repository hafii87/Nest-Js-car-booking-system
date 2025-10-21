import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingService } from '../booking/booking.service';
import { BookingSchema } from './schema/booking.schema';

@Module({
  controllers: [BookingController],
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
  ],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}