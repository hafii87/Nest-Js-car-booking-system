import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookingController } from './booking.controller';
import { BookingService } from '../booking/booking.service';
import { BookingSchema } from './schema/booking.schema';

@Module({
  controllers: [BookingController],
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
    ClientsModule.register([
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
        },
      },
    ]),
  ],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}