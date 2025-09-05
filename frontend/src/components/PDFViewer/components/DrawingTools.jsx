import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  Brush,
  Undo,
  Redo,
  Clear,
  Save,
  Download
} from '@mui/icons-material';

const DrawingTools = ({ 
  isDrawingMode, 
  toggleDrawingMode, 
  handleUndo, 
  handleRedo, 
  handleClearDrawing, 
  handleManualSave, 
  handleLoadDrawings 
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Brush sx={{ mr: 1 }} /> Drawing Tools
        </Typography>
        
        <Button
          variant={isDrawingMode ? "contained" : "outlined"}
          color={isDrawingMode ? "error" : "primary"}
          fullWidth
          onClick={toggleDrawingMode}
          sx={{ mb: 2 }}
        >
          {isDrawingMode ? '🔴 Exit Drawing Mode' : '✏️ Enable Drawing Mode'}
        </Button>

        {isDrawingMode && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={1}>
              {/* Undo & Redo Row */}
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Undo />}
                  onClick={handleUndo}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Undo
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Redo />}
                  onClick={handleRedo}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Redo
                </Button>
              </Box>
              
              {/* Save & Clear Row */}
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  onClick={handleManualSave}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Clear />}
                  onClick={handleClearDrawing}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
              </Box>
              
              {/* Load Button */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Download />}
                onClick={handleLoadDrawings}
                fullWidth
                size="small"
              >
                📥 Load Saved Drawings
              </Button>
            </Stack>
            
            {/* Help Text */}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                💡 <strong>Draw on PDF:</strong> Auto-saves • <strong>Undo/Redo:</strong> Manage strokes • <strong>Save:</strong> Manual save • <strong>Clear:</strong> Remove all • <strong>Load:</strong> Restore saved
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DrawingTools;
