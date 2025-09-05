import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import EnhancedDrawingOverlay from './EnhancedDrawingOverlay';
import NotesOverlay from './NotesOverlay';

const PDFDisplayArea = ({
  pdfUrl,
  pageNumber,
  scale,
  numPages,
  pdfPageDimensions,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  onPageLoadSuccess,
  handleTextSelection,
  highlightPattern,
  highlightSearchResults,
  searchString,
  isDrawingMode,
  isNotesMode,
  drawings,
  notes,
  canvasRef,
  handleSaveDrawing,
  handleAddNote,
  handleEditNote,
  handleDeleteNote
}) => {
  if (!pdfUrl) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flex={1}
        bgcolor="grey.100"
      >
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" component="div">No PDF loaded</Typography>
          <Typography color="text.secondary" component="div">
            Please wait while we load your document.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      overflow="auto"
      p={3}
      bgcolor="grey.100"
      onMouseUp={handleTextSelection}
      onKeyUp={handleTextSelection}
      tabIndex={0}
      sx={{ outline: 'none', textAlign: 'center' }}
    >
      <Paper
        elevation={4}
        sx={{
          display: 'inline-block',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography component="div">Loading PDF document...</Typography>
            </Box>
          }
          error={
            <Box sx={{ p: 8, textAlign: 'center', color: 'error.main' }}>
              <Typography component="div">Failed to load PDF</Typography>
            </Box>
          }
        >
          {numPages && (
            <Box position="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                renderMode="canvas"
                onLoadSuccess={onPageLoadSuccess}
                customTextRenderer={
                  highlightSearchResults && searchString && searchString.trim()
                    ? ({ str }) => highlightPattern(str, searchString)
                    : undefined
                }
                loading={<Typography component="div">Loading page {pageNumber}...</Typography>}
                error={
                  <Typography color="error" component="div">
                    Error loading page {pageNumber}
                  </Typography>
                }
              />

              <EnhancedDrawingOverlay
                ref={canvasRef}
                pdfPageDimensions={pdfPageDimensions}
                scale={scale}
                isDrawing={isDrawingMode}
                onSaveDrawing={handleSaveDrawing}
                existingDrawings={drawings}
              />

              <NotesOverlay
                pdfPageDimensions={pdfPageDimensions}
                scale={scale}
                isNotesMode={isNotesMode}
                notes={notes.map(note => ({
                  id: note._id,
                  x: note.x,
                  y: note.y,
                  content: note.content,
                  createdAt: note.createdAt
                }))}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
              />
            </Box>
          )}
        </Document>
      </Paper>
    </Box>
  );
};

export default PDFDisplayArea;
