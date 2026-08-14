import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Finova Finance backend esta corriendo' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});