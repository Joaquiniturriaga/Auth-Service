require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos, espera 15 minutos' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/auth', authLimiter, authRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'Auth service running' });
});

module.exports = app;