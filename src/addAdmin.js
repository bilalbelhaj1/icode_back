const mongoose = require('mongoose');
const Member = require("./modules/db");

async function activateAllMembers() {
  try {
    await mongoose.connect("mongodb+srv://icodeofficialclub_db_user:SItwYItgO63OjufB@cluster0.rvcyckn.mongodb.net/?appName=Cluster0"); // or your connection string

    const result = await Member.updateMany(
      {},                 // match all documents
      { $set: { isActive: true } }
    );

    console.log('Update result:', result);
  } catch (err) {
    console.error('Error updating members:', err);
  } finally {
    await mongoose.disconnect();
  }
}

activateAllMembers();