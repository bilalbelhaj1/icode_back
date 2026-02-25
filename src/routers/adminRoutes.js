const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/login',adminController.login);
router.post('/emailVerification',adminController.emailVerification);
router.post('/codeVerification',adminController.codeVerification);
router.post('/resetPassword',adminController.resetPassword);
router.get('/exportList',adminController.exportMembers);

module.exports = router;