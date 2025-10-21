export interface BookingResponse {
  id: number;
  userId: number;
  carId: number;
  groupId?: number;
  startDate: Date;
  endDate: Date;
  status: string;
  active: boolean;
}

export interface BookingWithDetailsResponse {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  car: {
    id: number;
    name: string;
    type: string;
    brand: string;
    model: string;
  };
  group?: {
    id: number;
    name: string;
    description: string;
  };
}