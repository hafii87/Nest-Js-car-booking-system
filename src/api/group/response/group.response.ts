export interface GroupResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface GroupWithMembersResponse {
  id: number;
  name: string;
  description: string;
  users: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
  }>;
}

export interface GroupWithRulesResponse {
  id: number;
  name: string;
  description: string;
  groupRules: {
    phoneVerification: boolean;
    emailVerification: boolean;
    licenseVerification: boolean;
    physicalVerification: boolean;
    referenceVerification: boolean;
  };
}

export interface GroupWithAllDetailsResponse {
  id: number;
  name: string;
  description: string;
  groupRules: {
    phoneVerification: boolean;
    emailVerification: boolean;
    licenseVerification: boolean;
    physicalVerification: boolean;
    referenceVerification: boolean;
  };
  users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  bookings: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
}
