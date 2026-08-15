import 'dotenv/config';
import express from 'express';
import { authRoutes } from './auth/auth.routes.js';
import { usersRoutes } from './users/users.routes.js';
import { incomeRoutes } from './income/income.routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Finova Finance backend esta corriendo' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/income', incomeRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});