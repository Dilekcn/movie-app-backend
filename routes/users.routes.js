const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.controllers');
const isAdmin = require('../auth/isAdmin');

router.get('/users', userControllers.getAllUsers);
router.get('/users/:id', userControllers.getSingleUserById);
router.get('/users/firstname/:firstname', userControllers.getSingleUserByFirstName);
router.get('/users/lastname/:lastname', userControllers.getSingleUserByLastName);
router.get('/users/email/:email', userControllers.getSingleUserByEmail);
router.get('/users/country/:country', userControllers.getSingleUserByCountry);
router.post('/users/signup', userControllers.createUser);
router.post('/users/signin', userControllers.login);
router.put('/users/:id', userControllers.updateUser);
router.delete('/users/:id', userControllers.deleteUser);

module.exports = router;
