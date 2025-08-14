const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController.js');
const verifyToken = require('../middleware/userAuth.js');
// router.use(verifyToken);

router.get('/:workspaceId', verifyToken ,contactController.getContactsByWorkspace);
router.get('/:workspaceId/:id', verifyToken, contactController.getContactById);  
router.post('/:workspaceId',verifyToken,contactController.createContact );
router.put('/:workspaceId/:id', verifyToken,contactController.updateContact );
router.delete('/:workspaceId/:id', verifyToken, contactController.deleteContact);
module.exports = router;