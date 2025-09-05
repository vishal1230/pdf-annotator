export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Just now';
  return new Date(timestamp).toLocaleString();
};

export const generateNoteId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

export const validateNoteContent = (content) => {
  return content && content.trim().length > 0;
};

export const highlightColors = {
  yellow: '#ffff00',
  orange: '#ffa500',
  green: '#00ff00',
  blue: '#00bfff',
  pink: '#ff69b4'
};

export const createHighlightData = (text, pageNumber, uuid, color = highlightColors.yellow) => {
  return {
    pdfUuid: uuid,
    pageNumber,
    highlightedText: text,
    comment: `Highlighted on page ${pageNumber}`,
    position: { page: pageNumber },
    color,
    createdAt: new Date().toISOString()
  };
};
