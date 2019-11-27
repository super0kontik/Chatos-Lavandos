const User = require('../../models/user');
const Room = require('../../models/room');
const {getUserSocketsRoom} = require('./utils');
const crypto = require('crypto-js');
const validator = require('validator');
const Message = require('../../models/message');

module.exports = {
    acceptInvitation: async (io, socket, params) => {
        try {
            let room = await Room.findById(params.roomId);
            const user = await User.findById(socket.decoded_token.id);
            if(room && user) {
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
    },

    joinRoom: async (io, socket, params) => {
        try {
            let room = await Room.findOne({_id: params.roomId, users:{$ne:socket.decoded_token.id}, isPublic:true});
            const user = await User.findById(socket.decoded_token.id);
            if(room && user) {
                room.users.push(user);
                room.lastAction = Date.now();
                room = await room.save();
                room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
                user.socketIds.forEach(i=>{
                    const socket = io.sockets.connected[i];
                    if(socket){
                        socket.join(params.roomId)
                    }
                });
                const content = `${user.name} joined the room!`;
                const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
                await Message.create({createdAt: Date.now(), room: params.roomId, content: contentEncrypted, isSystemMessage:true,creator: user});
                io.to(getUserSocketsRoom(user)).emit('newRoom', room);
                io.to(params.roomId).emit('userJoined', {user, roomId: params.roomId});
                return io.to(params.roomId).emit('newMessage', {message:{content, createdAt:Date.now(), isSystemMessage:true,creator: user}, room: params.roomId })
            }
            throw new Error('Not allowed');
        }catch (e){
            console.log(e);
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }
    },

    leaveRoom: async (io, socket, params) => {
        try {
            const id = socket.decoded_token.id;
            const user = await User.findById(id);
            let room = await Room.findById(params.roomId);
            if (room && room.users.indexOf(id) !== -1) {
                room.users.pull(id);
                room.lastAction = Date.now();
                room = await room.save();
                io.to(params.roomId).emit('userLeft', {userId: id, roomId: params.roomId});
                user.socketIds.forEach(i=>{
                    const socket = io.sockets.connected[i];
                    if(socket){
                        socket.leave(params.roomId)
                    }
                });
                const content = `${user.name} left the room(`;
                const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
                await Message.create({createdAt: Date.now(), room: params.roomId, content: contentEncrypted, isSystemMessage:true,creator: user});
                io.to(params.roomId).emit('newMessage', {message:{content, createdAt:Date.now(), isSystemMessage:true,creator:user}, room: params.roomId });

                if(room.users.length === 1){
                    const lastUser = await room.populate('users').execPopulate();
                    io.to(getUserSocketsRoom(lastUser.users[0])).emit('userLeft', {userId: lastUser.users[0]._id, roomId: params.roomId});
                    lastUser.users[0].socketIds.forEach(socketId=>{
                        const socket = io.sockets.connected[socketId];
                        if(socket){
                            socket.leave(params.roomId)
                        }
                    });
                    await room.remove();
                }
            }else throw new Error('Not allowed');
        }catch (e) {
            console.log(e);
            io.to(socket.id).emit('error',{error: {type: e.message}});
        }
    },

    searchRoom: async (io, socket, params) => {
        try {
            const rooms = await Room.find({title: {$regex: '.*' + params + '.*', $options : 'i'}, isPublic:true});
            io.to(socket.id).emit('searchRoomsResult', rooms)
        }catch (e){
            console.log(e)
        }
    }
};