const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const conf = require('./config/config');
const soketInit = require('./socket');


const server = http.createServer(app,{
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": '*', //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

soketInit(server);

mongoose.connect(conf.MONGO_URL, {useNewUrlParser: true})
    .then(()=>{
        console.log('connection established');
        server.listen(conf.PORT);
    })
.catch((e)=>console.log(e));

