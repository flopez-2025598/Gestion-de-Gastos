import type { Request, Response } from 'express';
import { emergencyFundService } from './emergency-fund.service.js';
import type { MovementInput } from './emergency-fund.types.js';

function handleError(err: unknown, res: Response) {
  if (err instanceof Error) {
    if (err.message === 'INVALID_AMOUNT') {
      return res.status(400).json({ error: 'El monto debe ser mayor a cero' });
    }
    if (err.message === 'INSUFFICIENT_BALANCE') {
      return res.status(400).json({ error: 'Saldo insuficiente para realizar el retiro' });
    }
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

export const emergencyFundController = {
  async getFund(req: Request, res: Response) {
    const userId = req.auth!.userId;
    try {
      const fund = await emergencyFundService.getFund(userId);
      return res.status(200).json(fund);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async deposit(req: Request, res: Response) {
    const userId = req.auth!.userId;
    const { amount, description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'El monto es requerido' });
    }

    try {
      const input: MovementInput = {
        amount: String(amount),
        ...(description !== undefined && { description }),
      };
      const fund = await emergencyFundService.deposit(userId, input);
      return res.status(200).json(fund);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async withdraw(req: Request, res: Response) {
    const userId = req.auth!.userId;
    const { amount, description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'El monto es requerido' });
    }

    try {
      const input: MovementInput = {
        amount: String(amount),
        ...(description !== undefined && { description }),
      };
      const fund = await emergencyFundService.withdraw(userId, input);
      return res.status(200).json(fund);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async listMovements(req: Request, res: Response) {
    const userId = req.auth!.userId;
    try {
      const movements = await emergencyFundService.listMovements(userId);
      return res.status(200).json(movements);
    } catch (err) {
      return handleError(err, res);
    }
  },
};