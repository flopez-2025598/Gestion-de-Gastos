import 'dotenv/config';
import express from 'express';
import { authRoutes } from './auth/auth.routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Finova Finance backend esta corriendo' });
});

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});