import { taxesRepository } from './taxes.repository.js';
import type {
  TaxSettingOutput,
  TaxParameterOutput,
  CreateTaxParameterInput,
} from './taxes.types.js';

function toParameterOutput(param: {
  id: number;
  userId: number;
  taxType: string;
  rate: unknown;
  validFrom: Date;
  validTo: Date | null;
}): TaxParameterOutput {
  return {
    id: param.id,
    userId: param.userId,
    taxType: param.taxType as 'ISR' | 'IGSS',
    rate: (param.rate as { toString(): string }).toString(),
    validFrom: param.validFrom,
    validTo: param.validTo,
  };
}

export const taxesService = {
  async getIva(): Promise<TaxSettingOutput> {
    const setting = await taxesRepository.findIvaSetting();
    if (!setting) {
      throw new Error('IVA_NOT_CONFIGURED');
    }
    return {
      id: setting.id,
      name: setting.name,
      rate: (setting.rate as { toString(): string }).toString(),
    };
  },

  async listParameters(userId: number): Promise<TaxParameterOutput[]> {
    const params = await taxesRepository.findParametersByUser(userId);
    return params.map(toParameterOutput);
  },

  async getCurrentParameters(userId: number): Promise<TaxParameterOutput[]> {
    const isr = await taxesRepository.findCurrentParameter(userId, 'ISR');
    const igss = await taxesRepository.findCurrentParameter(userId, 'IGSS');
    return [isr, igss].filter((p) => p !== null).map(toParameterOutput);
  },

  async createParameter(userId: number, input: CreateTaxParameterInput): Promise<TaxParameterOutput> {
    const validFrom = new Date(input.validFrom);
    if (Number.isNaN(validFrom.getTime())) {
      throw new Error('INVALID_DATE');
    }

    const current = await taxesRepository.findCurrentParameter(userId, input.taxType);

    if (current && validFrom < current.validFrom) {
      throw new Error('INVALID_DATE_ORDER');
    }

    if (current) {
      await taxesRepository.closeParameter(current.id, validFrom);
    }

    const created = await taxesRepository.createParameter(userId, {
      taxType: input.taxType,
      rate: input.rate,
      validFrom,
    });

    return toParameterOutput(created);
  },
};