export type CarId = string;

export enum CarType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  COUPE = 'COUPE',
  CONVERTIBLE = 'CONVERTIBLE',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export interface ICarRules {
  phoneVerification: boolean;
  emailVerification: boolean;
  licenseVerification: boolean;
  physicalVerification: boolean;
  referenceVerification: boolean;
}

export interface ICAr {
  id: string;
  name: string;
  description: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}