const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose'); // Add this import
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both ports
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import auth middleware (make sure this path is correct)
const authenticateToken = require('./middleware/auth'); // Adjust path if needed

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/highlight', require('./routes/highlight'));

// NEW: Drawing Schema and Model
const drawingSchema = new mongoose.Schema({
  pdfUuid: { 
    type: String, 
    required: true 
  },
  pageNumber: { 
    type: Number, 
    required: true 
  },
  drawingData: { 
    type: Object, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

// NEW: Drawing API Routes
app.post('/api/drawing', authenticateToken, async (req, res) => {
  try {
    const drawing = new Drawing(req.body);
    await drawing.save();
    res.status(201).json({ 
      success: true, 
      message: 'Drawing saved successfully',
      drawing 
    });
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/drawing/:pdfUuid', authenticateToken, async (req, res) => {
  try {
    const { pdfUuid } = req.params;
    const drawings = await Drawing.find({ pdfUuid }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: drawings.length,
      drawings 
    });
  } catch (error) {
    console.error('Error fetching drawings:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// NEW: Get drawings for specific page
app.get('/api/drawing/:pdfUuid/page/:pageNumber', authenticateToken, async (req, res) => {
  try {
    const { pdfUuid, pageNumber } = req.params;
    const drawings = await Drawing.find({ 
      pdfUuid, 
      pageNumber: parseInt(pageNumber) 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: drawings.length,
      drawings 
    });
  } catch (error) {
    console.error('Error fetching page drawings:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// NEW: Delete a drawing
app.delete('/api/drawing/:drawingId', authenticateToken, async (req, res) => {
  try {
    const { drawingId } = req.params;
    const drawing = await Drawing.findByIdAndDelete(drawingId);
    
    if (!drawing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Drawing not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Drawing deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting drawing:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Note Schema
const noteSchema = new mongoose.Schema({
  pdfUuid: String,
  pageNumber: Number,
  x: Number,
  y: Number,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// Note API Routes
app.post('/api/note', authenticateToken, async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/note/:pdfUuid', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ pdfUuid: req.params.pdfUuid }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/note/:pdfUuid/page/:pageNumber', authenticateToken, async (req, res) => {
  try {
    const { pdfUuid, pageNumber } = req.params;
    const notes = await Note.find({ 
      pdfUuid, 
      pageNumber: parseInt(pageNumber) 
    }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/note/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, note: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/note/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PDF Annotator API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ Drawing API endpoints added:');
  console.log('   POST /api/drawing - Save drawing');
  console.log('   GET /api/drawing/:pdfUuid - Get all drawings for PDF');
  console.log('   GET /api/drawing/:pdfUuid/page/:pageNumber - Get page drawings');
  console.log('   DELETE /api/drawing/:drawingId - Delete drawing');
});
