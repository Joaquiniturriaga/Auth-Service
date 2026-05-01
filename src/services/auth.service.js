const jwt = require('jsonwebtoken');

const users = [];

const register = (email, password) => {
    const newUser = {
        id: users.length + 1,
        email,
        password,
        role: 'user'
    };
    users.push(newUser);
    return newUser;
};

const login = (email, password) => {
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = { register, login };