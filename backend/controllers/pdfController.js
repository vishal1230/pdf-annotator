const PDF = require('../models/PDF');
const Highlight = require('../models/Highlight');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const pdfUuid = uuidv4();
    
    const pdf = new PDF({
      uuid: pdfUuid,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      userId: req.user._id,
      fileSize: req.file.size
    });

    await pdf.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: {
        uuid: pdf.uuid,
        filename: pdf.originalName,
        fileSize: pdf.fileSize,
        uploadedAt: pdf.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ userId: req.user._id })
      .select('uuid originalName fileSize createdAt')
      .sort({ createdAt: -1 });

    res.json({ pdfs });
  } catch (error) {
    console.error('Get user PDFs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPDF = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    //console.log(`Attempting to serve PDF with UUID: ${uuid}`);
    
    // Find PDF in database
    const pdf = await PDF.findOne({ uuid, userId: req.user._id });
    if (!pdf) {
      console.log(`PDF not found in database for UUID: ${uuid}`);
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Check if file exists on filesystem
    const filePath = path.resolve(pdf.filePath);
    //console.log(`Looking for file at path: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found on server: ${filePath}`);
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Get file stats
    const stat = fs.statSync(filePath);
    //console.log(`File found, size: ${stat.size} bytes`);
    
    // Set proper headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `inline; filename="${pdf.originalName}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // CORS headers for PDF serving
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Content-Length');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Create read stream and pipe to response
    const readStream = fs.createReadStream(filePath);
    
    readStream.on('error', (error) => {
      console.error('Error reading file:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error reading file' });
      }
    });

    readStream.on('open', () => {
      //console.log(`Streaming PDF file: ${pdf.originalName}`);
    });

    // Pipe the file to response
    readStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

exports.deletePDF = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    const pdf = await PDF.findOne({ uuid, userId: req.user._id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(pdf.filePath)) {
      try {
        fs.unlinkSync(pdf.filePath);
        console.log(`Deleted file: ${pdf.filePath}`);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    // Delete PDF and associated highlights from database
    await PDF.deleteOne({ uuid, userId: req.user._id });
    await Highlight.deleteMany({ pdfUuid: uuid, userId: req.user._id });

    console.log(`Deleted PDF and highlights for UUID: ${uuid}`);
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.renamePDF = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { newName } = req.body;

    if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid name provided' });
    }

    const pdf = await PDF.findOneAndUpdate(
      { uuid, userId: req.user._id },
      { originalName: newName.trim() },
      { new: true }
    );

    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    console.log(`Renamed PDF ${uuid} to: ${newName.trim()}`);
    res.json({ 
      message: 'PDF renamed successfully',
      pdf: {
        uuid: pdf.uuid,
        filename: pdf.originalName
      }
    });
  } catch (error) {
    console.error('Rename PDF error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Additional helper function to check PDF file health
exports.checkPDFHealth = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    const pdf = await PDF.findOne({ uuid, userId: req.user._id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const filePath = path.resolve(pdf.filePath);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      const stat = fs.statSync(filePath);
      res.json({
        uuid: pdf.uuid,
        filename: pdf.originalName,
        fileExists: true,
        fileSize: stat.size,
        filePath: pdf.filePath,
        databaseSize: pdf.fileSize,
        sizeMatch: stat.size === pdf.fileSize
      });
    } else {
      res.json({
        uuid: pdf.uuid,
        filename: pdf.originalName,
        fileExists: false,
        filePath: pdf.filePath
      });
    }
  } catch (error) {
    console.error('Check PDF health error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
