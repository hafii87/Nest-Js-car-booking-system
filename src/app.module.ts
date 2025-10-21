import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { BookingModule } from './api/booking/booking.module';
import { CarModule } from './api/car/car.module';
import { GroupModule } from './api/group/group.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/car-booking-system',
    ),
    UserModule,
    BookingModule,
    CarModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}