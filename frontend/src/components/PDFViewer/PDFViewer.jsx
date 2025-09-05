import React from 'react';
import { Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import { usePDFLoader } from './hooks/usePDFLoader';
import { useAnnotations } from './hooks/useAnnotations';
import PDFSidebar from './components/PDFSidebar';
import PDFNavigationBar from './components/PDFNavigationBar';
import PDFDisplayArea from './components/PDFDisplayArea';

// Configure PDF.js worker - CRITICAL for PDF loading
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { uuid } = useParams();
  
  const {
    pdfUrl,
    numPages,
    pageNumber,
    scale,
    loading,
    error,
    pdfPageDimensions,
    setPageNumber,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    onPageLoadSuccess,
    previousPage,
    nextPage,
    zoomIn,
    zoomOut,
    resetZoom
  } = usePDFLoader(uuid);

  const {
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
  } = useAnnotations(uuid, pageNumber, pdfUrl,setPageNumber);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <div>Loading PDF...</div>
      </Box>
    );
  }

  if (error && !pdfUrl) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <div>Error: {error}</div>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', p: 0 }}>
      <PDFSidebar
        searchString={searchString}
        setSearchString={setSearchString}
        searchResults={searchResults}
        highlightSearchResults={highlightSearchResults}
        setHighlightSearchResults={setHighlightSearchResults}
        jumpToSearchResult={jumpToSearchResult}
        pageNumber={pageNumber}
        isDrawingMode={isDrawingMode}
        toggleDrawingMode={toggleDrawingMode}
        isNotesMode={isNotesMode}
        toggleNotesMode={toggleNotesMode}
        notes={notes}
        highlights={highlights}
        selectedText={selectedText}
        createHighlight={createHighlight}
        deleteHighlight={deleteHighlight}
        handleDeleteNote={handleDeleteNote}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClearDrawing={handleClearDrawing}
        handleManualSave={handleManualSave}
        handleLoadDrawings={handleLoadDrawings}
      />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PDFNavigationBar
          pageNumber={pageNumber}
          numPages={numPages}
          scale={scale}
          previousPage={previousPage}
          nextPage={nextPage}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
        />
        
        <PDFDisplayArea
          pdfUrl={pdfUrl}
          pageNumber={pageNumber}
          scale={scale}
          numPages={numPages}
          pdfPageDimensions={pdfPageDimensions}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onDocumentLoadError={onDocumentLoadError}
          onPageLoadSuccess={onPageLoadSuccess}
          handleTextSelection={handleTextSelection}
          highlightPattern={highlightPattern}
          highlightSearchResults={highlightSearchResults}
          searchString={searchString}
          isDrawingMode={isDrawingMode}
          isNotesMode={isNotesMode}
          drawings={drawings}
          notes={notes}
          canvasRef={canvasRef}
          handleSaveDrawing={handleSaveDrawing}
          handleAddNote={handleAddNote}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
        />
      </Box>
    </Container>
  );
};

export default PDFViewer;
