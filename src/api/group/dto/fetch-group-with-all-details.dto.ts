export class FetchGroupWithAllDetailsDto {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly groupRules: {
    phoneVerification: boolean;
    emailVerification: boolean;
    licenseVerification: boolean;
    physicalVerification: boolean;
    referenceVerification: boolean;
  };
  readonly users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  readonly bookings: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
}