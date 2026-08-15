import type { Request, Response } from 'express';
import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  async getSummary(req: Request, res: Response) {
    const userId = req.auth!.userId;

    try {
      const summary = await dashboardService.getSummary(userId);
      return res.status(200).json(summary);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
