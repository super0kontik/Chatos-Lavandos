import {messages} from "../client/src/app/main/room/room.component";

const socketIO = require('socket.io');
const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
    const io = socketIO(server);

    io.on('connection', socket => {
        console.log('connected');
        socket.join('common');
            if (socket.handshake.headers.Authorization === 'Bearer js') {
                console.log('passed');
                io.to('common').emit('join', {message: "welcome, js fan"})
            }else{
                console.log('forbidden')
            }

            io.on('createMessage', params=>{
                io.to(params.room).emit('newMessage', {message:params.message})
        })

    });

};