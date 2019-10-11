const socketIO = require('socket.io');
module.exports= (server) => {

    const io = socketIO(server);
    io.on('connection', socket => {
        socket.join('common');
        if (socket.handshake.headers.Authorization === 'Bearer js') {
            io.to('common').emit('join', {message: "welcome, js fan"})
        }
    });

};