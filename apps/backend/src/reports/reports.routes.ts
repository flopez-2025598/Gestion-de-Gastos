import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const reportsRoutes: Router = Router();

reportsRoutes.use(requireAuth);

reportsRoutes.get('/expenses', reportsController.getExpensesByCategory);
reportsRoutes.get('/income-vs-expenses', reportsController.getIncomeVsExpenses);
