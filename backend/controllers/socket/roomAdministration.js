const User = require('../../models/user');
const Room = require('../../models/room');
const Message = require('../../models/message');
const {getUserSocketsRoom} = require('./utils');
const crypto = require('crypto-js');
const validator = require('validator');
const {MESSAGE_KEY} = require('../../config/config');
module.exports = {
    createRoom: async (io, socket, params) => {
        try{
            if(params.roomTitle.trim().toLowerCase() === 'common'|| params.roomTitle.trim().length < 3 || params.roomTitle.trim().length > 20){
                throw new Error('invalid name')
            }
            params.participants.push(socket.decoded_token.id);
            let participants = Array.from(new Set(params.participants));
            participants = await User.find({
                _id:{
                    $in:participants
                },
                blacklist:{$ne:socket.decoded_token.id}
            });
            if(participants.length<2){
                throw new Error('not enough participants')
            }
            let room = await Room.create({title: validator.escape(params.roomTitle), users: participants,
                creator: socket.decoded_token.id, lastAction: Date.now(), isPublic: params.isPublic});
            room = await room.populate([{path:'users'},{path:'creator'}]).execPopulate();
            participants = room.users.filter(i=> String(i._id) !== socket.decoded_token.id);
            console.log(room);
            socket.join(room._id);
            for (let user of participants){
                io.to(getUserSocketsRoom(user)).emit('invitation', room);
                console.log('---------------');
                console.log(user);
            }
            io.to(socket.id).emit('newRoom', room)
        }catch (e){
            console.log(e);
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }
    },

    inviteUsers: async (io, socket, params) => {
        try{
            const room = await Room.findOne({_id:params.roomId, users: socket.decoded_token.id});
            if(!room){
                throw new Error('Room not found');
            }
            let participants = Array.from(new Set(params.participants.concat(room.users)));
            participants = await User.find({
                _id:{
                    $in:participants
                },
                blacklist:{$ne:socket.decoded_token.id}
            });
            const invitor = participants.find(i=> String(i._id) === socket.decoded_token.id);
            participants = participants.filter(user => {
                let flag = false;
                for (let roomUser of room.users) {
                    console.log(String(user._id), String(roomUser), String(user._id) !== String(roomUser));
                    if (String(user._id) !== String(roomUser)) {
                        flag = true;
                    } else {
                        flag = false;
                        break;
                    }
                }
                return flag;
            });
            room.creator = invitor;
            for (let user of participants){
                room.users.push(user._id);
                io.to(getUserSocketsRoom(user)).emit('invitation', room)
            }
            const newParticipantsNames = participants.map(i=>i.name);
            const content = `${invitor.name} invited ${newParticipantsNames.join(', ')}`;
            const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
            await Message.create({createdAt: Date.now(), room: params.roomId, isSystemMessage:true,creator: invitor, content: contentEncrypted});
            io.to(params.roomId).emit('newMessage', {message:{content,createdAt: Date.now(), isSystemMessage:true,creator: invitor}, room: params.roomId });
            room.lastAction = Date.now();
            await room.save()
        }catch (e){
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message})
        }
    },

    renameRoom: async (io, socket, params) => {
        try {
            const roomId = params.roomId;
            const roomTitle = validator.escape(String(params.roomTitle).trim());
            if(!roomId || roomTitle.length < 3 || roomTitle.length > 20){
                throw new Error('Invalid data')
            }
            const room = await Room.findById(roomId);
            if (!room || String(room.creator) !== socket.decoded_token.id) {
                throw new Error("Room not found or you don't have permission")
            }
            await room.update({title: roomTitle});
            const content = `Room renamed to ${roomTitle}`;
            const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
            await Message.create({createdAt: Date.now(), room: params.roomId, isSystemMessage:true, content: contentEncrypted,
                creator: socket.decoded_token.id});
            const user = await User.findById(socket.decoded_token.id);
            io.to(params.roomId).emit('roomRename',{id:roomId,title:roomTitle});
            return io.to(params.roomId).emit('newMessage', {message:{content, createdAt:Date.now(), isSystemMessage:true,creator: user},
                room: params.roomId })
        }catch(e) {
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message})
        }
    },

    privacyChange: async (io, socket, params) => {
        try {
            const roomId = params.roomId;
            const roomPublicity = Boolean(params.roomPublicity);
            if(!roomId || roomPublicity === undefined){
                throw new Error('Invalid data')
            }
            const room = await Room.findById(roomId);
            if (!room || String(room.creator) !== socket.decoded_token.id) {
                throw new Error("Room not found or you don't have permission")
            }
            await room.update({isPublic: roomPublicity});
            const content = `Room is now ${roomPublicity? 'public': 'private'}`;
            const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
            await Message.create({createdAt: Date.now(), room: params.roomId, isSystemMessage:true,
                content: contentEncrypted, creator: socket.decoded_token.id});
            const user = await User.findById(socket.decoded_token.id);
            io.to(params.roomId).emit('privacyChanged',{id:roomId, isPublic: roomPublicity});
            return io.to(params.roomId).emit('newMessage', {message:{content, createdAt:Date.now(), isSystemMessage:true,creator: user},
                room: params.roomId })
        }catch(e){
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message})
        }
    },

    roomDelete: async (io, socket, params) => {
        try {
            const room = await Room.findById(params.roomId).populate('users');
            if(!room || String(room.creator) !== socket.decoded_token.id){
                throw new Error ("Room not found or you don't have permission")
            }

            io.to(params.roomId).emit('roomDeleted',{id:params.roomId});
            room.users.forEach(user=>{
                user.socketIds.forEach(socketId =>{
                    const socket = io.sockets.connected[socketId];
                    if(socket){
                        socket.leave(params.roomId)
                    }
                });
            });
            await room.remove();
        }catch(e){
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message})
        }
    },

    deleteParticipant: async (io, socket, params) => {
        try{
            const room = await Room.findById(params.roomId).populate('creator');
            if(!room || String(room.creator._id) !== socket.decoded_token.id){
                throw new Error ("Room not found or you don't have permission")
            }
            const deletedUserId = room.users.find(i=> String(i) === params.deletedUserId);
            if(!deletedUserId){
                throw new Error('User is not in the room')
            }
            room.users.pull(deletedUserId);
            await room.save();
            const deletedUser = await User.findById(deletedUserId);
            const content = `${room.creator.name} deleted ${deletedUser.name} from the room`;
            const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
            await Message.create({createdAt: Date.now(), room: params.roomId, isSystemMessage:true,
                content: contentEncrypted, creator: socket.decoded_token.id});
            io.to(params.roomId).emit('userLeft', {userId: deletedUser._id, roomId: params.roomId});
            deletedUser.socketIds.forEach(socketId =>{
                const socket = io.sockets.connected[socketId];
                if(socket){
                    socket.leave(params.roomId)
                }
            });
            return io.to(params.roomId).emit('newMessage', {message:{content, createdAt:Date.now(), isSystemMessage:true,creator: room.creator},
                room: params.roomId })
        }catch(e){
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message})
        }
    }
};
