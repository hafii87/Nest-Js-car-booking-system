export class FetchUserWithBookingsDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly bookings: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
}