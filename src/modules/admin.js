const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verificationCode:{
        type:String
    },
    codeExpires:{
        type:Date
    }
},{timestamps:true});

module.exports = mongoose.model('admin',admin);