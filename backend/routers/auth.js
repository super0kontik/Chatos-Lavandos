const router = require('express').Router();
const {googleSignIn, callback,  githubSignIn,} = require('../controllers/http/auth');
const passport = require('passport');

router.get('/google', googleSignIn);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    callback);

router.get('/github', githubSignIn);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    callback);

module.exports = router;