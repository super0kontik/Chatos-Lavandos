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
        // socket.join('common');
        try {
            let user = await User.findById(socket.decoded_token.id);
            await user.updateOne({socketId:socket.id,isOnline:true});
            user.isOnline = true;
            user.socketId = socket.id;
            const usersOnline = await User.find({isOnline: true});
            const rooms = await Room.find({users:{$in:[user._id]}}).populate([{path:'users'},{path:'creator'}]);
            rooms.push({
                _id: 'common',
                title: 'Common',
                users: usersOnline
            });
            const roomIds = rooms.map(i=> i._id)
            socket.join(roomIds);
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
                const creator = await User.findById(socket.decoded_token.id);
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
                if(params.roomTitle.trim().toLowerCase() === 'common'|| params.roomTitle.trim().length < 3){
                    throw new Error('invalid name')
                }
                const participants = Array.from(new Set(params.participants));
                console.log(participants);
                if(participants.length<2){
                    throw new Error('not enough participants')
                }
                let room = await Room.create({title:params.roomTitle, users:participants, creator:socket.decoded_token.id});
                room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                for (let user of room.users){
                    io.to(user.socketId).emit('invitation', room);
                }
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });


        socket.on('joinRoom', async params=>{
            try {
                console.log('joimRoooooom',params);
                let room = await Room.findById(params.roomId);
                if(room && room.users.indexOf(socket.decoded_token.id)!==-1) {
                    room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                    socket.join(params.roomId);
                    return io.to(socket.id).emit('newRoom', room);
                }
                throw new Error('Not allowed');
            }catch (e){
                console.log(e)
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });


        socket.on('disconnect', async () => {
            try {
                const id = socket.decoded_token.id;
                await User.updateOne({_id:id},{isOnline:false});
                io.emit('userDisconnected',id);
            } catch(e){
                console.log(e);
            }
        });
    });
};
