const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subdirectory based on file type
    let destDir = uploadDir;
    
    if (file.mimetype.startsWith('audio/')) {
      destDir = path.join(uploadDir, 'audio');
    } else if (file.mimetype === 'application/pdf') {
      destDir = path.join(uploadDir, 'documents/pdf');
    } else if (file.mimetype.includes('word') || file.mimetype.includes('officedocument')) {
      destDir = path.join(uploadDir, 'documents/word');
    } else if (file.mimetype === 'text/plain') {
      destDir = path.join(uploadDir, 'documents/text');
    } else {
      destDir = path.join(uploadDir, 'other');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for different types
const fileFilter = {
  documents: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and TXT files are allowed.'), false);
    }
  },
  audio: (req, file, cb) => {
    const allowedTypes = [
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3 and WAV files are allowed.'), false);
    }
  }
};

// File size limits
const limits = {
  documents: 15 * 1024 * 1024, // 15MB for documents
  audio: 10 * 1024 * 1024      // 10MB for audio
};

// Create multer instances for different file types
const uploadDocuments = multer({
  storage,
  fileFilter: fileFilter.documents,
  limits: { fileSize: limits.documents }
});

const uploadAudio = multer({
  storage,
  fileFilter: fileFilter.audio,
  limits: { fileSize: limits.audio }
});

// Middleware handlers
const fileHandler = {
  /**
   * Handle document uploads (PDF, Word, TXT)
   */
  documents: uploadDocuments.array('documents', 5),
  
  /**
   * Handle audio uploads (MP3, WAV)
   */
  audio: uploadAudio.single('audio'),
  
  /**
   * Custom error handler for multer
   */
  handleError: (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'File too large',
          message: 'The uploaded file exceeds the maximum file size limit.'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(413).json({
          error: 'Too many files',
          message: 'You can upload up to 5 documents at once.'
        });
      }
      
      return res.status(400).json({
        error: 'Upload error',
        message: err.message
      });
    }
    
    if (err) {
      return res.status(400).json({
        error: 'File upload failed',
        message: err.message
      });
    }
    
    next();
  },
  
  /**
   * Middleware to clean up temporary files
   */
  cleanupFiles: (req, res, next) => {
    // Keep track of uploaded files to clean up later if needed
    req.filesToCleanup = [];
    
    if (req.file) {
      req.filesToCleanup.push(req.file.path);
    }
    
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        req.filesToCleanup.push(file.path);
      });
    }
    
    // Add cleanup function to response object
    res.on('finish', () => {
      // Only clean up temporary files if configured to do so
      // (disabled by default to keep files for debugging)
      const shouldCleanup = process.env.CLEANUP_TEMP_FILES === 'true';
      
      if (shouldCleanup && req.filesToCleanup && req.filesToCleanup.length > 0) {
        req.filesToCleanup.forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    });
    
    next();
  }
};

module.exports = fileHandler;