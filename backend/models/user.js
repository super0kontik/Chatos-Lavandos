const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
        required:true
    },
    isPrem:{
        type:Boolean,
        default: false
    },
    isOnline:{
        type:Boolean,
        default: false
    },

});
module.exports = mongoose.model('User',userSchema);