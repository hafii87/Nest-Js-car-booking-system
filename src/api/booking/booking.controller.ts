import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { EndBookingDto } from './dto/end-booking.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern({ cmd: 'create_booking' })
  async create(@Payload() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @MessagePattern({ cmd: 'find_all_bookings' })
  async findAll() {
    return this.bookingService.findAll();
  }

  @MessagePattern({ cmd: 'find_booking_by_id' })
  async findById(@Payload() id: number) {
    return this.bookingService.findById(id);
  }

  @MessagePattern({ cmd: 'find_booking_by_userId' })
  async findByUserId(@Payload() userId: number) {
    return this.bookingService.findByUserId(userId);
  }

  @MessagePattern({ cmd: 'update_booking' })
  async update(@Payload() data: { id: number; updateBookingDto: UpdateBookingDto }) {
    return this.bookingService.update(data.id, data.updateBookingDto);
  }

  @MessagePattern({ cmd: 'cancel_booking' })
  async cancel(@Payload() cancelBookingDto: CancelBookingDto) {
    return this.bookingService.cancel(cancelBookingDto);
  }

  @MessagePattern({ cmd: 'end_booking' })
  async end(@Payload() endBookingDto: EndBookingDto) {
    return this.bookingService.end(endBookingDto);
  }

  @MessagePattern({ cmd: 'remove_booking' })
  async remove(@Payload() id: number) {
    return this.bookingService.remove(id);
  }
}