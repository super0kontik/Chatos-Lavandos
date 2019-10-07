const app = require('./app');
const mongoose = require('mongoose');
const conf = require('./config/config');

mongoose.connect(conf.MONGO_URL, {useNewUrlParser: true})
    .then(()=>{
        console.log('connection established');
        app.listen(conf.PORT);
    })
    .catch((e)=>console.log(e));