import { prisma } from '../db/prisma.js';

export const incomeRepository = {
  // Fuentes de ingreso
  findSourcesForUser(userId: number) {
    return prisma.incomeSource.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
      },
      orderBy: { name: 'asc' },
    });
  },

  findSourceById(id: number) {
    return prisma.incomeSource.findUnique({ where: { id } });
  },

  createSource(userId: number, name: string) {
    return prisma.incomeSource.create({
      data: { userId, name },
    });
  },

  // Ingresos
  create(userId: number, data: {
    incomeSourceId: number;
    type: 'FIXED' | 'VARIABLE' | 'EXTRAORDINARY';
    amount: string;
    description?: string;
    date: Date;
  }) {
    return prisma.income.create({
      data: { userId, ...data },
      include: { incomeSource: true },
    });
  },

  findAllByUser(userId: number) {
    return prisma.income.findMany({
      where: { userId },
      include: { incomeSource: true },
      orderBy: { date: 'desc' },
    });
  },

  findByIdForUser(id: number, userId: number) {
    return prisma.income.findFirst({
      where: { id, userId },
      include: { incomeSource: true },
    });
  },

  update(id: number, data: Partial<{
    incomeSourceId: number;
    type: 'FIXED' | 'VARIABLE' | 'EXTRAORDINARY';
    amount: string;
    description: string;
    date: Date;
  }>) {
    return prisma.income.update({
      where: { id },
      data,
      include: { incomeSource: true },
    });
  },

  delete(id: number) {
    return prisma.income.delete({ where: { id } });
  },
};