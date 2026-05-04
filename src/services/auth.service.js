const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const config = require('../config');

const SAFE_USER_FIELDS = 'id, email, role, created_at';

const register = async (req, res) => {
    console.log('>>> register hit, body:', req.body); 
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({ user });
    } catch (error) {
        console.error('>>> register error:', error.message); 
        res.status(400).json({ error: error.message });
    }
};

const login = async (email, password) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );
    const user = result.rows[0];

    const INVALID_MSG = 'Credenciales inválidas';

    if (!user) {
        await bcrypt.compare(password, '$2a$12$dummyhashparaevitartimingattack00000000000000000000000');
        throw new Error(INVALID_MSG);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error(INVALID_MSG);

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = { register, login };