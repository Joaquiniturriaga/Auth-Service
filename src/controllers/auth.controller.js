const authService = require('../services/auth.service');

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


module.exports = {register, login};