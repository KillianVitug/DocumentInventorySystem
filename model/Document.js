const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  imageUrl: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model('Document', documentSchema);
