import type { Request, Response } from 'express';
import { reportsService } from './reports.service.js';

function handleError(err: unknown, res: Response) {
  if (err instanceof Error) {
    if (err.message === 'INVALID_DATE') {
      return res.status(400).json({ error: 'La fecha ingresada no es válida' });
    }
    if (err.message === 'INVALID_PERIOD') {
      return res.status(400).json({ error: 'La fecha "from" no puede ser posterior a "to"' });
    }
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

export const reportsController = {
  async getExpensesByCategory(req: Request, res: Response) {
    const userId = req.auth!.userId;
    const { from, to } = req.query;

    try {
      const result = await reportsService.getExpensesByCategory(
        userId,
        typeof from === 'string' ? from : undefined,
        typeof to === 'string' ? to : undefined,
      );
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async getIncomeVsExpenses(req: Request, res: Response) {
    const userId = req.auth!.userId;
    const { from, to } = req.query;

    try {
      const result = await reportsService.getIncomeVsExpenses(
        userId,
        typeof from === 'string' ? from : undefined,
        typeof to === 'string' ? to : undefined,
      );
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res);
    }
  },
};
