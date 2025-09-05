import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Search,
  FindInPage
} from '@mui/icons-material';

const SearchPanel = ({
  searchString,
  setSearchString,
  highlightSearchResults,
  setHighlightSearchResults,
  searchResults,
  jumpToSearchResult,
  pageNumber
}) => {
  const totalMatches = searchResults.reduce((total, result) => total + result.matchCount, 0);

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Search sx={{ mr: 1 }} /> Search PDF
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search text in PDF..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={highlightSearchResults}
              onChange={(e) => setHighlightSearchResults(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2">
              Highlight search results
            </Typography>
          }
        />

        {searchString.trim() && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            {searchResults.length > 0 ? (
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <FindInPage color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Found {totalMatches} matches on {searchResults.length} page{searchResults.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  <List dense disablePadding>
                    {searchResults.map((result, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => jumpToSearchResult(result.pageNumber)}
                        sx={{
                          mb: 1,
                          bgcolor: result.pageNumber === pageNumber ? 'primary.lighter' : 'background.paper',
                          border: '1px solid',
                          borderColor: result.pageNumber === pageNumber ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: 'primary.lighter',
                            transform: 'translateX(4px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="subtitle2" color="primary">
                                Page {result.pageNumber}
                              </Typography>
                              <Chip 
                                label={`${result.matchCount} match${result.matchCount !== 1 ? 'es' : ''}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {result.preview}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            ) : (
              <Box textAlign="center" py={2}>
                <Typography variant="body2" color="text.secondary">
                  No matches found for "{searchString}"
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchPanel;
