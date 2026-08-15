import { prisma } from '../db/prisma.js';

export const usersRepository = {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  findAll() {
    return prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  },

  updateProfile(id: number, data: { fullName?: string }) {
    return prisma.user.update({ where: { id }, data });
  },

  updateRole(id: number, role: 'ADMIN' | 'USER') {
    return prisma.user.update({ where: { id }, data: { role } });
  },
};