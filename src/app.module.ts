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
        'mongodb+srv://muhammadhafeezurrehman77_db_user:fLIk6vQyGddsrYzE@cluster0.l9oepbr.mongodb.net/nest?retryWrites=true&w=majority',
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