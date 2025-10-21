export class CreateCarRulesDto {
  readonly carId: number;
  readonly phoneVerification: boolean;
  readonly emailVerification: boolean;
  readonly licenseVerification: boolean;
  readonly physicalVerification: boolean;
  readonly referenceVerification: boolean;
}