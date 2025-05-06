import React, { useState } from 'react';
import FileUpload from './FileUpload';
import apiService from '../services/apiService';

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
      // Create form data for file upload
      const formData = new FormData();
      
      // Add text content if provided
      if (textContent) {
        formData.append('textContent', textContent);
      }
      
      // Add uploaded files if any
      uploadedFiles.forEach((file, index) => {
        formData.append('documents', file);
      });
      
      // Process content through API
      const response = await apiService.processContent(formData);
      
      if (response && response.data) {
        onComplete(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Content processing error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process content');
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
        multiple={true}
      />

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          <h4>Selected Files:</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                <button 
                  type="button" 
                  className="remove-btn" 
                  onClick={() => {
                    const newFiles = [...uploadedFiles];
                    newFiles.splice(index, 1);
                    setUploadedFiles(newFiles);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}

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