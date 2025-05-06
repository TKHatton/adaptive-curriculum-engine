const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const writingController = {
  /**
   * Save writing samples for style matching
   */
  saveWritingSamples: async (req, res, next) => {
    try {
      const { samples, requirements } = req.body;
      
      if (!samples || !Array.isArray(samples) || samples.length === 0) {
        return res.status(400).json({
          error: 'No samples provided',
          message: 'Please provide at least one writing sample'
        });
      }
      
      if (!samples.every(s => s.text && typeof s.text === 'string')) {
        return res.status(400).json({
          error: 'Invalid sample format',
          message: 'Each sample must contain a text field of type string'
        });
      }
      
      // Generate unique profile ID
      const profileId = uuidv4();
      
      // Prepare samples object with metadata
      const writingProfile = {
        profileId,
        samples: samples.map((sample, index) => ({
          id: index + 1,
          text: sample.text,
          wordCount: sample.text.split(/\s+/).length
        })),
        requirements: requirements || '',
        createdAt: new Date().toISOString()
      };
      
      // Store writing profile
      const profilesPath = path.join(__dirname, '../../uploads/samples');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(profilesPath)) {
        fs.mkdirSync(profilesPath, { recursive: true });
      }
      
      // Save profile to file
      fs.writeFileSync(
        path.join(profilesPath, `${profileId}.json`),
        JSON.stringify(writingProfile, null, 2)
      );
      
      res.status(200).json({
        message: 'Writing samples saved successfully',
        profileId,
        sampleCount: samples.length
      });
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get writing profile by ID
   */
  getWritingProfile: async (req, res, next) => {
    try {
      const { profileId } = req.params;
      const profilePath = path.join(__dirname, `../../uploads/samples/${profileId}.json`);
      
      if (!fs.existsSync(profilePath)) {
        return res.status(404).json({
          error: 'Writing profile not found',
          message: 'The requested writing profile does not exist'
        });
      }
      
      let profile;
      try {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      } catch (err) {
        return res.status(500).json({
          error: 'Invalid JSON',
          message: 'Failed to parse profile JSON'
       });
    }

      res.status(200).json(profile);
      
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update writing profile
   */
  updateWritingProfile: async (req, res, next) => {
    try {
      const { profileId } = req.params;
      const { samples, requirements } = req.body;
      
      const profilePath = path.join(__dirname, `../../uploads/samples/${profileId}.json`);
      
      if (!fs.existsSync(profilePath)) {
        return res.status(404).json({
          error: 'Writing profile not found',
          message: 'The requested writing profile does not exist'
        });
      }
      
      // Load existing profile
      let profile;
      try {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      } catch (err) {
        return res.status(500).json({
          error: 'Invalid JSON',
          message: 'Failed to parse profile JSON'
    });
  }
      
      // Update profile
      if (samples && Array.isArray(samples)) {
        profile.samples = samples.map((sample, index) => ({
          id: index + 1,
          text: sample.text,
          wordCount: sample.text.split(/\s+/).length
        }));
      }
      
      if (requirements !== undefined) {
        profile.requirements = requirements;
      }
      
      profile.updatedAt = new Date().toISOString();
      
      // Save updated profile
      fs.writeFileSync(
        profilePath,
        JSON.stringify(profile, null, 2)
      );
      
      res.status(200).json({
        message: 'Writing profile updated successfully',
        profileId,
        sampleCount: profile.samples.length
      });
      
    } catch (error) {
      next(error);
    }
  }
};

module.exports = writingController;