exports.processContent = async (req, res) => {
    const { textContent } = req.body;
  
    if (!textContent) {
      return res.status(400).json({ message: 'No content received' });
    }
  
    // Here you'd call OpenAI or do your processing
    return res.status(200).json({
      message: 'Content received successfully!',
      processedText: textContent
    });
  };
  