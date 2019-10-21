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
            const roomIds = rooms.map(i=> i._id);
            socket.join(roomIds);
            io.to(socket.id).emit('join',
                {
                    message: `welcome, ${socket.decoded_token.name}`,
                    usersOnline,
                    rooms
                });
            io.emit('userJoined', {roomId: 'common', user});
            io.emit('userConnected', user._id);
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
            try{
                if(params.roomTitle.trim().toLowerCase() === 'common'|| params.roomTitle.trim().length < 3){
                    throw new Error('invalid name')
                }
                params.participants.push(socket.decoded_token.id);
                let participants = Array.from(new Set(params.participants));
                participants = await User.find({
                    _id:{
                        $in:participants
                    }
                });
                if(participants.length<2){
                    throw new Error('not enough participants')
                }
                let room = await Room.create({title:params.roomTitle, users:participants, creator:socket.decoded_token.id});
                room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                participants = room.users.filter(i=> String(i._id) !== socket.decoded_token.id);
                socket.join(room._id);
                for (let user of participants){
                    io.to(user.socketId).emit('invitation', room);
                }
                io.to(socket.id).emit('newRoom', room)
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });


        socket.on('acceptInvitation', async params=>{
            try {
                let room = await Room.findById(params.roomId);
                if(room) {
                    room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                    socket.join(params.roomId);
                    io.to(socket.id).emit('newRoom', room);
                    return io.to(params.roomId).emit('userJoined', {user, roomId: params.roomId});
                }
                throw new Error('Not allowed');
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });

        socket.on('joinRoom', async params =>{
            try {
                let room = await Room.findById(params.roomId);
                const user = await User.findById(socket.decoded_token.id);
                if(room && user) {
                    room.users.push(user);
                    room = await room.save();
                    room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                    socket.join(params.roomId);
                    io.to(params.roomId).emit('userJoined', {user, roomId: params.roomId});
                    return io.to(socket.id).emit('newRoom', room);
                }
                throw new Error('Not allowed');
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error',{error:{type: e.message}});
            }
        });

        socket.on('leaveRoom', async params =>{
            try {
                const id = socket.decoded_token.id;
                let room = await Room.findById(params.roomId);
                if (room && room.users.indexOf(id) !== -1) {
                    room.users.pull(id);
                    room = await room.save();
                    io.to(params.roomId).emit('userLeft', {userId: id, roomId: params.roomId});
                    socket.leave(params.roomId);
                    if(room.users.length === 1){
                        const lastUser = await room.populate('users').execPopulate();
                        io.to(lastUser.users[0].socketId).emit('userLeft', {userId: lastUser.users[0]._id, roomId: params.roomId});
                        await room.remove();
                    }
                }else throw new Error('Not allowed');
            }catch (e) {
                console.log(e);
                io.to(socket.id).emit('error',{error: {type: e.message}});
            }
        });


        socket.on('inviteUsers', async params=>{
            try{
                const room = await Room.findById(params.roomId);
                if(!room){
                    throw new Error('Room not found');
                }
                let participants = Array.from(new Set(params.participants));
                participants = await User.find({
                    _id:{
                        $in:participants
                    }
                });
                console.log(participants)
                for (user of participants){
                    room.users.push(user._id);
                    io.to(user.socketId).emit('invitation', room)
                }
                await room.save()
            }catch (e){
                console.log(e);
                io.to(socket.id).emit('error', {type: e.message })
            }
        });


        socket.on('searchUsers', async params =>{
            try {
                const users = await User.find({name: {$regex: '.*' + params + '.*', $options : 'i'}}); //.select('name');
                io.to(socket.id).emit('searchResult', users)
            }catch (e){
                console.log(e)
            }
        });


        socket.on('searchRooms', async params =>{
            try {
                const rooms = await Room.find({title: {$regex: '.*' + params + '.*', $options : 'i'}}); //.select('name');
                //console.log(rooms);
                io.to(socket.id).emit('searchRoomsResult', rooms)
            }catch (e){
                console.log(e)
            }
        });


        socket.on('disconnect', async () => {
            try {
                const id = socket.decoded_token.id;
                await User.updateOne({_id:id},{isOnline:false});
                io.emit('userDisconnected',id);
                io.emit('userLeft', {userId: id, roomId: 'common'});
            } catch(e){
                console.log(e);
            }
        });
    });
};
