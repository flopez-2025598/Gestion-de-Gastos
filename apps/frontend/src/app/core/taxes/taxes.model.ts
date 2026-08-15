export type TaxType = 'IVA' | 'ISR' | 'IGSS';
export type UserTaxType = Exclude<TaxType, 'IVA'>;

export interface TaxSetting {
  id: number;
  name: string;
  rate: string;
}

export interface TaxParameter {
  id: number;
  userId: number;
  taxType: UserTaxType;
  rate: string;
  validFrom: string;
  validTo: string | null;
}

export interface TaxCalculationRequest {
  taxType: TaxType;
  baseAmount: string;
}

export interface TaxCalculation {
  taxType: TaxType;
  baseAmount: string;
  rate: string;
  amount: string;
}
