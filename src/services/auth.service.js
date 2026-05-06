const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const config = require('../config');

const SAFE_USER_FIELDS = 'id, email, role, created_at';

const register = async (email, password) => {
    if (!password || password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
        throw new Error('No se pudo completar el registro');
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    const result = await pool.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         RETURNING ${SAFE_USER_FIELDS}`,
        [email, hashedPassword]
    );
    return result.rows[0];
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