const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {callbackURL,clientID,clientSecret, SECRET_WORD} = require('../config/config');
const User = require('../models/user');

passport.use(
    'google',
    new GoogleStrategy({callbackURL,clientID,clientSecret}, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({id: profile.id});
            if (!user) {
                user = await User.create({id: profile.id, name: profile.displayName});

            }
            const token = jwt.sign({id: user.id, name: user.name},SECRET_WORD);
            return done(null, {id: user.id, name: user.name, isPremium: user.isPremium, token});
        }catch (e){
            throw new Error(e.message)
        }
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
