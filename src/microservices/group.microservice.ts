import { NestFactory } from '@nestjs/core';
import { Logger} from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { GroupModule } from '../api/group/group.module';

async function bootstrap() {
  const logger = new Logger('GroupMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GroupModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8880,
      },
    },
  );

  await app.listen();
  logger.log(' Group Microservice running on port 8880');
}

bootstrap().catch((error) => {
  console.error(' Group Microservice failed:', error);
  process.exit(1);
});