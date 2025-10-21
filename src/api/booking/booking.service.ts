import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FetchBookingDto } from './dto/fetch-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { EndBookingDto } from './dto/end-booking.dto';
import { BookingMapper } from './mapper/booking.mapper';

@Injectable()
export class BookingService {
  constructor(@InjectModel('Booking') private bookingModel: Model<any>) {}

  async create(createBookingDto: CreateBookingDto): Promise<FetchBookingDto> {
    const booking = new this.bookingModel(BookingMapper.toDomain(createBookingDto));
    const savedBooking = await booking.save();
    return BookingMapper.toFetchBookingDto(savedBooking);
  }

  async findAll(): Promise<FetchBookingDto[]> {
    const bookings = await this.bookingModel.find().exec();
    return bookings.map(booking => BookingMapper.toFetchBookingDto(booking));
  }

  async findById(id: number): Promise<FetchBookingDto> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return BookingMapper.toFetchBookingDto(booking);
  }

  async findByUserId(userId: number): Promise<FetchBookingDto[]> {
    const bookings = await this.bookingModel.find({ userId }).exec();
    return bookings.map(booking => BookingMapper.toFetchBookingDto(booking));
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<FetchBookingDto> {
    const booking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return BookingMapper.toFetchBookingDto(booking);
  }

  async cancel(cancelBookingDto: CancelBookingDto): Promise<FetchBookingDto> {
    const booking = await this.bookingModel.findByIdAndUpdate(
      cancelBookingDto.id,
      { status: 'CANCELLED', active: false },
      { new: true }
    ).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${cancelBookingDto.id} not found`);
    }
    return BookingMapper.toFetchBookingDto(booking);
  }

  async end(endBookingDto: EndBookingDto): Promise<FetchBookingDto> {
    const booking = await this.bookingModel.findByIdAndUpdate(
      endBookingDto.id,
      { status: 'ENDED', active: false },
      { new: true }
    ).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${endBookingDto.id} not found`);
    }
    return BookingMapper.toFetchBookingDto(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}