const express = require('express');
const {connectDB} = require('./config/dbConfig');
const cors = require("cors")

connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://icodefront3.vercel.app",
  credentials: true
}));

const PORT = 8080;

const memberRoutes = require('./routers/routes');
const adminRoutes = require('./routers/adminRoutes');

require('./Jobs/updateStatus');

app.use('/member',memberRoutes);
app.use('/admin',adminRoutes);

app.get('/',(req, res) => {
    res.send('iCode-app backend');
});

app.listen(PORT,() => {
    console.log(`App is running on http://localhost:${PORT}`);
});