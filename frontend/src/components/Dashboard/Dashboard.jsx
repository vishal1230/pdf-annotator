import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PDFUpload from '../PDFViewer/PDFUpload';

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await api.get('/pdf/list');
      setPdfs(response.data.pdfs);
    } catch (error) {
      setError('Failed to fetch PDFs');
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await api.delete(`/pdf/${uuid}`);
        setPdfs(pdfs.filter(pdf => pdf.uuid !== uuid));
      } catch (error) {
        setError('Failed to delete PDF');
        console.error('Error deleting PDF:', error);
      }
    }
  };

  const handleRename = async (uuid, currentName) => {
    const newName = prompt('Enter new name:', currentName);
    if (newName && newName !== currentName) {
      try {
        await api.put(`/pdf/${uuid}/rename`, { newName });
        setPdfs(pdfs.map(pdf => 
          pdf.uuid === uuid ? { ...pdf, originalName: newName } : pdf
        ));
      } catch (error) {
        setError('Failed to rename PDF');
        console.error('Error renaming PDF:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading your PDFs...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My PDF Library</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? 'Cancel Upload' : 'Upload PDF'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showUpload && (
        <PDFUpload 
          onUploadSuccess={() => {
            setShowUpload(false);
            fetchPDFs();
          }}
        />
      )}

      {pdfs.length === 0 ? (
        <div className="text-center">
          <h3>No PDFs uploaded yet</h3>
          <p>Click "Upload PDF" to get started with your first document.</p>
        </div>
      ) : (
        <div className="pdf-grid">
          {pdfs.map((pdf) => (
            <div key={pdf.uuid} className="pdf-card">
              <h3>{pdf.originalName}</h3>
              <div className="pdf-info">
                <p>Size: {formatFileSize(pdf.fileSize)}</p>
                <p>Uploaded: {formatDate(pdf.createdAt)}</p>
              </div>
              <div className="pdf-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/pdf/${pdf.uuid}`)}
                >
                  Open
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleRename(pdf.uuid, pdf.originalName)}
                >
                  Rename
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(pdf.uuid, pdf.originalName)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
