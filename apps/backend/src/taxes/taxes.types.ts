export type TaxType = 'ISR' | 'IGSS';

export interface TaxSettingOutput {
  id: number;
  name: string;
  rate: string;
}

export interface TaxParameterOutput {
  id: number;
  userId: number;
  taxType: TaxType;
  rate: string;
  validFrom: Date;
  validTo: Date | null;
}

export interface CreateTaxParameterInput {
  taxType: TaxType;
  rate: string;
  validFrom: string;
}

export interface CalculateTaxInput {
  taxType: TaxType | 'IVA';
  baseAmount: string;
}

export interface CalculateTaxOutput {
  taxType: string;
  baseAmount: string;
  rate: string;
  amount: string;
}