const passport = require('passport');
const jwt = require('jsonwebtoken');
const GitHubStrategy = require('passport-github2').Strategy;
const {githubCallbackURL, githubClientID, githubClientSecret, SECRET_WORD} = require('../config/config');
const User = require('../models/user');
const Room = require('../models/room');

passport.use('github',new GitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({id: profile.id});
            if(user && user.avatar !== profile._json.picture){
                await user.update({avatar: profile._json.picture})
            }
            if (!user) {
                user = await User.create({id: profile.id, name: profile.username, avatar: profile._json.avatar_url});
                await Room.create({
                    title:'Favorites',
                    creator: user._id,
                    users:[String(user._id)],
                    isFavorites: true,
                    isPublic: false,
                    lastAction:Date.now()
                })
            }
            const token = jwt.sign({id: user._id, name: user.name},SECRET_WORD);
            return done(null, {
                id: user._id,
                name: user.name,
                isPremium: user.isPremium,
                token: token,
                blacklist: user.blacklist,
                colorTheme: user.colorTheme,
                avatar: profile._json.avatar_url
            });
        }catch (e){
            throw new Error(e.message)
        }
    }
));
