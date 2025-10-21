export class FetchBookingWithDetailsDto {
  readonly id: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly status: string;
  readonly user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  readonly car: {
    id: number;
    name: string;
    type: string;
    brand: string;
    model: string;
  };
  readonly group?: {
    id: number;
    name: string;
    description: string;
  };
}