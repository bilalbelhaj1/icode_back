const Admin = require('../modules/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Code} = require('../tools/generateCode');
const {sendEmailAdmin} = require('../tools/emailTransCode');
const ExcelJS = require('exceljs');
const Member = require('../modules/db');

exports.login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"All fields are required"});
    try{
        const admin = await Admin.findOne({email});
        if(!admin) return res.status(404).json({message:"Admin Not Found"});

        const passwordMatch = await bcrypt.compare(password,admin.password);

        if(!passwordMatch) return res.status(401).json({message:"Password Incorrect"});

        const token = jwt.sign(
            {adminId:admin._id,email:admin.email},
            process.env.SECRET_KEY,
            {expiresIn:process.env.JWT_EXPIRES_IN || "1d"}
        );

        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        return res.status(200).json({message:"Login Successful",token});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

exports.emailVerification = async (req,res) => {
    const {email} = req.body;
    if(!email) return res.status(400).json({message:"All fields are required"});
    try{
        const admin = await Admin.findOne({email});
        if(!admin) return res.status(404).json({message:"Admin not found"});

        const result = Code();
        console.log(result)
        console.log(result.code);
        console.log(result.expiresAt);

        admin.verificationCode = result.code;
        admin.codeExpires = result.expiresAt;

        await admin.save();

        await sendEmailAdmin(email,'Here is you verfication code',result.code);

        return res.status(200).json({message:"code sent successfuly", adminId:admin._id});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.codeVerification = async (req,res) => {
    const {code,adminId} = req.body;
    if(!code) return res.status(400).json({message:"Code is required"});
    try{
        const admin = await Admin.findById(adminId);

        if(!admin) return res.status(404).json({message:"Admin not found"});

        if(code !== admin.verificationCode) return res.status(401).json({message:"Code Incorrect"});

        if(!admin.codeExpires || admin.codeExpires < new Date()) return res.status(401).json({message:"Code expired"});

        if(admin.verificationCode !== code) return res.status(401).json({message:"Code incorrect"});

        return res.status(200).json({message:"Code verified successfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

exports.resetPassword = async (req,res) => {
    const {adminId,newPass,verifiedPass} = req.body;
    if(!newPass || !verifiedPass) return res.status(400).json({message:"All fileds are required"});
    if(newPass !== verifiedPass) return res.status(401).json({message:"Unmatched"});
    try{
        const admin = await Admin.findById(adminId);

        admin.password = await bcrypt.hash(newPass,10);
        await admin.save()

        return res.status(200).json({message:"Password modified successfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

exports.exportMembers = async (req,res) => {
    try{
        const members = await Member.find().lean();
        if(!members.length) return res.status(404).json({message:"No User Found"});

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Members');

        worksheet.columns = [
            {header:'Apogee',key:'apogee',width:30},
            {header:'First Name',key:'firstName',width:30},
            {header:'Family Name',key:'familyName',width:30},
            {header:'Phone Number',key:'phoneNumber',width:30},
            {header:'Email',key:'email',width:40}
        ]

        await members.forEach(member => {
            console.log(member)
            worksheet.addRow({
                apogee:member.apogee,
                firstName:member.firstName,
                familyName:member.familyName,
                phoneNumber:member.phoneNumber,
                email:member.email
            });
        });

        worksheet.getRow(1).font = {bold:true};

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=members.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end()

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Errors Exporting Members"});
    }
}