import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const dashboardRoutes: Router = Router();

dashboardRoutes.use(requireAuth);
dashboardRoutes.get('/', dashboardController.getSummary);
