const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    createdAt:{
        type:Date,
        required:true
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    room:{
        type:Schema.Types.ObjectId,
        ref:'Room'
    },
    content:String,
    isSystemMessage:{
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Message',messageSchema);