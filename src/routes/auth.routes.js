const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validateEmail } = require('../middlewares');
const { forgotPasswordHandler, resetPasswordHandler } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validateEmail, register);
router.post('/login', validateEmail, login);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);


module.exports = router;