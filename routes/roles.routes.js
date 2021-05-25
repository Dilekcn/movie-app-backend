const express = require('express');
const router = express.Router();

const rolesControllers = require('../controllers/roles.controllers');

router.get('/roles', rolesControllers.getAllRoles);
router.get('/roles/:roleid', rolesControllers.getSingleRoleById);
router.post('/roles', rolesControllers.createRole);

module.exports = router;
