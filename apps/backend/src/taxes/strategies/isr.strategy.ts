import {Decimal} from 'decimal.js';
import type { TaxCalculationStrategy } from './tax-strategy.interface.js';

export const isrStrategy: TaxCalculationStrategy = {
  calculate(baseAmount: string, rate: string): string {
    const result = new Decimal(baseAmount).times(rate);
    return result.toFixed(2);
  },
};