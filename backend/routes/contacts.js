const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController.js');
const verifyToken = require('../middleware/userAuth.js');

router.get('/', verifyToken ,);
router.get('/:id', verifyToken, );  
router.post('/',verifyToken, );
router.put('/:id', verifyToken,);
router.delete('/:id', verifyToken, );
module.exports = router;