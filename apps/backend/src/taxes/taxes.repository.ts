import { prisma } from '../db/prisma.js';
import type { TaxType } from './taxes.types.js';

export const taxesRepository = {
  findIvaSetting() {
    return prisma.taxSetting.findUnique({ where: { name: 'IVA' } });
  },

  findParametersByUser(userId: number) {
    return prisma.userTaxParameter.findMany({
      where: { userId },
      orderBy: [{ taxType: 'asc' }, { validFrom: 'desc' }],
    });
  },

  findCurrentParameter(userId: number, taxType: TaxType) {
    return prisma.userTaxParameter.findFirst({
      where: { userId, taxType, validTo: null },
    });
  },

  closeParameter(id: number, validTo: Date) {
    return prisma.userTaxParameter.update({
      where: { id },
      data: { validTo },
    });
  },

  createParameter(userId: number, data: { taxType: TaxType; rate: string; validFrom: Date }) {
    return prisma.userTaxParameter.create({
      data: { userId, ...data },
    });
  },
};