export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export interface UserWithBookingsResponse  {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookings: Array<{
    id : number;
    startDate : Date;
    endDate : Date;
    status : string;
  }>;
}

export interface UserWithGroupsResponse  {
  id: number;
  name: string;
  email: string;
  phone: string;
  groups: Array<{
    id : number;
    name : string;
    description : string;
  }>;
}
