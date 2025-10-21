export class FetchBookingDto {
  readonly id: number;
  readonly userId: number;
  readonly carId: number;
  readonly groupId?: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly status: string;
  readonly active: boolean;
}