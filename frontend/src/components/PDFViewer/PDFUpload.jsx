import React, { useState } from 'react';
import api from '../../services/api';

const PDFUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await api.post('/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(`Successfully uploaded: ${response.data.pdf.filename}`);
      
      // Reset file input
      event.target.value = '';
      
      // Call success callback after a short delay
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="upload-text">
        <h3>Upload a PDF File</h3>
        <p>Select a PDF file from your computer (max 10MB)</p>
      </div>

      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      <label htmlFor="pdf-upload" className="btn btn-primary">
        {uploading ? 'Uploading...' : 'Choose PDF File'}
      </label>
    </div>
  );
};

export default PDFUpload;
