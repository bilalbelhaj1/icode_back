const User = require("../../src/modules/db")
require("dotenv").config();
const {connectDB} = require("../../src/config/dbConfig")

export default async function handler(req, res) {
  await connectDB();

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