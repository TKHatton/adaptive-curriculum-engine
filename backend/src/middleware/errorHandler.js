const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
  
    if (err.name === 'MulterError') {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File Too Large',
          message: 'File size cannot exceed 10MB'
        });
      }
      return res.status(400).json({
        error: 'File Upload Error',
        message: err.message
      });
    }
  
    // Default error response
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };
  
  module.exports = errorHandler;