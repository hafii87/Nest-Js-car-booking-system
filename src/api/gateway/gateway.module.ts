import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserGatewayController } from './user-gateway.controller';
import { CarGatewayController } from './car-gateway.controller';
import { BookingGatewayController } from './booking-gateway.controller';
import { GroupGatewayController } from './group-gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8879,
        },
      },
      {
        name: 'CAR_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8878,
        },
      },
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
        },
      },
      {
        name: 'GROUP_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8880,
        },
      },
    ]),
  ],
  controllers: [
    UserGatewayController,
    CarGatewayController,
    BookingGatewayController,
    GroupGatewayController,
  ],
})
export class GatewayModule {}