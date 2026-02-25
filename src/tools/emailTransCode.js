require('dotenv').config()
const nodemailer = require('nodemailer');
const path = require('path');

const image = path.join(__dirname,'./iCode.png')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ADMIN,
        pass:process.env.EMAIL_PASS
    }
})

async function sendEmailAdmin(to, subject, code){
    console.log(code);
    try{

        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
                
                <img src="cid:logo" width="120" style="margin-bottom:20px;" />

                <h2 style="color:#333;">Verification Code</h2>
                
                <p style="font-size:16px; color:#555;">
                    Use the following code to complete your verification:
                </p>

                <div style="font-size:32px; font-weight:bold; 
                            letter-spacing:5px; 
                            background:#f0f0f0; 
                            padding:15px; 
                            margin:20px 0; 
                            border-radius:8px;">
                    ${code}
                </div>

                <p style="font-size:14px; color:#888;">
                    This code will expire in 10 minutes.
                </p>

                <hr style="margin:20px 0;">

                <p style="font-size:12px; color:#aaa;">
                    This email was sent automatically. Please do not respond.
                </p>
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_ADMIN,
            to,
            subject,
            html: htmlTemplate,
            attachments:[
                {
                    filename:"iCode.png",
                    path:image,
                    cid:"logo"
                }
            ]
        })
        
        return {success:true};

    }catch(err){
        console.error("Email sending error", err);
        return {success:false, error:err};
    }
}

module.exports = {transporter, sendEmailAdmin};