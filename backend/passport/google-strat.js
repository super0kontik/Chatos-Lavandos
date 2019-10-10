const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {callbackURL,clientID,clientSecret} = require('../config/config');

passport.use(
    'google',
    new GoogleStrategy({callbackURL,clientID,clientSecret}, (accessToken, refreshToken, profile, done) => {
        return done(null, {id:profile.id, name:profile.displayName});
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});