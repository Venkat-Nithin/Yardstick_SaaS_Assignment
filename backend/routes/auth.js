const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/login', authController.login);
router.post('/invite', auth, checkRole('Admin'), authController.inviteUser);

module.exports = router;