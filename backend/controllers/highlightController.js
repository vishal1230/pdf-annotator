const Highlight = require('../models/Highlight');
const PDF = require('../models/PDF');

exports.createHighlight = async (req, res) => {
  try {
    const { pdfUuid, pageNumber, highlightedText, position, boundingBox, color } = req.body;

    // Verify PDF belongs to user
    const pdf = await PDF.findOne({ uuid: pdfUuid, userId: req.user._id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const highlight = new Highlight({
      pdfUuid,
      userId: req.user._id,
      pageNumber,
      highlightedText,
      position,
      boundingBox,
      color
    });

    await highlight.save();

    res.status(201).json({
      message: 'Highlight created successfully',
      highlight
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getHighlights = async (req, res) => {
  try {
    const { pdfUuid } = req.params;

    // Verify PDF belongs to user
    const pdf = await PDF.findOne({ uuid: pdfUuid, userId: req.user._id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const highlights = await Highlight.find({ pdfUuid, userId: req.user._id })
      .sort({ pageNumber: 1, createdAt: 1 });

    // CRITICAL: This must return JSON, not PDF!
    res.status(200).json({ highlights: highlights || [] });
    
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.updateHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const highlight = await Highlight.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      { new: true }
    );

    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json({
      message: 'Highlight updated successfully',
      highlight
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteHighlight = async (req, res) => {
  try {
    const { id } = req.params;

    const highlight = await Highlight.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
