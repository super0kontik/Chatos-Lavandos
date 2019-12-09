const User = require('../../models/user');
const Room = require('../../models/room');
const Message = require('../../models/message');
const {getUserSocketsRoom} = require('./utils');
const crypto = require('crypto-js');
const validator = require('validator');
const {MESSAGE_KEY} = require('../../config/config');

module.exports = {
    createMessage: async (io, socket, params) => {
        try {
            let messId = 0;
            const createdAt = Date.now();
            const creator = await User.findById(socket.decoded_token.id);
            if(params.message.trim().length<1 || !creator){
                throw new Error('invalid message')
            }
            if (params.room !== 'common') {
                const room = await Room.findOne({_id:params.room, users:socket.decoded_token.id});
                if(room) {
                    const content = crypto.AES.encrypt(validator.escape(params.message), MESSAGE_KEY).toString();
                    const mess = await Message.create({createdAt, creator, room: params.room, content});
                    messId = mess._id;
                    await room.update({lastAction:Date.now()});
                }else{
                    throw new Error('Forbidden')
                }
            }
            io.to(params.room).emit('newMessage', {message:{content: params.message, createdAt, _id:messId , creator, isSystemMessage:false, read: []}, room: params.room })
        }catch(e){
            console.log(e);
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }
    },

    readMessage: async (io, socket, params) => {
        try {
            console.log(params.messageId);
            const message = await Message.findById(params.messageId).populate('room');
            if(!message){
                throw new Error('Message not found');
            }
            const userInRoom = !!message.room.users.find(item => String(item) === String(socket.decoded_token.id));
            if(!userInRoom || String(message.creator) === socket.decoded_token.id){
                throw new Error('Not allowed to read');
            }
            if(!!message.read.find(i => String(i) === socket.decoded_token.id)){
                return console.log('message already read');
            }
            message.read.push(socket.decoded_token.id);
            await message.save();
            return io.to(String(message.room._id)).emit('messageRead', {id: params.messageId, user: socket.decoded_token.id});
        }catch (e) {
            console.log(e);
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }
    }
};
