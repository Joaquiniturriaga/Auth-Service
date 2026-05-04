require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(helmet());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs : 15 *60 +1000,
    max : 10,
    message: {error: 'Muchos intentos... Intenta mas tarde'},
    standardHeaders: true,
    legacyHeaders: false
})

app.use('/api/auth', authLimiter ,authRoutes);

app.get((err, req, res, next) =>{
    res.json({status: 'Auth service running'});

});



app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});