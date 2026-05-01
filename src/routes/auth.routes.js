const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validateEmail } = require('../middlewares');

const router = express.Router();

router.post('/register', validateEmail, register);
router.post('/login', validateEmail, login);

module.exports = router;