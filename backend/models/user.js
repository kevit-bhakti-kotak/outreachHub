const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true},
  phoneNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  workspaces:{
     
         workspaces: [
    {
      workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
      },
      role: {
        type: String,
        enum: ['Editor', 'Viewer'],
        default: "Viewer"
      }
    }
  ],
     }
},{
  timestamps: true, //createdAt and updatedAt
});

// Index: email (already unique)

//userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);