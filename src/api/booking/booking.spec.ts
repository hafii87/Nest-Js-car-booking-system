import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { BookingService } from '../booking/booking.service';
import { BookingSchema } from './schema/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { EndBookingDto } from './dto/end-booking.dto';

describe('BookingService with MongoDB Atlas', () => {
  let service: BookingService;
  let module: TestingModule;
  const testPrefix = `test_booking_${Date.now()}_`;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking-system';

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
      ],
      providers: [BookingService],
    }).compile();

    service = module.get<BookingService>(BookingService);
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const BookingModel = module.get('BookingModel');
    if (BookingModel) {
      await BookingModel.deleteMany({ createdAt: { $gte: new Date(Date.now() - 60000) } });
    }
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const result = await service.create(createBookingDto);

      expect(result.userId).toBe(createBookingDto.userId);
      expect(result.carId).toBe(createBookingDto.carId);
      expect(result.status).toBe(createBookingDto.status);
      expect(result.active).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const createBookingDto1: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createBookingDto2: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-05'),
        status: 'CONFIRMED',
      };

      await service.create(createBookingDto1);
      await service.create(createBookingDto2);

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should return bookings array', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a booking by id', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createdBooking = await service.create(createBookingDto);
      const result = await service.findById(createdBooking.id);

      expect(result.userId).toBe(createBookingDto.userId);
      expect(result.carId).toBe(createBookingDto.carId);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      await expect(service.findById(999999999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return bookings for a user', async () => {
      const userId = Math.floor(Math.random() * 1000);

      const createBookingDto1: CreateBookingDto = {
        id: Math.random(),
        userId: userId,
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createBookingDto2: CreateBookingDto = {
        id: Math.random(),
        userId: userId,
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-05'),
        status: 'CONFIRMED',
      };

      await service.create(createBookingDto1);
      await service.create(createBookingDto2);

      const result = await service.findByUserId(userId);

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].userId).toBe(userId);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createdBooking = await service.create(createBookingDto);

      const updateBookingDto: UpdateBookingDto = {
        status: 'CONFIRMED',
      };

      const result = await service.update(createdBooking.id, updateBookingDto);

      expect(result.status).toBe('CONFIRMED');
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: 'CONFIRMED',
      };

      await expect(service.update(999999999, updateBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createdBooking = await service.create(createBookingDto);

      const cancelBookingDto: CancelBookingDto = {
        id: String(createdBooking.id),
        reason: 'User request',
      };

      const result = await service.cancel(cancelBookingDto);

      expect(result.status).toBe('CANCELLED');
      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const cancelBookingDto: CancelBookingDto = {
        id: '999999999',
      };

      await expect(service.cancel(cancelBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('end', () => {
    it('should end a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'ACTIVE',
      };

      const createdBooking = await service.create(createBookingDto);

      const endBookingDto: EndBookingDto = {
        id: createdBooking.id,
        reason: 'Journey completed',
      };

      const result = await service.end(endBookingDto);

      expect(result.status).toBe('ENDED');
      expect(result.active).toBe(false);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      const endBookingDto: EndBookingDto = {
        id: 999999999,
      };

      await expect(service.end(endBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        id: Math.random(),
        userId: Math.floor(Math.random() * 1000),
        carId: Math.floor(Math.random() * 1000),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      };

      const createdBooking = await service.create(createBookingDto);
      await service.remove(createdBooking.id);

      await expect(service.findById(createdBooking.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      await expect(service.remove(999999999)).rejects.toThrow(NotFoundException);
    });
  });
});