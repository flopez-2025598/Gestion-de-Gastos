import 'dotenv/config';
import { prisma } from '../src/db/prisma.js';

const incomeCategories = [
  'Salario', 'Trabajo extra', 'Negocio / Emprendimiento', 'Inversiones',
  'Alquileres', 'Bonificaciones', 'Regalos / Ayuda familiar', 'Reembolsos', 'Otros ingresos',
];

const expenseCategories = [
  'Alimentación', 'Transporte', 'Vivienda', 'Salud', 'Educación', 'Entretenimiento',
  'Servicios', 'Compras', 'Viajes', 'Finanzas / Deudas', 'Otros',
];

async function ensureGlobalCategories(): Promise<void> {
  for (const name of incomeCategories) {
    const existing = await prisma.incomeSource.findFirst({ where: { userId: null, name } });
    if (!existing) await prisma.incomeSource.create({ data: { name, userId: null } });
  }

  for (const name of expenseCategories) {
    const existing = await prisma.expenseCategory.findFirst({ where: { userId: null, name } });
    if (!existing) await prisma.expenseCategory.create({ data: { name, userId: null } });
  }
}

ensureGlobalCategories()
  .then(() => console.log('Categorías iniciales verificadas.'))
  .finally(() => prisma.$disconnect());
