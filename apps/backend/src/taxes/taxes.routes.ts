import { Router } from 'express';
import { taxesController } from './taxes.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const taxesRoutes: Router = Router();

taxesRoutes.use(requireAuth);

taxesRoutes.get('/iva', taxesController.getIva);
taxesRoutes.get('/parameters', taxesController.listParameters);
taxesRoutes.get('/parameters/current', taxesController.getCurrentParameters);
taxesRoutes.post('/parameters', taxesController.createParameter);