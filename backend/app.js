const express = require('express');
const bp = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
const passport = require('passport');
const Message = require('./models/message');
const Room = require('./models/room');
require('./passport/google-strat');
const {API_URL,MESSAGE_KEY, SECRET_WORD} = require('./config/config');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const fingerprint = require('express-fingerprint');

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(cors());
app.use(fingerprint({
    parameters:[
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip]}));

app.use(passport.initialize());
app.disable('x-powered-by');

app.get(
    '/auth',
    passport.authenticate('google', {
        scope: ['profile']
    })
);

app.get(
    '/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
        res.redirect(`${API_URL}/auth?token=${req.user.token}&id=${req.user.id}&name=${req.user.name}&isPremium=true`)
    }
);

app.use((req,res, next)=>{
    let token = req.header('Authorization');
    if(!token){
        return res.status(401).send('Unauthorized');
    }
    token = token.slice(7,token.length);
    jwt.verify(token, SECRET_WORD, (err, decoded)=>{
        if(err) {
            console.log(err);
            return res.status(401).send(err);
        }
        req.decoded = decoded;
        return next();
    });
});

app.get('/roomContent/:id',async (req,res)=>{
    try {
        console.log(+req.query.offset, +req.query.limit);
        if(req.params.id.trim().length <2 || req.query.offset === undefined || +req.query.offset < 0 || req.query.limit === undefined || +req.query.limit < 0){
            throw new Error('invalid data')
        }
        const room = await Room.findOne({_id:req.params.id, users:req.decoded.id});
        if(!room){
            throw new Error('Not Allowed')
        }
        const messages = await Message.find({room: req.params.id}).skip(+req.query.offset).limit(+req.query.limit).sort('-createdAt').populate('creator');
        if(messages) {
            const messagesDecrypted = messages.reverse().map(i => {
                const bytes = crypto.AES.decrypt(i.content.toString(), MESSAGE_KEY);
                i.content = bytes.toString(crypto.enc.Utf8);
                return i;
            });
            return res.send(messagesDecrypted)
        }
        throw new Error('Not Found')
    }catch(e){
        console.log(e);
        res.status(500).send('error')
    }
});

module.exports= app;
