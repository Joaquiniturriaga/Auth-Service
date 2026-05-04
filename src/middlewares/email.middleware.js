const validateEmail = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (!password || !password.trim()) {
        return res.status(400).json({ error: 'Password requerido' });
    }

    next();
};

module.exports = { validateEmail };