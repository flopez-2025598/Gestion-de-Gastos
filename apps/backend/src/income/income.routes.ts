import { Router } from 'express';
import { incomeController } from './income.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const incomeRoutes: Router = Router();

incomeRoutes.use(requireAuth);

incomeRoutes.get('/sources', incomeController.listSources);
incomeRoutes.post('/sources', incomeController.createSource);

incomeRoutes.get('/', incomeController.list);
incomeRoutes.post('/', incomeController.create);
incomeRoutes.get('/:id', incomeController.getOne);
incomeRoutes.patch('/:id', incomeController.update);
incomeRoutes.delete('/:id', incomeController.remove);