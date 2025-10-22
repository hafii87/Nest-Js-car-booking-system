import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { UpdateBookingDto } from '../booking/dto/update-booking.dto';
import { CancelBookingDto } from '../booking/dto/cancel-booking.dto';
import { EndBookingDto } from '../booking/dto/end-booking.dto';

@Controller('api/bookings')
export class BookingGatewayController {
  constructor(@Inject('BOOKING_SERVICE') private bookingClient: ClientProxy) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingClient.send({ cmd: 'create_booking' }, createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingClient.send({ cmd: 'find_all_bookings' }, {});
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.bookingClient.send({ cmd: 'find_booking_by_id' }, id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.bookingClient.send({ cmd: 'find_booking_by_userId' }, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingClient.send(
      { cmd: 'update_booking' },
      { id, updateBookingDto },
    );
  }

  @Post('cancel')
  cancel(@Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingClient.send({ cmd: 'cancel_booking' }, cancelBookingDto);
  }

  @Post('end')
  end(@Body() endBookingDto: EndBookingDto) {
    return this.bookingClient.send({ cmd: 'end_booking' }, endBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingClient.send({ cmd: 'remove_booking' }, id);
  }
}