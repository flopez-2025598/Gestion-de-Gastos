import { Router } from 'express';
import { usersController } from './users.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

export const usersRoutes: Router = Router();

usersRoutes.get('/me', requireAuth, usersController.getMe);
usersRoutes.patch('/me', requireAuth, usersController.updateMe);

usersRoutes.get('/', requireAuth, requireRole('ADMIN'), usersController.list);
usersRoutes.get('/:id', requireAuth, requireRole('ADMIN'), usersController.getById);
usersRoutes.patch('/:id/role', requireAuth, requireRole('ADMIN'), usersController.updateRole);