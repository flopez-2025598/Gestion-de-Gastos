import {Decimal} from 'decimal.js';
import { emergencyFundRepository } from './emergency-fund.repository.js';
import type { EmergencyFundOutput, MovementInput, MovementOutput } from './emergency-fund.types.js';

function toFundOutput(fund: {
  id: number;
  userId: number;
  balance: unknown;
  createdAt: Date;
  updatedAt: Date;
}): EmergencyFundOutput {
  return {
    id: fund.id,
    userId: fund.userId,
    balance: (fund.balance as { toString(): string }).toString(),
    createdAt: fund.createdAt,
    updatedAt: fund.updatedAt,
  };
}

function toMovementOutput(movement: {
  id: number;
  emergencyFundId: number;
  type: string;
  amount: unknown;
  date: Date;
  description: string | null;
  createdAt: Date;
}): MovementOutput {
  return {
    id: movement.id,
    emergencyFundId: movement.emergencyFundId,
    type: movement.type as 'DEPOSIT' | 'WITHDRAWAL',
    amount: (movement.amount as { toString(): string }).toString(),
    date: movement.date,
    description: movement.description,
    createdAt: movement.createdAt,
  };
}

async function getOrCreateFund(userId: number) {
  const existing = await emergencyFundRepository.findByUserId(userId);
  if (existing) {
    return existing;
  }
  return emergencyFundRepository.create(userId);
}

export const emergencyFundService = {
  async getFund(userId: number): Promise<EmergencyFundOutput> {
    const fund = await getOrCreateFund(userId);
    return toFundOutput(fund);
  },

  async deposit(userId: number, input: MovementInput): Promise<EmergencyFundOutput> {
    const amount = new Decimal(input.amount);
    if (amount.lessThanOrEqualTo(0)) {
      throw new Error('INVALID_AMOUNT');
    }

    const fund = await getOrCreateFund(userId);
    const currentBalance = new Decimal(fund.balance.toString());
    const newBalance = currentBalance.plus(amount);

    await emergencyFundRepository.createMovement(fund.id, {
      type: 'DEPOSIT',
      amount: input.amount,
      ...(input.description !== undefined && { description: input.description }),
    });

    const updated = await emergencyFundRepository.updateBalance(fund.id, newBalance.toFixed(2));
    return toFundOutput(updated);
  },

  async withdraw(userId: number, input: MovementInput): Promise<EmergencyFundOutput> {
    const amount = new Decimal(input.amount);
    if (amount.lessThanOrEqualTo(0)) {
      throw new Error('INVALID_AMOUNT');
    }

    const fund = await getOrCreateFund(userId);
    const currentBalance = new Decimal(fund.balance.toString());

    if (amount.greaterThan(currentBalance)) {
      throw new Error('INSUFFICIENT_BALANCE');
    }

    const newBalance = currentBalance.minus(amount);

    await emergencyFundRepository.createMovement(fund.id, {
      type: 'WITHDRAWAL',
      amount: input.amount,
      ...(input.description !== undefined && { description: input.description }),
    });

    const updated = await emergencyFundRepository.updateBalance(fund.id, newBalance.toFixed(2));
    return toFundOutput(updated);
  },

  async listMovements(userId: number): Promise<MovementOutput[]> {
    const fund = await getOrCreateFund(userId);
    const movements = await emergencyFundRepository.findMovementsByFundId(fund.id);
    return movements.map(toMovementOutput);
  },
};