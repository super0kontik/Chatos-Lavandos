const passport = require('passport');
const jwt = require('jsonwebtoken');
const GitHubStrategy = require('passport-github2').Strategy;
const {githubCallbackURL, githubClientID, githubClientSecret, SECRET_WORD} = require('../config/config');
const User = require('../models/user');

passport.use('github',new GitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({id: profile.id});
            if (!user) {
                user = await User.create({id: profile.id, name: profile.username, avatar: profile._json.avatar_url});
            }
            const token = jwt.sign({id: user._id, name: user.name},SECRET_WORD);
            return done(null, {
                id: user._id,
                name: user.name,
                isPremium: user.isPremium,
                token: token,
                blacklist: user.blacklist,
                colorTheme: user.colorTheme,
                avatar: user.avatar
            });
        }catch (e){
            throw new Error(e.message)
        }
    }
));
