const authService = require('../services/auth.service');

const register = async (req, res) =>{
    try{
        const { email, password} = req.body;
        const user = await  authService.register(email, password);
        res.status(201).json({user});
    }catch(error){
        res.status(400).json({error: error.message});

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