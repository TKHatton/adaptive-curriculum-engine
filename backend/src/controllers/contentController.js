const fs = require('fs');
const path = require('path');

const processContent = async (req, res) => {
  const { textContent } = req.body;

  console.log('📥 Received textContent:', textContent);

  if (!textContent) {
    return res.status(400).json({ message: 'No content received' });
  }

  // Here you'd call OpenAI or do your processing
  return res.status(200).json({
    message: 'Content received successfully!',
    processedText: textContent
  });
};

const getContent = async (req, res) => {
  const { contentId } = req.params;

  const contentPath = path.join(__dirname, `../../uploads/content/${contentId}.txt`);
  if (!fs.existsSync(contentPath)) {
    return res.status(404).json({
      error: 'Content not found',
      message: 'The requested content does not exist'
    });
  }

  const content = fs.readFileSync(contentPath, 'utf8');
  return res.status(200).json({ content });
};

module.exports = {
  processContent,
  getContent
};
