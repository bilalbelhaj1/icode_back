const User = require('../modules/db');
const qr = require('../tools/QRCode');
const Card = require('../tools/generateCard');
const {sendEmail} = require('../tools/emailTransporter');
const {verifyQRCode} = require('../tools/QRCode');
const jwt = require("jsonwebtoken")

exports.addMember = async (req,res) => {
    const {firstName,familyName,apogee,phoneNumber,email} = req.body;
    if(!firstName || !familyName || !apogee || !phoneNumber || !email) return res.status(400).json({message:"All fields are required"});
    try{
        const member = await User.create({
            firstName:firstName,
            familyName:familyName,
            apogee:apogee,
            phoneNumber:phoneNumber,
            email:email,
            has_card:true
        });

        const qrCode = await qr.generateSecureQrCode(member.apogee);

        console.log(qrCode);

        const card = await Card.generateCard(qrCode,firstName,familyName,apogee);

        await sendEmail(email,'iCode member card','Here is your Membership card',card,qrCode);

        return res.status(200).json(member);
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Add user failed"});
    }
}

exports.editMember = async (req,res) => {
    const {firstName,familyName,apogee,phoneNumber,email} = req.body;
    const { id } = req.params;
    console.log(id);
    if(!firstName && !familyName && !apogee && !phoneNumber && !email) return res.status(400).json({message:"Nothing to update"})
    try{
        const member = await User.findById(id);
        if(!member) return res.status(404).json({message:"Member not found"});
        if(firstName) member.firstName = firstName;
        if(familyName) member.familyName = familyName;
        if(apogee) member.apogee = apogee;
        if(phoneNumber) member.phoneNumber = phoneNumber;
        if(email) member.email = email;
        await member.save();
        return res.status(200).json(member);
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Updates failed"});
    }
}

exports.getAllMembers = async (req,res) => {
    try{
        const members = await User.find();
        return res.status(200).json({members});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getOneMember = async (req,res) => {
    const { id } = req.param;
    if(!id) return res.status(400).json({message:"id required"});
    try{
        const member = await User.findById(id)
        if(!member) return res.status(404).json({message:"Member Not Found"});
        return res.status(200).json(member);
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.verifyMember = async (req,res) => {
    const { token } = req.body;
   try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decoded)
    let member = await User.findOne({apogee: decoded.member});
    if (!member) return res.status(404).json({message:"could not find the member with this qrcode"})
    if(!member.isActive) return res.status(400).json({message:"Qr code is already scanned"})
    const now = new Date();
    member.lastUsed = now;
    member.isActive = false;

    await member.save();
    res.status(200).json({ message:`Qrcode valid for ${member.firstName} ${member.familyName} `});
   } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong, please contact the developer" })
   }
}

exports.resetActive = async (req, res) => {
  try {
    console.log('Job executed: reset isActive');

    await User.updateMany(
      { isActive: false },
      { $set: { isActive: true } }
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error Cron Job', err);
    res.status(500).json({ error: 'Cron failed' });
  }
}
