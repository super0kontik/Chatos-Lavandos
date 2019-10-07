const express = require('express');
const bp = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(cors());

app.get('/', (req,res)=>{
    res.send('hello')
});

module.exports= app;