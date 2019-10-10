const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const conf = require('./config/config');
const socketIO = require('socket.io');

const server = http.createServer(app,{
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

const io = socketIO(server);

io.on('connection', socket => {
        socket.on('joinCommon', params =>{
            if(params.token === 'js'){
                socket.to(socket.id).emit('join',{message:"welcome, js fan"})
            }
        })
});

mongoose.connect(conf.MONGO_URL, {useNewUrlParser: true})
    .then(()=>{
        console.log('connection established');
        server.listen(conf.PORT);
    })
.catch((e)=>console.log(e));

