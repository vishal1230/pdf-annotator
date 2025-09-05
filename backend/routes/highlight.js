const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHighlight,
  getHighlights,
  updateHighlight,
  deleteHighlight
} = require('../controllers/highlightController');

// Create new highlight
router.post('/', auth, createHighlight);

// Get all highlights for a specific PDF
router.get('/:pdfUuid', auth, getHighlights);

// Update a specific highlight
router.put('/:id', auth, updateHighlight);

// Delete a specific highlight
router.delete('/:id', auth, deleteHighlight);

module.exports = router;
