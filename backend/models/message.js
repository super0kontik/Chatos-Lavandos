const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
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
    read: [{
        type:Schema.Types.ObjectId,
        ref:'User'
    }]
}, {timestamps: true});
module.exports = mongoose.model('Message',messageSchema);
