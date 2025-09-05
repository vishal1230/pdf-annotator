import React, { useEffect, useCallback } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const EnhancedDrawingOverlay = React.forwardRef(({ 
  pdfPageDimensions, 
  scale, 
  isDrawing, 
  onSaveDrawing,
  existingDrawings = []
}, ref) => {
  
  // Load existing drawings when canvas is ready
  useEffect(() => {
    const loadDrawingsToCanvas = async () => {
      if (ref.current && existingDrawings.length > 0) {
        console.log('🎨 Loading drawings to canvas:', existingDrawings);
        try {
          await ref.current.loadPaths(existingDrawings);
          console.log('✅ Drawings loaded successfully');
        } catch (error) {
          console.error('❌ Error loading drawings:', error);
        }
      }
    };

    const timer = setTimeout(loadDrawingsToCanvas, 200);
    return () => clearTimeout(timer);
  }, [existingDrawings, ref, isDrawing]);

  const handlePathsChange = useCallback((paths) => {
    if (paths && paths.length > 0) {
      onSaveDrawing(paths);
    }
  }, [onSaveDrawing]);

  if (!pdfPageDimensions || !isDrawing) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: pdfPageDimensions.width * scale,
      height: pdfPageDimensions.height * scale,
      pointerEvents: isDrawing ? 'all' : 'none',
      zIndex: 10,
      border: '2px dashed #007bff',
      borderRadius: '4px'
    }}>
      <ReactSketchCanvas
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        strokeWidth={2}
        strokeColor="#FF0000"
        canvasColor="transparent"
        backgroundImage=""
        exportWithBackgroundImage={false}
        preserveBackgroundImageAspectRatio="xMidYMid meet"
        onUpdate={handlePathsChange}
      />
    </div>
  );
});

export default EnhancedDrawingOverlay;
