const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    familyName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    apogee:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        unique:true,
        required:true
    },
    paied:{
        type:Boolean,
        default:false
    },
    has_card:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    lastUsed:{
        type:Date,
        default:null
    }
},{timestamps:true});

module.exports = mongoose.model('db',memberSchema);