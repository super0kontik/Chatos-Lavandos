module.exports = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/chat',
    API_URL: process.env.API_URL || 'http://localhost:4200',
    googleCallbackURL: process.env.googleCallbackURL || "http://localhost:8080/auth/google/callback",
    googleClientID: process.env.googleClientID || '138347420904-b72oif3jnot616rmd8higgulsol512t7.apps.googleusercontent.com',
    googleClientSecret: process.env.googleClientSecret || 'x352IT8kwFnYGUEPJapldCuY',
    SECRET_WORD: process.env.SECRET_WORD || 'keyboard',
    MESSAGE_KEY: process.env.MESSAGE_KEY || 'hello world',
    githubCallbackURL: process.env.githubCallbackURL || 'http://localhost:8080/auth/github/callback',
    githubClientID: process.env.githubClientID  || '93ca4ffaea0bde0b8a63',
    githubClientSecret: process.env.githubClientSecret || '08d9d35c6e9c725008e61b10be10c1514655b448'
};