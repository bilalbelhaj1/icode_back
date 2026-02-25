require('dotenv').config()
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const image = path.join(__dirname,'./iCode.png')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ADMIN,
        pass:process.env.EMAIL_PASS
    }
})

async function sendEmail(to, subject, text, html,qrbuffer){
    try{
        await transporter.sendMail({
            from:process.env.EMAIL_ADMIN,
            to,
            subject,
            text,
            html:`${html}
            <br><br>
            <p>This card has been issued exclusively to you and is non-transferable.</p>
            <p><strong>Please do not respond to this email.</strong></p>`,
            attachments:[
                {
                    filename:"qrcode.png",
                    content:qrbuffer,
                    cid:"qrcode"
                },
                {
                    filename:"iCode.png",
                    path:image,
                    cid:"logo"
                }
            ],
            message:"This card has been issued exclusively to you and is non-transferable.\n\n\nPlease do not respond to this email."
    })
        
        return {success:'True'};
    }catch(err){
        console.error("Email sending error"+err);
        return {success:'false',error:err};
    }
}

module.exports = {transporter, sendEmail};