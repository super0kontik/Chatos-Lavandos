const socketIO = require('socket.io');
const sjwt = require('socketio-jwt');
const {SECRET_WORD} = require('./config/config');

const {
    connect,
    searchUsers,
    changeColor,
    disconnect
} = require('./controllers/socket/user');

const {
    acceptInvitation,
    joinRoom,
    leaveRoom,
    searchRoom
} = require('./controllers/socket/roomInteraction');

const {
    createMessage,
    readMessage,
    updateMessage,
    deleteMessage
} = require('./controllers/socket/message');

const {
    createRoom,
    inviteUsers,
    renameRoom,
    privacyChange,
    roomDelete,
    deleteParticipant
} = require('./controllers/socket/roomAdministration');

module.exports = server => {
    const io = socketIO(server);

    io.use(sjwt.authorize({
        secret: SECRET_WORD,
        handshake: true
    }));

    io.on('connection', async socket => {
        await connect(io, socket);

        socket.on('createMessage', async params => await createMessage(io, socket, params));

        socket.on('createRoom', async params => await createRoom(io, socket, params));

        socket.on('acceptInvitation', async params => await acceptInvitation(io, socket, params));

        socket.on('joinRoom', async params => await joinRoom(io, socket, params));

        socket.on('leaveRoom', async params => await leaveRoom(io, socket, params));

        socket.on('inviteUsers', async params => await inviteUsers(io, socket, params));
        
        socket.on('renameRoom', async params => await renameRoom(io, socket, params));

        socket.on('privacyChange', async params => await privacyChange(io, socket, params));

        socket.on('roomDelete', async params => await roomDelete(io, socket, params));

        socket.on('deleteParticipant', async params => await deleteParticipant(io, socket, params));

        socket.on('searchUsers', async params => await searchUsers(io, socket, params));

        socket.on('searchRooms', async params => await searchRoom(io, socket, params));

        socket.on('changeColor', async params => await changeColor(io, socket, params));

        socket.on('readMessage', async params => await readMessage(io, socket, params));

        socket.on('updateMessage', async params => await updateMessage(io, socket, params));

        socket.on('deleteMessage', async params => await deleteMessage(io, socket, params));

        socket.on('disconnect', async () => await disconnect(io, socket));
    });
};
