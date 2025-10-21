import { CreateBookingDto } from '../dto/create-booking.dto';
import { FetchBookingDto } from '../dto/fetch-booking.dto';
import { FetchBookingWithDetailsDto } from '../dto/fetch-booking-with-details.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

export class BookingMapper {
  static toFetchBookingDto(booking: any): FetchBookingDto {
    return {
      id: booking._id || booking.id,
      userId: booking.userId,
      carId: booking.carId,
      groupId: booking.groupId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      active: booking.active,
    };
  }

  static toFetchBookingWithDetailsDto(booking: any): FetchBookingWithDetailsDto {
    return {
      id: booking._id || booking.id,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      user: {
        id: booking.user._id || booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      car: {
        id: booking.car._id || booking.car.id,
        name: booking.car.name,
        type: booking.car.type,
        brand: booking.car.brand,
        model: booking.car.model,
      },
      group: booking.group ? {
        id: booking.group._id || booking.group.id,
        name: booking.group.name,
        description: booking.group.description,
      } : undefined,
    };
  }

  static toDomain(createBookingDto: CreateBookingDto): any {
    return {
      userId: createBookingDto.userId,
      carId: createBookingDto.carId,
      groupId: createBookingDto.groupId,
      startDate: createBookingDto.startDate,
      endDate: createBookingDto.endDate,
      status: createBookingDto.status,
      active: true,
      createdAt: new Date(),
    };
  }
}