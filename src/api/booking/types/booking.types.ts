export type BookingId = number;
export type UserId = number;
export type CarId = number;
export type GroupId = number;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ENDED = 'ENDED',
}

export interface IBooking {
  id: BookingId;
  userId: UserId;
  carId: CarId;
  groupId?: GroupId;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
