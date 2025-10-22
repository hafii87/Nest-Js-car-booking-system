import { NestFactory } from '@nestjs/core';
import { Logger} from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from '../api/user/user.module';

async function bootstrap() {
  const logger = new Logger('UserMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8879,
      },
    },
  );

  await app.listen();
  logger.log(' User Microservice running on port 8879');
}

bootstrap().catch((error) => {
  console.error(' User Microservice failed:', error);
  process.exit(1);
});