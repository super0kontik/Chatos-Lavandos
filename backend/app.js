const express = require('express');
const bp = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
const passport = require('passport');
require('./passport/google-strat');

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(cors());
app.use(passport.initialize());

app.get('/', (req,res)=>{
    res.send('hello')
});

app.get(
    '/auth',
    passport.authenticate('google', {
        scope: ['profile']
    })
);

app.get(
    '/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
        res.send(req.user)
    }
);

module.exports= app;