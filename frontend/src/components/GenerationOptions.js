import React, { useState } from 'react';

function GenerationOptions({ contentData, writingSamples, onGenerate }) {
  const [generating, setGenerating] = useState('');
  const [scriptOptions, setScriptOptions] = useState({
    length: 'medium',
    style: 'conversational',
    elements: {
      introduction: true,
      transitions: true,
      examples: true,
      questions: true,
      summary: true,
      handouts: false
    },
    techniques: {
      storytelling: false,
      analogies: true,
      repetition: true,
      demonstrations: false
    },
    pacing: 'moderate'
  });

  const [slideOptions, setSlideOptions] = useState({
    slideCount: 'auto',
    contentDensity: 'balanced',
    visualStyle: 'minimal',
    includeNotes: true,
    animationLevel: 'none',
    layoutPreference: 'text-focused'
  });

  const generateScript = async () => {
    setGenerating('script');
    
    try {
      const response = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: contentData.contentId,
          profileId: writingSamples.profileId,
          options: scriptOptions 
        })
      });
      
      const data = await response.json();
      onGenerate({ script: data.script });
    } catch (error) {
      console.error('Script generation failed:', error);
    } finally {
      setGenerating('');
    }
  };

  const generateSlides = async () => {
    setGenerating('slides');
    
    try {
      const response = await fetch('/api/generate/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: contentData.contentId,
          options: slideOptions 
        })
      });
      
      const data = await response.json();
      onGenerate({ slides: data.slides });
    } catch (error) {
      console.error('Slide generation failed:', error);
    } finally {
      setGenerating('');
    }
  };

  const generateBoth = async () => {
    setGenerating('both');
    
    try {
      // Generate slides first
      const slidesResponse = await fetch('/api/generate/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: contentData.contentId,
          options: slideOptions 
        })
      });
      
      const slidesData = await slidesResponse.json();
      
      // Then generate script
      const scriptResponse = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: contentData.contentId,
          profileId: writingSamples.profileId,
          options: scriptOptions,
          slidesId: slidesData.slidesId // Pass slides ID for reference
        })
      });
      
      const scriptData = await scriptResponse.json();
      
      // Return both results
      onGenerate({ 
        slides: slidesData.slides,
        script: scriptData.script
      });
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating('');
    }
  };

  return (
    <div className="card">
      <h2>Generate Materials</h2>
      <p>Choose what you'd like to create and customize the generation options.</p>

      <div className="status-message status-processing">
        Content processed successfully. Ready for generation.
      </div>

      <div className="options-grid">
        <div>
          <h3>Script Options</h3>
          
          <div className="form-group">
            <label className="form-label">Length</label>
            <select 
              className="form-control"
              value={scriptOptions.length}
              onChange={(e) => setScriptOptions({...scriptOptions, length: e.target.value})}
            >
              <option value="short">Short (10-15 min)</option>
              <option value="medium">Medium (20-30 min)</option>
              <option value="long">Long (45+ min)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Teaching Style</label>
            <select 
              className="form-control"
              value={scriptOptions.style}
              onChange={(e) => setScriptOptions({...scriptOptions, style: e.target.value})}
            >
              <option value="conversational">Conversational</option>
              <option value="academic">Academic</option>
              <option value="interactive">Interactive</option>
              <option value="storytelling">Storytelling</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Include Elements</label>
            {Object.keys(scriptOptions.elements).map(element => (
              <div key={element} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={scriptOptions.elements[element]}
                    onChange={(e) => setScriptOptions({
                      ...scriptOptions,
                      elements: {...scriptOptions.elements, [element]: e.target.checked}
                    })}
                  />
                  <span style={{ marginLeft: '0.5rem' }}>{element}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Slide Options</h3>
          
          <div className="form-group">
            <label className="form-label">Number of Slides</label>
            <select 
              className="form-control"
              value={slideOptions.slideCount}
              onChange={(e) => setSlideOptions({...slideOptions, slideCount: e.target.value})}
            >
              <option value="auto">Auto-determine</option>
              <option value="10">10 slides</option>
              <option value="15">15 slides</option>
              <option value="20">20 slides</option>
              <option value="30">30 slides</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Content Density</label>
            <select 
              className="form-control"
              value={slideOptions.contentDensity}
              onChange={(e) => setSlideOptions({...slideOptions, contentDensity: e.target.value})}
            >
              <option value="light">Light (1-3 points per slide)</option>
              <option value="balanced">Balanced (3-5 points per slide)</option>
              <option value="dense">Dense (5-7 points per slide)</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={slideOptions.includeNotes}
                onChange={(e) => setSlideOptions({...slideOptions, includeNotes: e.target.checked})}
              />
              <span style={{ marginLeft: '0.5rem' }}>Include speaker notes</span>
            </label>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={generateSlides}
          disabled={generating}
        >
          {generating === 'slides' ? 'Generating Slides...' : 'Generate Slides First'}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={generateScript}
          disabled={generating}
        >
          {generating === 'script' ? 'Generating Script...' : 'Generate Script'}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={generateBoth}
          disabled={generating}
        >
          {generating === 'both' ? 'Generating Both...' : 'Generate Both (Slides → Script)'}
        </button>
      </div>
    </div>
  );
}

export default GenerationOptions;