import 'dotenv/config';
import express from 'express';
import { authRoutes } from './auth/auth.routes.js';
import { usersRoutes } from './users/users.routes.js';
import { incomeRoutes } from './income/income.routes.js';
import { expensesRoutes } from './expenses/expenses.routes.js';
import { taxesRoutes } from './taxes/taxes.routes.js';
import { emergencyFundRoutes } from './emergency-fund/emergency-fund.routes.js';
import { dashboardRoutes } from './dashboard/dashboard.routes.js';
import { reportsRoutes } from './reports/reports.routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Finova Finance backend esta corriendo' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/income', incomeRoutes);
app.use('/expenses', expensesRoutes);
app.use('/taxes', taxesRoutes);
app.use('/emergency-fund', emergencyFundRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportsRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});