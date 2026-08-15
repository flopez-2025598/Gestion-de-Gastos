import type { TaxCalculationStrategy } from './tax-strategy.interface.js';
import { ivaStrategy } from './iva.strategy.js';
import { isrStrategy } from './isr.strategy.js';
import { igssStrategy } from './igss.strategy.js';

const registry: Record<string, TaxCalculationStrategy> = {
  IVA: ivaStrategy,
  ISR: isrStrategy,
  IGSS: igssStrategy,
};

export function getTaxStrategy(taxType: string): TaxCalculationStrategy {
  const strategy = registry[taxType];
  if (!strategy) {
    throw new Error('UNKNOWN_TAX_TYPE');
  }
  return strategy;
}