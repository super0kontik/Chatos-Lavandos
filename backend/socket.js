const socketIO = require('socket.io');
const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const sjwt = require('socketio-jwt');
const {SECRET_WORD} = require('./config/config');

module.exports = (server) => {
    const io = socketIO(server);

    // io.use(sjwt.authorize({
    //     secret: SECRET_WORD,
    //     handshake: true
    // }));

    io.on('connection', socket => {
        const sockets = Object.keys(io.sockets.sockets);
        console.log(sockets);
        socket.join('common');
        // io.use(sjwt.authorize({
        //     secret: SECRET_WORD,
        //     handshake: true
        // }));
        io.to(socket.id).emit('join', {message: `welcome, world `});

        socket.on('createMessage', params=>{
            console.log(params)
            io.to('params.room').emit('newMessage', {message:params.message,room:'common'})
        })

    });

};
