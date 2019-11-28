const User = require('../../models/user');
const Room = require('../../models/room');
const {getUserSocketsRoom} = require('./utils');

module.exports = {
    connect : async (io, socket) => {
        try {
            let user = await User.findById(socket.decoded_token.id);
            if(!user){
                throw new Error('Invalid user')
            }
            await user.updateOne({isOnline:true});
            user.isOnline = true;
            user.socketIds.push(socket.id);
            user = await user.save();
            socket.join(getUserSocketsRoom(user));
            const usersOnline = await User.find({isOnline: true});
            const rooms = await Room.find({users:user._id}).populate([{path:'users'},{path:'creator'}]).sort('-lastAction');
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
            console.log(e);
            io.to(socket.id).emit('error',{error:{type: e.message}});
        }
    },

    searchUsers: async (io, socket, params) => {
        try {
            const users = await User.find({name: {$regex: '.*' + params + '.*', $options : 'i'},
                _id:{$ne:socket.decoded_token.id},
                blacklist:{$ne:socket.decoded_token.id}
            });
            io.to(socket.id).emit('searchResult', users);
        }catch (e){
            console.log(e);
        }
    },

    changeColor: async (io, socket, params) => {
        if(params.theme !== 'dark' && params.theme !== 'light'){
            throw new Error('invalid value');
        }
        try{
            const user = await User.findById(socket.decoded_token.id);
            if(!user){
                throw new Error('User not found');
            }
            await user.update({colorTheme: params.theme});
            io.to(getUserSocketsRoom(user)).emit('colorChanged', params.theme);
        }catch (e) {
            console.log(e);
            io.to(socket.id).emit('error', {type: e.message});
        }
    },

    disconnect: async (io, socket) => {
        try {
            const id = socket.decoded_token.id;
            const user = await User.findById(id);
            socket.leave(getUserSocketsRoom(user));
            user.socketIds.pull(socket.id);
            if(user.socketIds.length === 0) {
                user.isOnline = false;
                io.emit('userDisconnected', id);
                io.emit('userLeft', {userId: id, roomId: 'common'});
            }
            await user.save();
        } catch(e){
            console.log(e);
        }
    }
};