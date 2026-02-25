const express = require('express');
const userController = require('../controllers/memberController');

const router = express.Router()

router.post('/add',userController.addMember);
router.post('/verify',userController.verifyMember);
router.put('/edit/:id',userController.editMember);
router.get('/getOne/:id',userController.getOneMember);
router.get('/getAll',userController.getAllMembers);

module.exports = router;