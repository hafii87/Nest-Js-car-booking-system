export class FetchCarWithRulesDto {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly brand: string;
  readonly model: string;
  readonly color: string;
  readonly carRules: {
    phoneVerification: boolean;
    emailVerification: boolean;
    licenseVerification: boolean;
    physicalVerification: boolean;
    referenceVerification: boolean;
  };
}