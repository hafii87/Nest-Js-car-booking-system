import { NestFactory } from '@nestjs/core';
import { Logger} from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { BookingModule } from '../api/booking/booking.module';

async function bootstrap() {
  const logger = new Logger('BookingMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    },
  );

  await app.listen();
  logger.log(' Booking Microservice running on port 8877');
}

bootstrap().catch((error) => {
  console.error(' Booking Microservice failed:', error);
  process.exit(1);
});
