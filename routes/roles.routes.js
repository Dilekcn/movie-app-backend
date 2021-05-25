const express = require('express');
const router = express.Router();

const rolesControllers = require('../controllers/roles.controllers');

router.get('/roles', rolesControllers.getAllRoles);
