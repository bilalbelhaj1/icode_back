const User = require('../modules/db.js');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

async function generateSecureQrCode(apogee){
    try{
        let member = await User.findOne({apogee});
        if(!member) return res.status(404).json({message:"User Not Found"});

        const token = jwt.sign(
            {member:member.apogee},
            process.env.SECRET_KEY
        )

        member.token = token;  

        const qrcode = await QRCode.toBuffer(token);

        member.save();

        return qrcode;
    }catch(err){
        console.error(err);
        return null;
    }
}


async function verifyQRCode(token){
    try{
        console.log("request reqched")
        console.log(token)
        const decoded = jwt.verify(token,process.env.SECRET_KEY);

        let member = await User.findOne({apogee:decoded.member});

        if(!member) return {message:"User Not Found"};
        if(!member.isActive) return {message:"QR Code is desactivated"}
        if(member.token !== token) return {valid:false,message:"Token mismatch"};

        const now = new Date();

        member.lastUsed = now;

        member.isActive = false;

        await member.save()

        return {valid:true,message:"Scan Valid",info:[member.firstName,member.familyName,member.apogee]};
    }catch(err){
        return {valid:false,message:"QR Code invalid"};
    }
}

module.exports = {generateSecureQrCode,verifyQRCode}