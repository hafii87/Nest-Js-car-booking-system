import { Controller, Post, Get, Put, Delete, Body, Param } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { EndBookingDto } from './dto/end-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.bookingService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    return this.bookingService.findByUserId(userId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Post('cancel')
  async cancel(@Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingService.cancel(cancelBookingDto);
  }

  @Post('end')
  async end(@Body() endBookingDto: EndBookingDto) {
    return this.bookingService.end(endBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.bookingService.remove(id);
  }
}