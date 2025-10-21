import { Controller, Post, Get, Put, Delete, Body, Param, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { CancelBookingDto } from "./dto/cancel-booking.dto";
import { EndBookingDto } from "./dto/end-booking.dto";

@Controller("bookings")
export class BookingController {
  constructor(@Inject("BOOKING_SERVICE") private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.client.send({ cmd: "create_booking" }, createBookingDto);
  }

  @Get()
  async findAll() {
    return this.client.send({ cmd: "find_all_bookings" }, {});
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    return this.client.send({ cmd: "find_booking_by_id" }, id);
  }

  @Get("user/:userId")
  async findByUserId(@Param("userId") userId: number) {
    return this.client.send({ cmd: "find_booking_by_userId" }, userId);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.client.send({ cmd: "update_booking" }, { id, ...updateBookingDto });
  }

  @Post("cancel")
  async cancel(@Body() cancelBookingDto: CancelBookingDto) {
    return this.client.send({ cmd: "cancel_booking" }, cancelBookingDto);
  }

  @Post("end")
  async end(@Body() endBookingDto: EndBookingDto) {
    return this.client.send({ cmd: "end_booking" }, endBookingDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.client.send({ cmd: "remove_booking" }, id);
  }
}
