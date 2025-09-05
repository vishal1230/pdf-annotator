import { useState, useEffect, useCallback } from 'react';

export const usePDFLoader = (uuid) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfPageDimensions, setPdfPageDimensions] = useState(null);

  const loadPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/pdf/${uuid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF: ' + error.message);
      setPdfUrl(null);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    loadPDF();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [loadPDF]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError('');
    setPageNumber(1);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    setError('Failed to load PDF document: ' + error.message);
    setNumPages(null);
  };

  const onPageLoadSuccess = (page) => {
    const { originalWidth, originalHeight } = page;
    setPdfPageDimensions({ width: originalWidth, height: originalHeight });
  };

  const previousPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const nextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.2);

  return {
    pdfUrl,
    numPages,
    pageNumber,
    scale,
    loading,
    error,
    pdfPageDimensions,
    setPageNumber,
    setScale,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    onPageLoadSuccess,
    previousPage,
    nextPage,
    zoomIn,
    zoomOut,
    resetZoom
  };
};
