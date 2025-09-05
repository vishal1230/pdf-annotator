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
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  StickyNote2,
  Delete,
  Add
} from '@mui/icons-material';

const NotesPanel = ({ 
  isNotesMode, 
  toggleNotesMode, 
  notes, 
  handleDeleteNote 
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
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
          <Box sx={{ 
            p: 1, 
            mb: 2, 
            bgcolor: 'info.lighter', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'info.main'
          }}>
            <Typography variant="caption" color="info.dark">
              💡 Click anywhere on the PDF to add a note. Click existing pins to view/edit/delete.
            </Typography>
          </Box>
        )}

        {notes.length > 0 && (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2">
                📋 Notes on this page
              </Typography>
              <Chip label={notes.length} size="small" color="secondary" />
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <List dense disablePadding>
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
                        <Typography variant="subtitle2" color="secondary.main">
                          📌 Note #{index + 1}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {note.content.length > 60 
                              ? note.content.substring(0, 60) + '...' 
                              : note.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        {notes.length === 0 && !isNotesMode && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            No notes on this page yet
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesPanel;
