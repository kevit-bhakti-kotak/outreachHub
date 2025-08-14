const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController.js');
const verifyToken = require('../middleware/userAuth.js');

// Routes
router.get('/', verifyToken ,workspaceController.getAllWorkspaces );
router.get('/:id', verifyToken,workspaceController.getWorkspaceById );  
router.post('/',verifyToken,workspaceController.createWorkspace );
router.put('/:id', verifyToken, workspaceController.updateWorkspace );
router.delete('/:id', verifyToken, workspaceController.deleteWorkspace);


module.exports = router;