import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {
  Search,
  Brush,
  StickyNote2,
  Highlight,
  Delete,
  ArrowBack,
  Undo,
  Redo,
  Save,
  Download,
  InfoOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PDFSidebar = ({
  searchString,
  setSearchString,
  searchResults,
  highlightSearchResults,
  setHighlightSearchResults,
  jumpToSearchResult,
  pageNumber,
  isDrawingMode,
  toggleDrawingMode,
  isNotesMode,
  toggleNotesMode,
  notes,
  highlights,
  selectedText,
  createHighlight,
  handleDeleteNote,
  deleteHighlight,
  handleUndo,
  handleRedo,
  handleClearDrawing,
  handleManualSave,
  handleLoadDrawings
}) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 320,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100vh',
          overflowY: 'auto'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          fullWidth
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Back to Library
        </Button>

        {/* Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Search />
              <Typography variant="h6" component="div">Search PDF</Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search text in PDF..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={highlightSearchResults}
                  onChange={(e) => setHighlightSearchResults(e.target.checked)}
                />
              }
              label="Highlight search results"
            />
            {searchString.trim() && searchResults.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom component="div">
                  Found {searchResults.reduce((total, result) => total + result.matchCount, 0)} matches
                </Typography>
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: result.pageNumber === pageNumber ? '2px solid' : '1px solid',
                      borderColor: result.pageNumber === pageNumber ? 'primary.main' : 'grey.300'
                    }}
                    onClick={() => jumpToSearchResult(result.pageNumber)}
                  >
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight="bold" component="div">
                        Page {result.pageNumber} ({result.matchCount} match{result.matchCount !== 1 ? 'es' : ''})
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Drawing Tools */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
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
                      startIcon={<Delete />}
                      onClick={handleClearDrawing}
                      size="small"
                      sx={{ flex: 1 }}
                    >
                      Clear
                    </Button>
                  </Box>
                  
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
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption" component="div">
                    💡 <strong>Draw:</strong> Auto-saves • <strong>Undo/Redo:</strong> Navigate history • <strong>Save:</strong> Manual save • <strong>Clear:</strong> Remove all • <strong>Load:</strong> Restore
                  </Typography>
                </Alert>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
              <StickyNote2 sx={{ mr: 1 }} /> Custom Notes
            </Typography>
            <Button
              variant={isNotesMode ? "contained" : "outlined"}
              color={isNotesMode ? "error" : "secondary"}
              fullWidth
              onClick={toggleNotesMode}
              sx={{ mb: 2 }}
            >
              {isNotesMode ? '🔴 Exit Notes Mode' : '📝 Enable Notes Mode'}
            </Button>

            {isNotesMode && (
              <Alert severity="info" sx={{ mb: 2 }} icon={<InfoOutlined />}>
                <Typography variant="caption" component="div">
                  💡 Click anywhere on the PDF to add a note. Click pins to view/edit/delete.
                </Typography>
              </Alert>
            )}
            
            {notes.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom component="div">
                  📋 Notes on this page ({notes.length}):
                </Typography>
                <List dense>
                  {notes.map((note, index) => (
                    <ListItem 
                      key={note._id} 
                      sx={{
                        mb: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'secondary.light',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'secondary.lighter',
                          transform: 'translateY(-1px)',
                          boxShadow: 1
                        },
                        transition: 'all 0.2s ease'
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteNote(note._id)}
                          size="small"
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" color="secondary.main" component="div">
                            📌 Note #{index + 1}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" component="div">
                            {note.content.length > 50
                              ? note.content.substring(0, 50) + '...'
                              : note.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Highlights Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" component="div">
                <Highlight sx={{ mr: 1 }} /> Highlights
              </Typography>
              <Chip label={highlights.length} size="small" color="warning" />
            </Box>

            <Alert severity="info" sx={{ mb: 2 }} icon={<InfoOutlined />}>
              <Typography variant="body2" component="div">
                <strong>How to use:</strong><br />
                1. Select text on PDF by clicking & dragging<br />
                2. Click "Create Highlight" button<br />
                3. Highlight saves automatically
              </Typography>
            </Alert>
            
            {selectedText ? (
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: 'success.lighter', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'success.main'
              }}>
                <Typography variant="subtitle2" gutterBottom color="success.dark" component="div">
                  ✨ Text Selected
                </Typography>
                <Box sx={{ 
                  mb: 1, 
                  p: 1, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  maxHeight: 60,
                  overflowY: 'auto'
                }}>
                  <Typography variant="body2" component="div">
                    <strong>Selected:</strong> "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={createHighlight}
                  fullWidth
                >
                  ✅ Create Highlight
                </Button>
              </Box>
            ) : (
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'grey.300'
              }}>
                <Typography variant="body2" color="text.secondary" component="div">
                  📋 Select text in the PDF to highlight it
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {highlights.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography variant="h6" color="text.secondary" gutterBottom component="div">
                  📝 No highlights yet
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  Select text in the PDF to create your first highlight
                </Typography>
              </Box>
            ) : (
              <List dense>
                {highlights.map((highlight, index) => (
                  <ListItem 
                    key={highlight._id} 
                    sx={{
                      mb: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'warning.light',
                      borderRadius: 1,
                      boxShadow: 1
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteHighlight(highlight._id)}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                          <Typography variant="subtitle2" color="warning.dark" component="span">
                            💡 Highlight #{index + 1}
                          </Typography>
                          <Chip 
                            label={`Page ${highlight.pageNumber}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: 'warning.lighter', 
                          borderLeft: '3px solid',
                          borderColor: 'warning.main',
                          borderRadius: 1
                        }}>
                          <Typography variant="body2" component="div">
                            "{highlight.highlightedText.length > 60 
                              ? highlight.highlightedText.substring(0, 60) + '...' 
                              : highlight.highlightedText}"
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
};

export default PDFSidebar;
