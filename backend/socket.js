const socketIO = require('socket.io');
const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const sjwt = require('socketio-jwt');
const {SECRET_WORD} = require('./config/config');

module.exports = (server) => {
    const io = socketIO(server);

    io.use(sjwt.authorize({
        secret: SECRET_WORD,
        handshake: true
    }));

    io.on('connection', async socket => {
        const sockets = Object.keys(io.sockets.sockets);
        socket.join('common');
        try {
            const user = await User.findOne({id: socket.decoded_token.id});
            await user.updateOne({socketId:socket.id,isOnline:true});
            const usersOnline = await User.find({isOnline: true});
            const rooms = await Room.find({$where : `this.users.indexOf("${user.id}") != -1`});
            io.to(socket.id).emit('join',
                {
                    message: `welcome, ${socket.decoded_token.name}`,
                    usersOnline,
                    rooms
                });
            io.emit('userJoined',{user})
        }catch (e){
            console.log(e.message)
        }

        socket.on('createMessage', params=>{
            console.log(params);
            io.to(params.room).emit('newMessage', {message:params.message,room:params.room})
        })

    });

};
