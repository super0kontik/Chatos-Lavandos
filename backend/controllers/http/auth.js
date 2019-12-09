const passport = require('passport');
require('../../passport/google-strat');
require('../../passport/github-strat');
const jwt = require('jsonwebtoken');
const {API_URL, SECRET_WORD} = require('../../config/config');

module.exports.googleSignIn = passport.authenticate(
    'google',
    {
        scope: ['profile']
    });

module.exports.githubSignIn = passport.authenticate(
    'github',
    {
        scope: ['profile']
    });

module.exports.callback = (req,res) => {
    const url = `${API_URL}/auth?token=${req.user.token}&id=${req.user.id}&name=${req.user.name}&isPremium=true&colorTheme=${req.user.colorTheme}&avatar=${req.user.avatar}`;
    res.redirect(url)
};

module.exports.checkJWT = (req,res, next)=> {
    let token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    token = token.slice(7, token.length);
    jwt.verify(token, SECRET_WORD, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send(err);
        }
        req.decoded = decoded;
        return next();
    });
};