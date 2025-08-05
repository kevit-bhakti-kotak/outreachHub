const Workspace = require('../models/workspace');

// post request (only admins can do this)
const createWorkspace = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can create workspaces.' });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const workspace = new Workspace({
      name,
      createdBy: req.user.userId, // auto assign from token
    });

    await workspace.save();

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all workspaces
const getAllWorkspaces = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can create workspaces.' });
    }
    const workspaces = await Workspace.find().populate('createdBy', 'name email');
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single workspace by ID
const getWorkspaceById = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can create workspaces.' });
    }
    const workspace = await Workspace.findById(req.params.id).populate('createdBy', 'name email');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete workspace (optional: restrict to admin or owner)
const deleteWorkspace = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can create workspaces.' });
    }
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Optional: Allow only admin or creator to delete
    if (!req.user.isAdmin && workspace.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this workspace' });
    }

    await Workspace.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Workspace deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { name } = req.body;

    const updated = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    res.status(200).json({ message: 'Workspace updated', workspace: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  deleteWorkspace,
  updateWorkspace
};
