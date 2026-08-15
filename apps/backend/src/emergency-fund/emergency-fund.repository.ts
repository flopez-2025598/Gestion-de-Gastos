import { prisma } from '../db/prisma.js';

export const emergencyFundRepository = {
  findByUserId(userId: number) {
    return prisma.emergencyFund.findUnique({ where: { userId } });
  },

  create(userId: number) {
    return prisma.emergencyFund.create({
      data: { userId, balance: '0' },
    });
  },

  updateBalance(id: number, newBalance: string) {
    return prisma.emergencyFund.update({
      where: { id },
      data: { balance: newBalance },
    });
  },

  createMovement(emergencyFundId: number, data: {
    type: 'DEPOSIT' | 'WITHDRAWAL';
    amount: string;
    description?: string;
  }) {
    return prisma.emergencyFundMovement.create({
      data: { emergencyFundId, date: new Date(), ...data },
    });
  },

  findMovementsByFundId(emergencyFundId: number) {
    return prisma.emergencyFundMovement.findMany({
      where: { emergencyFundId },
      orderBy: { date: 'desc' },
    });
  },
};