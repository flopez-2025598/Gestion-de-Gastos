import type { Request, Response } from 'express';
import { usersService } from './users.service.js';

export const usersController = {
  async getMe(req: Request, res: Response) {
    if (!req.auth) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    try {
      const profile = await usersService.getProfile(req.auth.userId);
      return res.status(200).json(profile);
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateMe(req: Request, res: Response) {
    if (!req.auth) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { fullName } = req.body;

    try {
      const profile = await usersService.updateProfile(req.auth.userId, { fullName });
      return res.status(200).json(profile);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const users = await usersService.listAll();
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const profile = await usersService.getById(id);
      return res.status(200).json(profile);
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateRole(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (role !== 'ADMIN' && role !== 'USER') {
      return res.status(400).json({ error: 'Rol inválido. Debe ser ADMIN o USER' });
    }

    try {
      const profile = await usersService.updateRole(id, { role });
      return res.status(200).json(profile);
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};