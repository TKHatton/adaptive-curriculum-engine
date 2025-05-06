const { OpenAI } = require('openai');
require('dotenv').config();

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ Warning: OPENAI_API_KEY is not set. AI features will fail.');
}

const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// Default model options
const DEFAULT_MODEL = 'gpt-4';
const MAX_TOKENS = 4000;

const aiService = {
  /**
   * Create prompt for script generation
   */
  createScriptPrompt: (content, writingProfile, options = {}) => {
    // Set default options if not provided
    const scriptOptions = {
      length: options.length || 'medium',
      style: options.style || 'conversational',
      elements: options.elements || {
        introduction: true,
        transitions: true,
        examples: true,
        questions: true,
        summary: true
      },
      techniques: options.techniques || {
        storytelling: true,
        analogies: true,
        repetition: true,
        demonstrations: false
      },
      pacing: options.pacing || 'moderate'
    };

    // Build the prompt
    let prompt = `
    Create a comprehensive instructor script based on this content:
    ${content}
    
    The script should:
    - Be ${scriptOptions.length} length (short: 10-15 min, medium: 20-30 min, long: 45+ min)
    - Use a ${scriptOptions.style} teaching style
    `;

    // Add writing style if profile provided
    if (writingProfile && writingProfile.samples && writingProfile.samples.length > 0) {
      prompt += `\n\nMatch this writing style from these samples:\n`;
      writingProfile.samples.forEach(sample => {
        prompt += `SAMPLE: ${sample.text}\n\n`;
      });
    }

    // Add presentation requirements if provided
    if (writingProfile && writingProfile.requirements) {
      prompt += `\nPresentation requirements: ${writingProfile.requirements}\n`;
    }

    // Add elements to include
    prompt += `\nRequired Elements:\n`;
    Object.entries(scriptOptions.elements)
      .filter(([_, include]) => include)
      .forEach(([element]) => {
        prompt += `- ${element}\n`;
      });

    // Add teaching techniques
    prompt += `\nTeaching Techniques to Include:\n`;
    Object.entries(scriptOptions.techniques)
      .filter(([_, include]) => include)
      .forEach(([technique]) => {
        prompt += `- ${technique}\n`;
      });

    // Add formatting instructions
    prompt += `
    The script should include:
    1. Word-for-word teaching dialogue with natural language flow
    2. [Pause points] for questions and reflection
    3. {Key concepts} in brackets for emphasis
    4. Transition phrases between sections
    5. Interactive elements for engagement
    6. Real-world examples and analogies
    7. Summary statements and key takeaways
    
    Ensure the script sounds natural, conversational, and matches the instructor's voice.
    Make it comprehensive - better to have too much content than not enough.
    `;

    return prompt;
  },

  /**
   * Create prompt for slides generation
   */
  createSlidesPrompt: (content, sourceType = 'content', options = {}) => {
    // Set default options if not provided
    const slideOptions = {
      slideCount: options.slideCount || 'auto',
      contentDensity: options.contentDensity || 'balanced',
      visualStyle: options.visualStyle || 'minimal',
      includeNotes: options.includeNotes !== false
    };

    // Build the prompt
    let prompt = `
    Create a comprehensive slide deck from this ${sourceType}:
    ${content}
    
    Slide Requirements:
    - Create ${slideOptions.slideCount === 'auto' ? 'appropriate number of' : slideOptions.slideCount} slides
    - Use ${slideOptions.contentDensity} content density (light: 1-3 points, balanced: 3-5 points, dense: 5-7 points)
    - Apply ${slideOptions.visualStyle} visual style
    - Include speaker notes: ${slideOptions.includeNotes ? 'Yes' : 'No'}
    
    Each slide should contain:
    1. Clear, concise title
    2. Properly structured bullet points or content
    3. [Visual placeholder] descriptions for images/diagrams
    4. Speaker notes with additional context (if required)
    5. Smooth transitions between topics
    
    Ensure slides are:
    - Visually balanced with proper white space
    - Readable with appropriate text size
    - Logically sequenced for natural flow
    - Comprehensive enough to stand alone if needed
    
    Format the response as a JSON array with this structure:
    [
      {
        "title": "Slide Title",
        "content": [
          {"type": "text", "text": "Bullet point 1"},
          {"type": "text", "text": "Bullet point 2"},
          {"type": "image", "description": "Description of image to include"}
        ],
        "speakerNotes": "Notes for the presenter"
      }
    ]
    `;

    return prompt;
  },

  /**
   * Generate script using OpenAI
   */
  generateScript: async (prompt) => {
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script. Please try again later.');
    }
  },

  /**
   * Generate slides using OpenAI
   */
  generateSlides: async (prompt) => {
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      });

      const slidesText = response.choices[0].message.content.trim();
      
      // Extract JSON from the response
      const jsonMatch = slidesText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid slides format received from AI');
      }

      console.debug('Raw slides output:', slidesText);

      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing slides JSON:', parseError);
        
        // Attempt to clean and parse the response
        const cleanedJson = slidesText
          .replace(/^```json/g, '')
          .replace(/```$/g, '')
          .trim();
          
        return JSON.parse(cleanedJson);
      }
    } catch (error) {
      console.error('Error generating slides:', error);
      throw new Error('Failed to generate slides. Please try again later.');
    }
  }
};

module.exports = aiService;