import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Chip
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  ZoomIn,
  ZoomOut,
  Refresh
} from '@mui/icons-material';

const PDFNavigationBar = ({
  pageNumber,
  numPages,
  scale,
  previousPage,
  nextPage,
  zoomIn,
  zoomOut,
  resetZoom
}) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={previousPage}
            disabled={pageNumber <= 1}
            color="primary"
          >
            <NavigateBefore />
          </IconButton>
          
          <Chip
            label={`Page ${pageNumber} of ${numPages || 0}`}
            variant="outlined"
          />
          
          <IconButton
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 0)}
            color="primary"
          >
            <NavigateNext />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={zoomOut} color="primary">
            <ZoomOut />
          </IconButton>
          
          <Chip label={`${Math.round(scale * 100)}%`} variant="outlined" />
          
          <IconButton onClick={resetZoom} color="primary">
            <Refresh />
          </IconButton>
          
          <IconButton onClick={zoomIn} color="primary">
            <ZoomIn />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PDFNavigationBar;
