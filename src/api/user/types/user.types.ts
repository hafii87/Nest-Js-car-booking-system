export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

