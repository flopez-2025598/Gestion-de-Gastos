import { Router } from 'express';
import { emergencyFundController } from './emergency-fund.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const emergencyFundRoutes: Router = Router();

emergencyFundRoutes.use(requireAuth);

emergencyFundRoutes.get('/', emergencyFundController.getFund);
emergencyFundRoutes.post('/deposit', emergencyFundController.deposit);
emergencyFundRoutes.post('/withdraw', emergencyFundController.withdraw);
emergencyFundRoutes.get('/movements', emergencyFundController.listMovements);