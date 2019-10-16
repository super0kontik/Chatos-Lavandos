const socketIO = require('socket.io');
const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const sjwt = require('socketio-jwt');
const {SECRET_WORD, MESSAGE_KEY} = require('./config/config');
const crypto = require('crypto-js');

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
            let user = await User.findOne({id: socket.decoded_token.id});
            await user.updateOne({socketId:socket.id,isOnline:true});
            user.isOnline = true;
            user.socketId = socket.id;
            const usersOnline = await User.find({isOnline: true});
            const rooms = await Room.find({$where : `this.users.indexOf("${user.id}") != -1`}).populate('users');
            rooms.push({
                _id: 'common',
                title: 'Common',
                users: usersOnline
            });
            socket.join(rooms);
            io.to(socket.id).emit('join',
                {
                    message: `welcome, ${socket.decoded_token.name}`,
                    usersOnline,
                    rooms
                });
            io.emit('userJoined',user);
        }catch (e){
            console.log(e.message);
            io.to(socket.id).emit('error',{error:e.message});
        }


        socket.on('createMessage', async  params=>{
            try {
                const createdAt = Date.now();
                const creator = await User.findOne({id :socket.decoded_token.id});
                if (params.room !== 'common') {
                    const content = crypto.AES.encrypt(params.message, MESSAGE_KEY).toString();
                    const message = await Message.create({createdAt, creator, room: params.room, content})
                }
                io.to(params.room).emit('newMessage', {message:{content: params.message, createdAt, creator}, room: params.room })
            }catch(e){
                console.log(e.message);
                io.to(socket.id).emit('error',{error:e.message});
            }
        });


        socket.on('createRoom', async params=>{
            console.log(params);
            try{
                if(params.roomTitle.trim().toLowerCase() === 'common'|| params.roomTitle.trim().length <= 3){
                    throw new Error('invalid name')
                }
                if(!Array.isArray(params.participants) || params.participants.length<2){
                    throw new Error('not enough participants')
                }
                const room = await Room.create({title:params.roomTitle, users:params.participants});
                for (user of params.participants){
                    io.to(user.socketId).emit('invitation',{roomId:room._id})
                }
            }catch (e){
                io.to(socket.id).emit('error',{error:e.message});
            }
        });


        socket.on('join', async params=>{
            try {
                const room = await Room.findById(params.roomId).populate('users');
                if(room.users.indexOf(socket.decoded_token.id)!==-1) {
                    socket.join(params.roomId);
                    return io.to(socket.id).emit('newRoom',{room:room})
                }
                throw new Error('Not allowed');
            }catch (e){
                io.to(socket.id).emit('error',{error:e.message});
            }
        });


        socket.on('disconnect', async () => {
            try {
                const id = socket.decoded_token.id;
                await User.updateOne({id:id},{isOnline:false});
                io.emit('userDisconnected',id);
            } catch(e){
                console.log(e);
            }
        });
    });
};