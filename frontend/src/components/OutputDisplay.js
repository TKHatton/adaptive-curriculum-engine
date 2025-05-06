import React, { useState } from 'react';

function OutputDisplay({ outputs, onBack, onRegenerate }) {
  const [editingScript, setEditingScript] = useState(false);
  const [editedScript, setEditedScript] = useState(outputs.script?.content || '');

  const downloadPDF = (content, filename) => {
    // Convert to PDF and download
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPPTX = async (slidesData) => {
    // Convert slides to PPTX and download
    const response = await fetch('/api/generate/pptx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slidesData)
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation-slides.pptx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2>Generated Materials</h2>

      {outputs.script && (
        <div className="output-card">
          <div className="output-title">Instructor Script</div>
          {editingScript ? (
            <textarea
              className="form-control"
              value={editedScript}
              onChange={(e) => setEditedScript(e.target.value)}
              rows="15"
              style={{ fontFamily: 'monospace', marginBottom: '1rem' }}
            />
          ) : (
            <div className="preview-area">
              {outputs.script.content}
            </div>
          )}
          <div className="download-options">
            <button 
              className="btn"
              onClick={() => {
                if (editingScript) {
                  // Save changes
                  outputs.script.content = editedScript;
                }
                setEditingScript(!editingScript);
              }}
            >
              {editingScript ? 'Save' : 'Edit'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => downloadPDF(editedScript, 'instructor-script.pdf')}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {outputs.slides && (
        <div className="output-card">
          <div className="output-title">Presentation Slides</div>
          <div className="preview-area">
            {outputs.slides.content.map((slide, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <strong>Slide {index + 1}: {slide.title}</strong>
                <div style={{ marginLeft: '1rem' }}>
                  {slide.content.map((point, pointIndex) => (
                    <div key={pointIndex}>• {point}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="download-options">
            <button 
              className="btn btn-primary"
              onClick={() => downloadPPTX(outputs.slides)}
            >
              Download PPTX
            </button>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button className="btn" onClick={onBack}>
          Back to Options
        </button>
        <button className="btn" onClick={onRegenerate}>
          Regenerate
        </button>
      </div>
    </div>
  );
}

export default OutputDisplay;