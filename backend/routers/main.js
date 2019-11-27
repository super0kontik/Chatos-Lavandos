const router = require('express').Router();
const {signIn, callback, checkJWT} = require('../controllers/http/auth');
const {roomContent} = require('../controllers/http/messages');
const {addToBlacklist, removeFromBlacklist} = require('../controllers/http/user');
const passport = require('passport');

router.get('/auth', signIn);

router.get(
    '/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    callback);

router.use(checkJWT);

router.get('/roomContent/:id', roomContent);

router.post('/blacklist', addToBlacklist);

router.delete('/blacklist', removeFromBlacklist);

module.exports = router;