const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {googleCallbackURL, googleClientID, googleClientSecret, SECRET_WORD} = require('../config/config');
const User = require('../models/user');
//console.log('cb: ',googleCallbackURL);
passport.use(
    'google',
    new GoogleStrategy({
        callbackURL: googleCallbackURL,
        clientID: googleClientID,
        clientSecret: googleClientSecret,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({id: profile.id});
            if(user && user.avatar !== profile._json.picture){
                await user.update({avatar: profile._json.picture})
            }
            if (!user) {
                user = await User.create({id: profile.id, name: profile.displayName, avatar: profile._json.picture});
            }
            const token = jwt.sign({id: user._id, name: user.name},SECRET_WORD);
            return done(null, {
                id: user._id,
                name: user.name,
                isPremium: user.isPremium,
                token: token,
                blacklist: user.blacklist,
                colorTheme: user.colorTheme,
                avatar: profile._json.picture
            });
        }catch (e){
            throw new Error(e.message)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
