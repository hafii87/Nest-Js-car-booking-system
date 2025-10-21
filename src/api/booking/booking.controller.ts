import { Controller, Post, Get, Put, Delete, Body, Param, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { CancelBookingDto } from "./dto/cancel-booking.dto";
import { EndBookingDto } from "./dto/end-booking.dto";

@Controller("bookings")
export class BookingController {
  constructor(@Inject("BOOKING_SERVICE") private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.client.send({ cmd: "create_booking" }, createBookingDto).toPromise();
  }

  @Get()
  async findAll() {
    return this.client.send({ cmd: "find_all_bookings" }, {}).toPromise();
  }

  @Get(":id")
  async findById(@Param("id") id: number) {
    return this.client.send({ cmd: "find_booking_by_id" }, id).toPromise();
  }

  @Get("user/:userId")
  async findByUserId(@Param("userId") userId: number) {
    return this.client.send({ cmd: "find_booking_by_userId" }, userId).toPromise();
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.client.send({ cmd: "update_booking" }, { id, ...updateBookingDto }).toPromise();
  }

  @Post("cancel")
  async cancel(@Body() cancelBookingDto: CancelBookingDto) {
    return this.client.send({ cmd: "cancel_booking" }, cancelBookingDto).toPromise();
  }

  @Post("end")
  async end(@Body() endBookingDto: EndBookingDto) {
    return this.client.send({ cmd: "end_booking" }, endBookingDto).toPromise();
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.client.send({ cmd: "remove_booking" }, id).toPromise();
  }

  @MessagePattern({ cmd: 'create_booking' })
  async handleCreateBooking(@Payload() data: CreateBookingDto) {
    return this.client.send({ cmd: "create_booking" }, data).toPromise();
  }

  @MessagePattern({ cmd: 'find_all_bookings' })
  async handleFindAll() {
    return this.client.send({ cmd: "find_all_bookings" }, {}).toPromise();
  }

  @MessagePattern({ cmd: 'find_booking_by_id' })
  async handleFindById(@Payload() id: number) {
    return this.client.send({ cmd: "find_booking_by_id" }, id).toPromise();
  }

  @MessagePattern({ cmd: 'find_booking_by_userId' })
  async handleFindByUserId(@Payload() userId: number) {
    return this.client.send({ cmd: "find_booking_by_userId" }, userId).toPromise();
  }

  @MessagePattern({ cmd: 'update_booking' })
  async handleUpdate(@Payload() data: { id: number; updateBookingDto: UpdateBookingDto }) {
    return this.client.send({ cmd: "update_booking" }, data).toPromise();
  }

  @MessagePattern({ cmd: 'cancel_booking' })
  async handleCancel(@Payload() data: CancelBookingDto) {
    return this.client.send({ cmd: "cancel_booking" }, data).toPromise();
  }

  @MessagePattern({ cmd: 'end_booking' })
  async handleEnd(@Payload() data: EndBookingDto) {
    return this.client.send({ cmd: "end_booking" }, data).toPromise();
  }

  @MessagePattern({ cmd: 'remove_booking' })
  async handleRemove(@Payload() id: number) {
    return this.client.send({ cmd: "remove_booking" }, id).toPromise();
  }
}