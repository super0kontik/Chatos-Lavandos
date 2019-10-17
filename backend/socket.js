const socketIO = require('socket.io');
const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const sjwt = require('socketio-jwt');
const {SECRET_WORD, MESSAGE_KEY} = require('./config/config');
const crypto = require('crypto-js');
const validator = require('validator');

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
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }


        socket.on('createMessage', async  params=>{
            try {
                const createdAt = Date.now();
                const creator = await User.findOne({id :socket.decoded_token.id});
                if(params.message.trim().length<1){
                    throw new Error('invalid message')
                }
                if (params.room !== 'common') {
                    const content = crypto.AES.encrypt(validator.escape(params.message), MESSAGE_KEY).toString();
                    const message = await Message.create({createdAt, creator, room: params.room, content})
                }
                io.to(params.room).emit('newMessage', {message:{content: params.message, createdAt, creator}, room: params.room })
            }catch(e){
                console.log(e.message);
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });


        socket.on('createRoom', async params=>{
            console.log(params);
            try{
                console.log('here')
                if(params.roomTitle.trim().toLowerCase() === 'common'|| params.roomTitle.trim().length < 3){
                    throw new Error('invalid name')
                }
                const participants = Array.from(new Set(params.participants));
                console.log(participants);
                if(participants.length<2){
                    throw new Error('not enough participants')
                }
                console.log('here2')
                let room = await Room.create({title:params.roomTitle, users:participants});
                room = await room.populate('users').execPopulate();
                console.log('initiator: ',socket.id)
                for (let user of room.users){
                    console.log(user.socketId)
                    io.to(user.socketId).emit('invitation',room);
                }
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error',{error:{type: e.message}});
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
                io.to(socket.id).emit('error',{error:{type: e.message}});
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
