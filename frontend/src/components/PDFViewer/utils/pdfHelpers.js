export const DEFAULT_SCALE = 1.2;

export const validatePdfDimensions = (dimensions) => {
  return dimensions && dimensions.width > 0 && dimensions.height > 0;
};

export const normalizeCoordinates = (x, y, pdfDimensions) => {
  if (!pdfDimensions) return { x: 0, y: 0 };
  
  return {
    x: Math.max(0, Math.min(x, pdfDimensions.width)),
    y: Math.max(0, Math.min(y, pdfDimensions.height))
  };
};

export const formatPageInfo = (pageNumber, totalPages) => {
  return `Page ${pageNumber} of ${totalPages || 0}`;
};

export const calculateZoomPercentage = (scale) => {
  return Math.round(scale * 100);
};
