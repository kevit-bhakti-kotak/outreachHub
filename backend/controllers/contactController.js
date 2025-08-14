const Workspace = require('../models/workspace.js');
const Contact = require('../models/contact.js');

// Create a new contact
const createContact = async (req, res) => {
  try {
    const{ workspaceId } = req.params.workspaceId;
    const { name, phoneNumber, tags } = req.body;

    const contact = await Contact.create({
      name,
      phoneNumber,
      tags,
      workspaceId,
      createdBy: req.user.userId  // from JWT token middleware
    });
   

    res.status(201).json({ message: 'Contact created successfully', contact });
     
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
};

// Get all contacts for a workspace
const getContactsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const contacts = await Contact.find({ 
      workspaceId,
      createdBy: req.user._id
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

// Get a single contact by ID
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({
      _id: id,
      createdBy: req.user.userId
    });

    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Contact.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Contact not found or not authorized' });

    res.status(200).json({ message: 'Contact updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Contact.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId
    });

    if (!deleted) return res.status(404).json({ message: 'Contact not found or not authorized' });

    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};
module.exports= {createContact, getContactsByWorkspace, getContactById, updateContact, deleteContact};