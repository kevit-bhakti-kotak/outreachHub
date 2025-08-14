const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const verifyToken = require('../middleware/userAuth.js');

// Routes
router.get('/', verifyToken , userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);  
router.post('/',verifyToken, userController.createUser);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/logout', verifyToken, userController.logoutUser);
module.exports = router;