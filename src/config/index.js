module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    bcryptRounds: 12,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    FRONTEND_URL: process.env.FRONTEND_URL,

};