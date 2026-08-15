export interface TaxCalculationStrategy {
  calculate(baseAmount: string, rate: string): string;
}