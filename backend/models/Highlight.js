const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  pdfUuid: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  highlightedText: {
    type: String,
    required: true
  },
  position: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  boundingBox: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number
  },
  color: {
    type: String,
    default: '#ffff00'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Highlight', highlightSchema);
