export class FetchGroupWithRulesDto {
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
}