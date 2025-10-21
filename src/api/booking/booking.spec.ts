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
  let mockModel: any;

  const mockBooking = {
    _id: '507f1f77bcf86cd799439011',
    id: 1,
    userId: 1,
    carId: 1,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-05'),
    status: 'PENDING',
    active: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    // Mock the constructor to return an instance with save method
    mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockBooking),
    }));

    // Add query methods to the mock function
    mockModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockBooking]),
    });

    mockModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBooking),
    });

    mockModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBooking),
    });

    mockModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBooking),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken('Booking'),
          useValue: mockModel,
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

      const result = await service.create(createBookingDto);

      expect(result.userId).toBe(createBookingDto.userId);
      expect(result.carId).toBe(createBookingDto.carId);
      expect(result.status).toBe(createBookingDto.status);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a booking by id', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBooking),
      });

      const result = await service.findById(1);

      expect(result.userId).toBe(1);
      expect(mockModel.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return bookings for a user', async () => {
      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockBooking]),
      });

      const result = await service.findByUserId(1);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: 'CONFIRMED',
      };

      const updatedBooking = { ...mockBooking, status: 'CONFIRMED' };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBooking),
      });

      const result = await service.update(1, updateBookingDto);

      expect(result.status).toBe('CONFIRMED');
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const cancelBookingDto: CancelBookingDto = {
        id: '1',
        reason: 'User request',
      };

      const cancelledBooking = { ...mockBooking, status: 'CANCELLED', active: false };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cancelledBooking),
      });

      const result = await service.cancel(cancelBookingDto);

      expect(result.status).toBe('CANCELLED');
      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.cancel({ id: '999' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('end', () => {
    it('should end a booking', async () => {
      const endBookingDto: EndBookingDto = {
        id: 1,
        reason: 'Journey completed',
      };

      const endedBooking = { ...mockBooking, status: 'ENDED', active: false };

      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(endedBooking),
      });

      const result = await service.end(endBookingDto);

      expect(result.status).toBe('ENDED');
      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.end({ id: 999 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBooking),
      });

      await service.remove(1);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});