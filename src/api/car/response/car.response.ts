export interface CarResponse {
  id: number;
  name: string;
  description: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  active: boolean;
}

export interface CarWithRulesResponse {
  id: number;
  name: string;
  description: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  carRules: {
    phoneVerification: boolean;
    emailVerification: boolean;
    licenseVerification: boolean;
    physicalVerification: boolean;
    referenceVerification: boolean;
  };
}