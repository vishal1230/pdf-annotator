const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { 
  uploadPDF, 
  getUserPDFs, 
  getPDF, 
  deletePDF, 
  renamePDF 
} = require('../controllers/pdfController');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/upload', auth, upload.single('pdf'), uploadPDF);
router.get('/list', auth, getUserPDFs);
router.get('/:uuid', auth, getPDF);
router.delete('/:uuid', auth, deletePDF);
router.put('/:uuid/rename', auth, renamePDF);

module.exports = router;
