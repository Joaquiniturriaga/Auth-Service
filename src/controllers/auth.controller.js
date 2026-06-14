const authService = require('../services/auth.service');
const { forgotPassword, resetPassword } = require('../services/auth.service');

const register = async (req, res) => {
    console.log('controller body:', req.body);
    try {
        const { email, password } = req.body;
        console.log('email:', email, 'password:', password);
        const user = await authService.register(email, password);
        console.log('user created:', user);
        res.status(201).json({ user });
    } catch (error) {
        console.error('controller error:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const token = await   authService.login(email, password);
        res.json({token});
    }catch(error){
        res.status(401).json({error : error.message});
    }
};

const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    await forgotPassword(email);

    res.json({ message: 'Si el email existe, recibirás un enlace en tu bandeja.' });
  } catch (err) {
    next(err);
  }
};

const resetPasswordHandler = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });

    if (newPassword.length < 8)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });

    await resetPassword(token, newPassword);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};


module.exports = {register, login, forgotPasswordHandler, resetPasswordHandler};