import { useState, useCallback } from 'react';

export const useNotesManager = (uuid, pageNumber) => {
  const [notes, setNotes] = useState([]);
  const [isNotesMode, setIsNotesMode] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!uuid || !pageNumber) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/note/${uuid}/page/${pageNumber}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    }
  }, [uuid, pageNumber]);

  const addNote = useCallback(async (noteData) => {
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
  }, [uuid, pageNumber]);

  const editNote = useCallback(async (noteData) => {
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
        setNotes(prev => prev.map(note => 
          note._id === noteData.id ? data.note : note
        ));
      }
    } catch (error) {
      console.error('Error editing note:', error);
    }
  }, []);

  const deleteNote = useCallback(async (noteId) => {
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
  }, []);

  const toggleNotesMode = () => setIsNotesMode(!isNotesMode);

  return {
    notes,
    isNotesMode,
    loadNotes,
    addNote,
    editNote,
    deleteNote,
    toggleNotesMode
  };
};
