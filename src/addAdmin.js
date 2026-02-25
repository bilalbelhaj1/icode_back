const admin = require("./modules/admin");
const mongoose = require("mongoose");
async function connect() {
    await mongoose.connect("mongodb://localhost:27017/icode")
}
async function addAdmin() {
    await connect();
    const newAdmin = await admin.create({
        email:"bilalbelhadj2025@gmail.com",
        password:"bilal123"
    })
    console.log(newAdmin)
}

addAdmin();