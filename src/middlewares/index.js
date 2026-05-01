module.exports = {
    ...require('./auth.middleware'),
    ...require('./email.middleware'),
    ...require('./roles.middleware')
};