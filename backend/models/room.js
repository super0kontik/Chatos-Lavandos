const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    lastAction:{
        type:Date,
        required:true
    },
    isPublic:{
        type:Boolean,
        default:true
    }
});
module.exports = mongoose.model('Room',roomSchema);