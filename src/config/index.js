module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    bcryptRounds: 12,
    EMAIL_FROM: process.env.EMAIL_FROM,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    
};