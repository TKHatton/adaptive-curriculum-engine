require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Simplified content route
app.post('/api/content/process', (req, res) => {
  const { textContent } = req.body;
  
  // Simple processing
  console.log('Received content:', textContent);
  
  res.status(200).json({
    message: 'Content processed successfully',
    contentId: 'test-123',
    contentPreview: textContent ? textContent.substring(0, 200) + '...' : 'No content provided',
    wordCount: textContent ? textContent.split(/\s+/).length : 0
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});