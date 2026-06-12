const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const config = require('../config');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./email.service');

const SAFE_USER_FIELDS = 'id, email, role, brigade_id, created_at';

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
    
    console.log('USER FROM DB:', JSON.stringify(user));


    const INVALID_MSG = 'Credenciales inválidas';

    if (!user) {
        await bcrypt.compare(password, '$2a$12$dummyhashparaevitartimingattack00000000000000000000000');
        throw new Error(INVALID_MSG);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error(INVALID_MSG);

 const raw = jwt.sign(
    { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        brigade_id: user.brigade_id !== undefined && user.brigade_id !== null ? user.brigade_id : null
    },
    config.jwtSecret,
    { expiresIn: '1h' }
);
console.log('JWT PAYLOAD:', { id: user.id, email: user.email, role: user.role, brigade_id: user.brigade_id });

    return `AUTH-${raw}`;
};

const forgotPassword = async (email) => {
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  // Silencioso: no revela si el email existe o no
  if (!result.rows[0]) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
    [token, expires, email]
  );

  await sendPasswordResetEmail(email, token);
};

const resetPassword = async (token, newPassword) => {
  const result = await pool.query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );

  if (!result.rows[0]) {
    const err = new Error('Token inválido o expirado');
    err.status = 400;
    throw err;
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.query(
    `UPDATE users
     SET password = $1, reset_token = NULL, reset_token_expires = NULL
     WHERE id = $2`,
    [hashedPassword, result.rows[0].id]
  );
};


module.exports = { register, login, forgotPassword, resetPassword };