const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const conf = require('./config/config');
const socketInit = require('./socket');

const server = http.createServer(app);

socketInit(server);

mongoose.connect(conf.MONGO_URL, {useNewUrlParser: true})
    .then(()=>{
        console.log('connection established');
        server.listen(conf.PORT);
    })
.catch((e)=>console.log(e));

