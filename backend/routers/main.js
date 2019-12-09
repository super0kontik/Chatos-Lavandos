const router = require('express').Router();
const {roomContent} = require('../controllers/http/messages');
const {addToBlacklist, removeFromBlacklist, getBlacklist} = require('../controllers/http/user');
const {checkJWT} = require('../controllers/http/auth');

router.use(checkJWT);

router.get('/roomContent/:id', roomContent);

router.get('/blacklist', getBlacklist);

router.post('/blacklist', addToBlacklist);

router.delete('/blacklist', removeFromBlacklist);

module.exports = router;