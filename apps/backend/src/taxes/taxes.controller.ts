import type { Request, Response } from 'express';
import { taxesService } from './taxes.service.js';
import type { CreateTaxParameterInput } from './taxes.types.js';

function handleError(err: unknown, res: Response) {
  if (err instanceof Error) {
    if (err.message === 'IVA_NOT_CONFIGURED') {
      return res.status(404).json({ error: 'IVA no está configurado en el sistema' });
    }
    if (err.message === 'INVALID_DATE') {
      return res.status(400).json({ error: 'Fecha inválida' });
    }
    if (err.message === 'INVALID_DATE_ORDER') {
      return res.status(400).json({ error: 'La fecha no puede ser anterior al registro vigente actual' });
    }
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

export const taxesController = {
  async getIva(req: Request, res: Response) {
    try {
      const iva = await taxesService.getIva();
      return res.status(200).json(iva);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async listParameters(req: Request, res: Response) {
    const userId = req.auth!.userId;
    try {
      const params = await taxesService.listParameters(userId);
      return res.status(200).json(params);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async getCurrentParameters(req: Request, res: Response) {
    const userId = req.auth!.userId;
    try {
      const params = await taxesService.getCurrentParameters(userId);
      return res.status(200).json(params);
    } catch (err) {
      return handleError(err, res);
    }
  },

  async createParameter(req: Request, res: Response) {
    const userId = req.auth!.userId;
    const { taxType, rate, validFrom } = req.body;

    if (!taxType || !rate || !validFrom) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (taxType !== 'ISR' && taxType !== 'IGSS') {
      return res.status(400).json({ error: 'taxType debe ser ISR o IGSS' });
    }

    try {
      const input: CreateTaxParameterInput = {
        taxType,
        rate: String(rate),
        validFrom,
      };
      const param = await taxesService.createParameter(userId, input);
      return res.status(201).json(param);
    } catch (err) {
      return handleError(err, res);
    }
  },
};