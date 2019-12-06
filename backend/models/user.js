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
    avatar: String,
    blacklist:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    colorTheme:{
        type:String,
        enum:['dark', 'light'],
        default: 'dark'
    }
});
module.exports = mongoose.model('User',userSchema);