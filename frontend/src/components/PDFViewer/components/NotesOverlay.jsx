import React, { useState } from 'react';

const NotesOverlay = ({ 
  pdfPageDimensions, 
  scale, 
  isNotesMode,
  notes = [],
  onAddNote,
  onDeleteNote,
  onEditNote
}) => {
  const [newNotePos, setNewNotePos] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  const handlePdfClick = (e) => {
    if (!isNotesMode || !pdfPageDimensions) return;
    
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    const normalizedX = Math.max(0, Math.min(x, pdfPageDimensions.width));
    const normalizedY = Math.max(0, Math.min(y, pdfPageDimensions.height));
    
    setNewNotePos({ x: normalizedX, y: normalizedY });
    setNewNoteContent('');
    setViewingNote(null);
    setEditingNote(null);
  };

  const createNote = () => {
    if (newNoteContent.trim()) {
      onAddNote({
        x: newNotePos.x,
        y: newNotePos.y,
        content: newNoteContent.trim()
      });
      setNewNotePos(null);
      setNewNoteContent('');
    }
  };

  const handleNoteClick = (e, note) => {
    e.stopPropagation();
    setViewingNote(note);
    setNewNotePos(null);
    setEditingNote(null);
  };

  const startEdit = (note) => {
    setEditingNote({ ...note });
    setViewingNote(null);
  };

  const saveEdit = () => {
    if (editingNote.content.trim()) {
      onEditNote(editingNote);
      setEditingNote(null);
    }
  };

  const confirmDelete = (note) => {
    if (window.confirm(`Delete this note?\n\n"${note.content.substring(0, 50)}..."`)) {
      onDeleteNote(note.id);
      setViewingNote(null);
    }
  };

  if (!pdfPageDimensions) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: pdfPageDimensions.width * scale,
        height: pdfPageDimensions.height * scale,
        pointerEvents: isNotesMode ? 'all' : 'none',
        cursor: isNotesMode ? 'crosshair' : 'default',
        zIndex: 15
      }}
      onClick={handlePdfClick}
    >
      {/* Note Markers */}
      {notes.map((note) => (
        <div key={note.id}>
          <div
            style={{
              position: 'absolute',
              left: note.x * scale - 12,
              top: note.y * scale - 24,
              width: '24px',
              height: '24px',
              backgroundColor: '#ff6b35',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 3px 12px rgba(255, 107, 53, 0.4)',
              border: '3px solid white',
              transform: viewingNote?.id === note.id ? 'scale(1.2)' : 'scale(1)',
              zIndex: 1001
            }}
            onClick={(e) => handleNoteClick(e, note)}
          >
            📌
          </div>
        </div>
      ))}

      {/* View Note Popup */}
      {viewingNote && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(viewingNote.x * scale + 30, pdfPageDimensions.width * scale - 350),
            top: Math.max(viewingNote.y * scale - 40, 20),
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '2px solid #ff6b35',
            maxWidth: '350px',
            minWidth: '280px',
            zIndex: 1004
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#ff6b35'
            }}>
              📝 Note Details
            </div>
            <button
              onClick={() => setViewingNote(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ 
            fontSize: '14px', 
            lineHeight: '1.6',
            marginBottom: '15px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {viewingNote.content}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => startEdit(viewingNote)}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              ✏️ Edit Note
            </button>
            <button
              onClick={() => confirmDelete(viewingNote)}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              🗑️ Delete
            </button>
          </div>

          <div style={{
            fontSize: '11px',
            color: '#6c757d',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid #eee'
          }}>
            {viewingNote.createdAt ? new Date(viewingNote.createdAt).toLocaleString() : 'Just now'}
          </div>
        </div>
      )}

      {/* Edit Note Dialog */}
      {editingNote && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(editingNote.x * scale + 30, pdfPageDimensions.width * scale - 350),
            top: Math.max(editingNote.y * scale - 40, 20),
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: '2px solid #ffc107',
            maxWidth: '350px',
            minWidth: '300px',
            zIndex: 1004
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#ffc107',
            marginBottom: '15px'
          }}>
            ✏️ Edit Note
          </div>

          <textarea
            value={editingNote.content}
            onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              resize: 'vertical',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '15px'
            }}
            autoFocus
          />

          <div style={{ 
            fontSize: '12px', 
            color: '#6c757d', 
            marginBottom: '15px',
            textAlign: 'right'
          }}>
            {editingNote.content.length} characters
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => setEditingNote(null)}
              style={{
                padding: '8px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={!editingNote.content.trim()}
              style={{
                padding: '8px 20px',
                backgroundColor: editingNote.content.trim() ? '#ffc107' : '#e9ecef',
                color: editingNote.content.trim() ? '#000' : '#6c757d',
                border: 'none',
                borderRadius: '6px',
                cursor: editingNote.content.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Create Note Dialog (keep existing) */}
      {newNotePos && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(newNotePos.x * scale + 25, pdfPageDimensions.width * scale - 320),
            top: Math.max(newNotePos.y * scale - 30, 20),
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '2px solid #28a745',
            minWidth: '300px',
            zIndex: 1004
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
            📝 Add New Note
          </div>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Enter your note here..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #28a745',
              borderRadius: '8px',
              resize: 'vertical',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '15px'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setNewNotePos(null)}
              style={{
                padding: '8px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={createNote}
              disabled={!newNoteContent.trim()}
              style={{
                padding: '8px 20px',
                backgroundColor: newNoteContent.trim() ? '#28a745' : '#e9ecef',
                color: newNoteContent.trim() ? 'white' : '#6c757d',
                border: 'none',
                borderRadius: '6px',
                cursor: newNoteContent.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesOverlay;
