const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenants.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/:slug/upgrade', auth, checkRole('Admin'), tenantsController.upgradeTenant);

module.exports = router;