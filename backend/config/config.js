module.exports = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/chat',
    API_URL: process.env.API_URL || 'http://localhost:4200',
    callbackURL: process.env.callbackURL || "http://localhost:8080/auth/callback",
    clientID: process.env.clientID || '138347420904-b72oif3jnot616rmd8higgulsol512t7.apps.googleusercontent.com',
    clientSecret: process.env.clientSecret || 'x352IT8kwFnYGUEPJapldCuY',
    SECRET_WORD: process.env.SECRET_WORD || 'keyboard',
    MESSAGE_KEY: process.env.MESSAGE_KEY || 'hello world'
};