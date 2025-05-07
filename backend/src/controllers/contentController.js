const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const documentProcessor = require('../services/documentProcessor');

const contentController = {
  /**
   * Process content from text or uploaded files
   */
  process: async (req, res, next) => {
    try {
      const { textContent } = req.body;
      const files = req.files || [];
      
      // Generate unique content ID
      const contentId = uuidv4();
      let processedContent = '';
      
      // Process direct text input if provided
      if (textContent && textContent.trim()) {
        processedContent += textContent.trim();
      }
      
      // Process each uploaded file
      if (files.length > 0) {
        const fileContents = await Promise.all(
          files.map(file => documentProcessor.extractText(file.path, file.mimetype))
        );
        
        // Combine file contents with text input
        processedContent += '\n\n' + fileContents.join('\n\n');
      }
      
      if (!processedContent) {
        return res.status(400).json({
          error: 'No content provided',
          message: 'Please provide content either through text input or file upload'
        });
      }
      
      // Store processed content for later use
      const contentPath = path.join(__dirname, '../../uploads/content');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(contentPath)) {
        fs.mkdirSync(contentPath, { recursive: true });
      }
      
      // Save content to file
      fs.writeFileSync(
        path.join(contentPath, `${contentId}.txt`),
        processedContent
      );
      
      res.status(200).json({
        message: 'Content processed successfully',
        contentId,
        contentPreview: processedContent.substring(0, 200) + '...',
        wordCount: processedContent.split(/\s+/).length
      });
      
    } catch (error) {
      console.error('Content processing error:', error);
      next(error);
    }
  },
  
  /**
   * Get processed content by ID
   */
  getContent: async (req, res, next) => {
    try {
      const { contentId } = req.params;
      const contentPath = path.join(__dirname, `../../uploads/content/${contentId}.txt`);
      
      if (!fs.existsSync(contentPath)) {
        return res.status(404).json({
          error: 'Content not found',
          message: 'The requested content does not exist'
        });
      }
      
      const content = fs.readFileSync(contentPath, 'utf8');
      
      res.status(200).json({
        contentId,
        content,
        wordCount: content.split(/\s+/).length
      });
      
    } catch (error) {
      console.error('Get content error:', error);
      next(error);
    }
  }
};

module.exports = contentController;