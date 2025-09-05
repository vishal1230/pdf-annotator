import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Highlight,
  Delete,
  Check,
  InfoOutlined
} from '@mui/icons-material';

const HighlightsPanel = ({
  highlights,
  selectedText,
  createHighlight,
  deleteHighlight
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div">
            <Highlight sx={{ mr: 1 }} /> Highlights
          </Typography>
          <Chip label={highlights.length} size="small" color="warning" />
        </Box>

        {/* Usage Instructions */}
        <Alert severity="info" sx={{ mb: 2 }} icon={<InfoOutlined />}>
          <Typography variant="body2" component="div">
            <strong>How to use:</strong><br />
            1. Select text on the PDF by clicking and dragging<br />
            2. Click "Create Highlight" button that appears<br />
            3. Your highlight will be saved automatically
          </Typography>
        </Alert>
        
        {/* Text Selection Controls */}
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
              startIcon={<Check />}
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

        {/* Highlights List */}
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
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <List dense disablePadding>
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
                      <Box>
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: 'warning.lighter', 
                          borderLeft: '3px solid',
                          borderColor: 'warning.main',
                          borderRadius: 1,
                          mb: 1
                        }}>
                          <Typography variant="body2" component="div">
                            "{highlight.highlightedText.length > 60 
                              ? highlight.highlightedText.substring(0, 60) + '...' 
                              : highlight.highlightedText}"
                          </Typography>
                        </Box>
                        {highlight.comment && (
                          <Typography variant="caption" color="text.secondary" display="block" component="div">
                            💬 {highlight.comment}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" component="div">
                          {new Date(highlight.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HighlightsPanel;
