const express = require('express');
const router = express.Router();

const contentController = require('../controllers/contentController');
const writingController = require('../controllers/writingController');
const generationController = require('../controllers/generationController');

// Content processing routes
router.post('/content/process', contentController.processContent);
router.post('/content/process', fileHandler.documents, contentController.process);
router.get('/content/:contentId', contentController.getContent);

// Writing sample routes
router.post('/writing/samples', writingController.saveWritingSamples);
router.get('/writing/:profileId', writingController.getWritingProfile);
router.put('/writing/:profileId', writingController.updateWritingProfile);

// Script generation routes
router.post('/generate/script', generationController.generateScript);
router.put('/script/:scriptId', generationController.updateScript);
router.get('/script/:scriptId/pdf', generationController.generatePDF);

// Slide generation routes
router.post('/generate/slides', generationController.generateSlides);
router.get('/slides/:slidesId/pptx', generationController.generatePPTX);

module.exports = router;