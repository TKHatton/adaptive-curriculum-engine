import React, { useState } from 'react';

function WritingSamples({ samples, onUpdate, onContinue }) {
  const [currentSample, setCurrentSample] = useState('');
  const [requirements, setRequirements] = useState('');

  const addSample = () => {
    if (currentSample.trim()) {
      onUpdate([...samples, {
        id: Date.now(),
        text: currentSample,
        wordCount: currentSample.split(' ').length
      }]);
      setCurrentSample('');
    }
  };

  const removeSample = (id) => {
    onUpdate(samples.filter(sample => sample.id !== id));
  };

  return (
    <div className="card">
      <h2>Writing Style</h2>
      <p>Upload writing samples to match your teaching voice (optional).</p>

      <div className="form-group">
        <label className="form-label">Add Writing Sample</label>
        <textarea
          className="form-control"
          value={currentSample}
          onChange={(e) => setCurrentSample(e.target.value)}
          placeholder="Paste a sample of your writing style..."
          rows="6"
        />
        <button 
          className="btn" 
          style={{ marginTop: '0.5rem' }}
          onClick={addSample}
        >
          Add Sample
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Presentation Requirements</label>
        <textarea
          className="form-control"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Describe the tone and style you want for your presentation..."
          rows="4"
        />
      </div>

      {samples.length > 0 && (
        <div className="form-group">
          <label className="form-label">Current Writing Samples:</label>
          {samples.map(sample => (
            <div key={sample.id} className="sample-item">
              <span>Sample {samples.indexOf(sample) + 1}: {sample.wordCount} words</span>
              <button 
                className="remove-btn"
                onClick={() => removeSample(sample.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onContinue}>
          Continue to Generation
        </button>
      </div>
    </div>
  );
}

export default WritingSamples;