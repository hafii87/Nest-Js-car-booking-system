export type GroupId = number;

export interface IGroupRules {
  phoneVerification: boolean;
  emailVerification: boolean;
  licenseVerification: boolean;
  physicalVerification: boolean;
  referenceVerification: boolean;
}

export interface IGroup {
  id: GroupId;
  name: string;
  description: string;
  createdBy: number;
  groupRules?: IGroupRules;
  users?: number[];
  bookings?: number[];
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}