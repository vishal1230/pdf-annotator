import { useState, useCallback } from 'react';

export const useDrawingManager = (uuid, pageNumber) => {
  const [drawings, setDrawings] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const loadDrawings = useCallback(async () => {
    if (!uuid || !pageNumber) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/drawing/${uuid}/page/${pageNumber}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDrawings(data.drawings?.[0]?.drawingData || []);
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
      setDrawings([]);
    }
  }, [uuid, pageNumber]);

  const saveDrawing = useCallback(async (paths) => {
    if (!paths || paths.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const drawingData = {
        pdfUuid: uuid,
        pageNumber: pageNumber,
        drawingData: paths,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/drawing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawingData)
      });

      if (response.ok) {
        setDrawings(paths);
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  }, [uuid, pageNumber]);

  const toggleDrawingMode = () => setIsDrawingMode(!isDrawingMode);

  return {
    drawings,
    isDrawingMode,
    loadDrawings,
    saveDrawing,
    toggleDrawingMode,
    setDrawings
  };
};
