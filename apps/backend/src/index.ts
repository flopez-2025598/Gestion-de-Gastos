import 'dotenv/config';
import express from 'express';
import { authRoutes } from './auth/auth.routes.js';
import { usersRoutes } from './users/users.routes.js';
import { incomeRoutes } from './income/income.routes.js';
import { expensesRoutes } from './expenses/expenses.routes.js';
import { taxesRoutes } from './taxes/taxes.routes.js';
import { emergencyFundRoutes } from './emergency-fund/emergency-fund.routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Finova Finance backend esta corriendo' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/income', incomeRoutes);
app.use('/expenses', expensesRoutes);
app.use('/taxes', taxesRoutes);
app.use('/emergency-fund', emergencyFundRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});