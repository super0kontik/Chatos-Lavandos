const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:String,
    name:{
        type:String,
        required:true
    },
    socketIds:[{
        type:String,
    }],
    isPremium:{
        type:Boolean,
        default: false
    },
    isOnline:{
        type:Boolean,
        default: false
    },

});
module.exports = mongoose.model('User',userSchema);