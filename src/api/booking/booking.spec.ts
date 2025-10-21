import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { BookingService } from '../booking/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { EndBookingDto } from './dto/end-booking.dto';

describe('BookingService', () => {
  let service: BookingService;
  let mockBookingModel: any;

  beforeEach(async () => {
    mockBookingModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken('Booking'),
          useValue: mockBookingModel,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const savedBooking = {
        _id: '507f1f77bcf86cd799439011',
        ...createBookingDto,
        active: true,
        createdAt: new Date(),
      };

      const bookingInstance = {
        save: jest.fn().mockResolvedValue(savedBooking),
      };

      mockBookingModel.mockImplementation(() => bookingInstance);

      const result = await service.create(createBookingDto);

      expect(result.userId).toBe(createBookingDto.userId);
      expect(result.carId).toBe(createBookingDto.carId);
      expect(result.status).toBe(createBookingDto.status);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const bookings = [
        {
          _id: '1',
          userId: 1,
          carId: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-05'),
          status: 'PENDING',
          active: true,
        },
        {
          _id: '2',
          userId: 2,
          carId: 2,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-05'),
          status: 'CONFIRMED',
          active: true,
        },
      ];

      mockBookingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(bookings),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockBookingModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a booking by id', async () => {
      const bookingId = 1;
      const booking = {
        _id: '507f1f77bcf86cd799439011',
        id: bookingId,
        userId: 1,
        carId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
        active: true,
      };

      mockBookingModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(booking),
      });

      const result = await service.findById(bookingId);

      expect(result.userId).toBe(1);
      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const bookingId = 999;

      mockBookingModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(bookingId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return bookings for a user', async () => {
      const userId = 1;
      const bookings = [
        {
          _id: '1',
          userId,
          carId: 1,
          startDate: new Date('2024-01-01'),
          status: 'PENDING',
          active: true,
        },
      ];

      mockBookingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(bookings),
      });

      const result = await service.findByUserId(userId);

      expect(result).toHaveLength(1);
      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const bookingId = 1;
      const updateBookingDto: UpdateBookingDto = {
        status: 'CONFIRMED',
      };

      const updatedBooking = {
        _id: '507f1f77bcf86cd799439011',
        id: bookingId,
        userId: 1,
        carId: 1,
        ...updateBookingDto,
        active: true,
      };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBooking),
      });

      const result = await service.update(bookingId, updateBookingDto);

      expect(result.status).toBe(updateBookingDto.status);
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(bookingId, updateBookingDto, { new: true });
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const cancelBookingDto: CancelBookingDto = {
        id: '1',
        reason: 'User request',
      };

      const cancelledBooking = {
        _id: '507f1f77bcf86cd799439011',
        userId: 1,
        carId: 1,
        status: 'CANCELLED',
        active: false,
      };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cancelledBooking),
      });

      const result = await service.cancel(cancelBookingDto);

      expect(result.status).toBe('CANCELLED');
      expect(result.active).toBe(false);
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        cancelBookingDto.id,
        { status: 'CANCELLED', active: false },
        { new: true }
      );
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const cancelBookingDto: CancelBookingDto = {
        id: '999',
      };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.cancel(cancelBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('end', () => {
    it('should end a booking', async () => {
      const endBookingDto: EndBookingDto = {
        id: 1,
        reason: 'Journey completed',
      };

      const endedBooking = {
        _id: '507f1f77bcf86cd799439011',
        userId: 1,
        carId: 1,
        status: 'ENDED',
        active: false,
      };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(endedBooking),
      });

      const result = await service.end(endBookingDto);

      expect(result.status).toBe('ENDED');
      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const endBookingDto: EndBookingDto = {
        id: 999,
      };

      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.end(endBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      const bookingId = 1;
      const booking = { _id: '507f1f77bcf86cd799439011', id: bookingId };

      mockBookingModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(booking),
      });

      await service.remove(bookingId);

      expect(mockBookingModel.findByIdAndDelete).toHaveBeenCalledWith(bookingId);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const bookingId = 999;

      mockBookingModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(bookingId)).rejects.toThrow(NotFoundException);
    });
  });
});