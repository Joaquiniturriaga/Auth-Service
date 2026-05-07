require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json()); // PRIMERO el parser

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: { error: 'Demasiados intentos, espera 15 minutos' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    }
});

app.use('/api/auth', authLimiter, (req, res, next) => {
    console.log('body en ruta:', req.body);
    next();
}, authRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'Auth service running' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});