const express = require('express');
const bp = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
const passport = require('passport');
require('./passport/google-strat');
const {API_URL} = require('./config/config');
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
        res.redirect(`${API_URL}/auth?token=js&id=${req.user.id}&name=${req.user.name}`)
    }
);

app.get('/mock/user',(req,res)=>res.send({id:'8805553535', name: 'Alex_Shavik', isOnline:true, isPremium:true}))

app.get('/mock/rooms',
    (req,res) => {
    return res.json([
        {
            id: 'roomId2',
            title: 'Xyeta',
            users: [
                {id: '8805553535', name: 'Alex_Shavik', isOnline: true, isPremium: true},
                {id: 'ebala', name: 'Lexa_Lepexa', isOnline: false, isPremium: false},
                {id: '131313', name: 'Pahan_Kontugan', isOnline: false, isPremium: false}
            ]
        },
        {
            id: 'roomId1',
            title: 'Common',
            users: [
                {id: '8805553535', name: 'Alex_Shavik', isOnline: true, isPremium: true},
                {id: '131313', name: 'Pahan_Kontugan', isOnline: false, isPremium: false}
            ]
        }]
    )
});

app.get('/mock/roomContent/:id',(req,res)=>{
    if(req.params.id === 'roomId1'){
        return res.json([{
            createdAt:Date.now(),
            creator: '8805553535',
            content: 'I love angular'
        }, {
            createdAt:Date.now(),
            creator: '131313',
            content: 'I love node js, python'
        }])
    }else if(req.params.id === 'roomId2'){
        return res.json([{
            createdAt:Date.now(),
            creator: '8805553535',
            content: 'Lutche pozvonit chem u kogoto zanimat'
        },{
            createdAt:Date.now(),
            creator: '131313',
            content: 'I love node js, python'
        },{
            createdAt:Date.now(),
            creator: 'ebala',
            content: 'I`m Lexa lepexa'
        },{
            createdAt:Date.now(),
            creator: 'ebala',
            content: 'Hello, bitches!'
        },{
            createdAt:Date.now(),
            creator: '8805553535',
            content: 'I love angular'
        },{
            createdAt:Date.now(),
            creator: 'ebala',
            content: 'Mne pohuy'
        },{
            createdAt:Date.now(),
            creator: '8805553535',
            content: 'Are you ahuel ?'
        },{
            createdAt:Date.now(),
            creator: 'ebala',
            content: 'Ta sasi jopu'
        },{
            createdAt:Date.now(),
            creator: '131313',
            content: 'Asol!!)))'
        }
        ])
    }
});

module.exports= app;
