const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/aiService');
const outputGenerator = require('../services/outputGenerator');

const generationController = {
  /**
   * Generate instructor script based on content and writing style
   */
  generateScript: async (req, res, next) => {
    try {
      const { contentId, profileId, options } = req.body;
      
      // Validate content ID
      const contentPath = path.join(__dirname, `../../uploads/content/${contentId}.txt`);
      if (!fs.existsSync(contentPath)) {
        return res.status(404).json({
          error: 'Content not found',
          message: 'The requested content does not exist'
        });
      }
      
      // Load content
      const content = fs.readFileSync(contentPath, 'utf8');
      
      // Load writing profile if provided
      let writingProfile = null;
      if (profileId) {
        const profilePath = path.join(__dirname, `../../uploads/samples/${profileId}.json`);
        if (fs.existsSync(profilePath)) {
          writingProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        }
      }
      
      // Prepare generation prompt
      const prompt = aiService.createScriptPrompt(content, writingProfile, options);
      
      // Generate script using AI service
      const scriptContent = await aiService.generateScript(prompt);
      
      // Create script ID and save result
      const scriptId = uuidv4();
      const scriptsPath = path.join(__dirname, '../../uploads/scripts');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(scriptsPath)) {
        fs.mkdirSync(scriptsPath, { recursive: true });
      }
      
      // Save script with metadata
      const scriptData = {
        scriptId,
        contentId,
        profileId: profileId || null,
        options: options || {},
        content: scriptContent,
        createdAt: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(scriptsPath, `${scriptId}.json`),
        JSON.stringify(scriptData, null, 2)
      );
      
      res.status(200).json({
        message: 'Script generated successfully',
        scriptId,
        script: scriptContent
      });
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Generate presentation slides based on content
   */
  generateSlides: async (req, res, next) => {
    try {
      const { contentId, scriptId, options } = req.body;
      
      // Check if we're generating from content or script
      let sourceContent = '';
      let sourceType = '';
      
      if (scriptId) {
        // Generate slides from existing script
        const scriptPath = path.join(__dirname, `../../uploads/scripts/${scriptId}.json`);
        if (!fs.existsSync(scriptPath)) {
          return res.status(404).json({
            error: 'Script not found',
            message: 'The requested script does not exist'
          });
        }
        
        const scriptData = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
        sourceContent = scriptData.content;
        sourceType = 'script';
      } else if (contentId) {
        // Generate slides directly from content
        const contentPath = path.join(__dirname, `../../uploads/content/${contentId}.txt`);
        if (!fs.existsSync(contentPath)) {
          return res.status(404).json({
            error: 'Content not found',
            message: 'The requested content does not exist'
          });
        }
        
        sourceContent = fs.readFileSync(contentPath, 'utf8');
        sourceType = 'content';
      } else {
        return res.status(400).json({
          error: 'Missing source',
          message: 'Please provide either contentId or scriptId'
        });
      }
      
      // Prepare generation prompt
      const prompt = aiService.createSlidesPrompt(sourceContent, sourceType, options);
      
      // Generate slides using AI service
      const slidesData = await aiService.generateSlides(prompt);
      
      // Create slides ID and save result
      const slidesId = uuidv4();
      const slidesPath = path.join(__dirname, '../../uploads/slides');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(slidesPath)) {
        fs.mkdirSync(slidesPath, { recursive: true });
      }
      
      // Save slides with metadata
      const slidesMetadata = {
        slidesId,
        contentId: contentId || null,
        scriptId: scriptId || null,
        options: options || {},
        slides: slidesData,
        createdAt: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(slidesPath, `${slidesId}.json`),
        JSON.stringify(slidesMetadata, null, 2)
      );
      
      res.status(200).json({
        message: 'Slides generated successfully',
        slidesId,
        slides: slidesData
      });
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Generate PPTX file from slides data
   */
  generatePPTX: async (req, res, next) => {
    try {
      const { slidesId } = req.params;
      const slidesPath = path.join(__dirname, `../../uploads/slides/${slidesId}.json`);
      
      if (!fs.existsSync(slidesPath)) {
        return res.status(404).json({
          error: 'Slides not found',
          message: 'The requested slides do not exist'
        });
      }
      
      const slidesData = JSON.parse(fs.readFileSync(slidesPath, 'utf8'));
      
      // Generate PPTX file
      const pptxBuffer = await outputGenerator.createPPTX(slidesData.slides);
      
      // Send file as response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.setHeader('Content-Disposition', `attachment; filename="presentation-${slidesId}.pptx"`);
      res.send(pptxBuffer);
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Generate PDF from script
   */
  generatePDF: async (req, res, next) => {
    try {
      const { scriptId } = req.params;
      const scriptPath = path.join(__dirname, `../../uploads/scripts/${scriptId}.json`);
      
      if (!fs.existsSync(scriptPath)) {
        return res.status(404).json({
          error: 'Script not found',
          message: 'The requested script does not exist'
        });
      }
      
      const scriptData = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
      
      // Generate PDF file
      const pdfBuffer = await outputGenerator.createPDF(scriptData.content);
      
      // Send file as response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="script-${scriptId}.pdf"`);
      res.send(pdfBuffer);
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update script content
   */
  updateScript: async (req, res, next) => {
    try {
      const { scriptId } = req.params;
      const { content } = req.body;
      
      const scriptPath = path.join(__dirname, `../../uploads/scripts/${scriptId}.json`);
      
      if (!fs.existsSync(scriptPath)) {
        return res.status(404).json({
          error: 'Script not found',
          message: 'The requested script does not exist'
        });
      }
      
      // Load existing script
      const scriptData = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
      
      // Update content
      scriptData.content = content;
      scriptData.updatedAt = new Date().toISOString();
      
      // Save updated script
      fs.writeFileSync(
        scriptPath,
        JSON.stringify(scriptData, null, 2)
      );
      
      res.status(200).json({
        message: 'Script updated successfully',
        scriptId
      });
      
    } catch (error) {
      next(error);
    }
  }
};

module.exports = generationController;