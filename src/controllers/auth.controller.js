const authService = require('../services/auth.service');

const register = (req, res) =>{
    try{
        const { email, password} = req.body;
        const user = authService.register(email, password);
        res.status(201).json({user});
    }catch(error){
        res.status(400).json({error: error.message});

    }
};

const login = (req, res) => {
    try {
        const {email, password} = req.body;
        const token = authService.login(email, password);
        res.json({token});
    }catch(error){
        res.status(401).json({error : error.message});
    }
};


module.exports = {register, login};