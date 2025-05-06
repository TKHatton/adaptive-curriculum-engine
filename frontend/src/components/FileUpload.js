import React, { useState, useRef } from 'react';

function FileUpload({ onFileSelect, acceptedFormats = ['.pdf', '.docx', '.txt'] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    // Filter files by accepted formats
    const validFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return acceptedFormats.includes(extension);
    });

    if (validFiles.length !== selectedFiles.length) {
      alert(`Only ${acceptedFormats.join(', ')} files are accepted`);
    }

    // Update state with new files
    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);
    
    // Call parent callback
    onFileSelect(validFiles);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="upload-message">
          Upload {acceptedFormats.join(', ')} files
        </p>
        <button 
          type="button" 
          className="btn" 
          onClick={handleButtonClick}
        >
          Choose Files
        </button>
        <input 
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          multiple
          accept={acceptedFormats.join(',')}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                <button 
                  type="button" 
                  className="remove-btn" 
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUpload;