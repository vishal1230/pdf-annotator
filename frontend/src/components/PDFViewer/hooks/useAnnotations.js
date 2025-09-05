import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { pdfjs } from 'react-pdf';

export const useAnnotations = (uuid, pageNumber, pdfUrl, setPageNumber) => {
  const canvasRef = useRef(null);
  
  const [highlights, setHighlights] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightSearchResults, setHighlightSearchResults] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isNotesMode, setIsNotesMode] = useState(false);

  // Load annotations when uuid or page changes
  const loadAnnotations = useCallback(async () => {
    if (!uuid || !pageNumber) return;
    try {
      const token = localStorage.getItem('token');
      const [highlightRes, drawingRes, noteRes] = await Promise.all([
        fetch(`http://localhost:5000/api/highlight/${uuid}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/drawing/${uuid}/page/${pageNumber}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/note/${uuid}/page/${pageNumber}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (highlightRes.ok) {
        const highlightData = await highlightRes.json();
        setHighlights(highlightData.highlights || []);
      }
      if (drawingRes.ok) {
        const drawingData = await drawingRes.json();
        setDrawings(drawingData?.drawings?.[0]?.drawingData || []);
      }
      if (noteRes.ok) {
        const noteData = await noteRes.json();
        setNotes(noteData.notes || []);
      }
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  }, [uuid, pageNumber]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // Fixed search functionality
  useEffect(() => {
    if (!pdfUrl || !searchString.trim()) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        const pdf = await pdfjs.getDocument({ url: pdfUrl }).promise;
        const pages = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map(item => item.str).join(' ');
          pages.push({ pageNumber: i, text });
        }

        const results = [];
        const regex = new RegExp(searchString.trim(), 'gi');
        
        pages.forEach(page => {
          const matches = page.text.match(regex);
          if (matches && matches.length > 0) {
            results.push({ 
              pageNumber: page.pageNumber, 
              matchCount: matches.length, 
              preview: page.text.substring(0, 100) + '...' 
            });
          }
        });
        
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [pdfUrl, searchString]);

  const handleTextSelection = () => {
    if (isDrawingMode || isNotesMode) return;
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      setSelectedText(text.length > 1 ? text : '');
    }, 200);
  };

  // Fixed highlight pattern function
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const highlightPattern = (text, pattern) => {
    if (!pattern || !pattern.trim() || !highlightSearchResults) {
      return text;
    }
    
    const escapedPattern = escapeRegExp(pattern.trim());
    const regex = new RegExp(`(${escapedPattern})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return React.createElement('mark', {
          key: index,
          style: {
            backgroundColor: '#ffe066',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '2px',
            padding: '0 2px'
          }
        }, part);
      }
      return part;
    });
  };

  const jumpToSearchResult = (page) => {
    setPageNumber(page);
    setHighlightSearchResults(true);
  };

  // Create highlight
  const createHighlight = async () => {
    if (!selectedText) return;
    try {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;

      const highlightData = {
        pdfUuid: uuid,
        pageNumber: pageNumber,
        highlightedText: selectedText,
        comment: `Highlighted on page ${pageNumber}`,
        position: { page: pageNumber },
        color: '#ffff00',
        createdAt: new Date().toISOString()
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/highlight', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(highlightData)
      });

      if (response.ok) {
        const data = await response.json();
        setHighlights(prev => [...prev, data.highlight]);
        setSelectedText('');
        selection.removeAllRanges();
      }
    } catch (error) {
      console.error('Error creating highlight:', error);
    }
  };

  const deleteHighlight = async (highlightId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/highlight/${highlightId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setHighlights(prev => prev.filter(h => h._id !== highlightId));
      }
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  // Other handlers (notes, drawings) - keeping your existing implementations
  const handleAddNote = async (noteData) => {
    try {
      const token = localStorage.getItem('token');
      const notePayload = {
        pdfUuid: uuid,
        pageNumber: pageNumber,
        x: noteData.x,
        y: noteData.y,
        content: noteData.content,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notePayload)
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [...prev, data.note]);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async (noteData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/note/${noteData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteData.content,
          updatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => 
          prev.map(note => 
            note._id === noteData.id ? data.note : note
          )
        );
      }
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/note/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setNotes(prev => prev.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Drawing handlers
  const handleSaveDrawing = async (paths) => {
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
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  const handleClearDrawing = async () => {
    if (!canvasRef.current) return;
    
    if (window.confirm('Clear all drawings on this page?')) {
      canvasRef.current.clearCanvas();
      setDrawings([]);
      await handleSaveDrawing([]);
    }
  };

  const handleManualSave = async () => {
    if (!canvasRef.current) return;

    try {
      const paths = await canvasRef.current.exportPaths();
      if (!paths || paths.length === 0) {
        alert('Please draw something first');
        return;
      }
      
      await handleSaveDrawing(paths);
      alert('Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const handleLoadDrawings = async () => {
    if (!canvasRef.current) return;

    try {
      await loadAnnotations();
      if (drawings.length > 0) {
        await canvasRef.current.loadPaths(drawings);
        alert('Drawings loaded successfully!');
      } else {
        alert('No saved drawings found');
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  };

  const toggleDrawingMode = () => setIsDrawingMode(!isDrawingMode);
  const toggleNotesMode = () => setIsNotesMode(!isNotesMode);

  return {
    highlights,
    drawings,
    notes,
    selectedText,
    searchString,
    searchResults,
    highlightSearchResults,
    isDrawingMode,
    isNotesMode,
    canvasRef,
    setSearchString,
    setHighlightSearchResults,
    handleTextSelection,
    highlightPattern,
    jumpToSearchResult,
    toggleDrawingMode,
    toggleNotesMode,
    createHighlight,
    deleteHighlight,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleSaveDrawing,
    handleUndo,
    handleRedo,
    handleClearDrawing,
    handleManualSave,
    handleLoadDrawings
  };
};

export default useAnnotations;
