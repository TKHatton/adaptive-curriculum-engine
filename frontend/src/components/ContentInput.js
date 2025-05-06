import React, { useState } from 'react';
import FileUpload from './FileUpload';

function ContentInput({ onComplete }) {
  const [textContent, setTextContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleProcess = async () => {
    if (!textContent && uploadedFiles.length === 0) {
      setError('Please provide content through upload or text input');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Process content through API
      const response = await fetch('/api/content/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textContent,
          files: uploadedFiles
        })
      });

      const data = await response.json();
      onComplete(data);
    } catch (err) {
      setError('Failed to process content');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="card">
      <h2>Course Content</h2>
      <p>Upload your course materials or enter content directly.</p>

      <FileUpload
        onFileSelect={handleFileUpload}
        acceptedFormats={['.pdf', '.docx', '.txt']}
      />

      <div className="form-group">
        <label className="form-label">Or enter content directly:</label>
        <textarea
          className="form-control"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste your course outline, lesson content, or teaching materials here..."
          rows="8"
        />
      </div>

      {error && <div className="status-message status-error">{error}</div>}

      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleProcess}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Process Content'}
        </button>
      </div>
    </div>
  );
}

export default ContentInput;