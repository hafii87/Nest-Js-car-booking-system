import { NestFactory } from '@nestjs/core';
import { Logger} from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { CarModule } from '../api/car/car.module';

async function bootstrap() {
  const logger = new Logger('CarMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CarModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8878,
      },
    },
  );

  await app.listen();
  logger.log(' Car Microservice running on port 8878');
}

bootstrap().catch((error) => {
  console.error(' Car Microservice failed:', error);
  process.exit(1);
});