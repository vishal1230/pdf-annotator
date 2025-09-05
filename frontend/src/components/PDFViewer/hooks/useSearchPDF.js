import { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

export const useSearchPDF = (pdfUrl) => {
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightSearchResults, setHighlightSearchResults] = useState(false);

  useEffect(() => {
    if (!pdfUrl || !searchString.trim()) {
      setSearchResults([]);
      return;
    }

    const searchPDF = async () => {
      try {
        const pdf = await pdfjs.getDocument({ url: pdfUrl }).promise;
        const pageCount = pdf._pdfInfo.numPages;
        
        const pagePromises = Array.from({ length: pageCount }, (_, index) =>
          pdf.getPage(index + 1).then(page =>
            page.getTextContent().then(textContent => ({
              pageNumber: index + 1,
              text: textContent.items.map(({ str }) => str).join(' ')
            }))
          )
        );

        const pages = await Promise.all(pagePromises);
        const results = [];
        
        pages.forEach(page => {
          const regex = new RegExp(searchString.trim(), 'gi');
          const matches = [...page.text.matchAll(regex)];
          if (matches.length > 0) {
            results.push({
              pageNumber: page.pageNumber,
              matchCount: matches.length,
              preview: page.text.substring(0, 100) + '...'
            });
          }
        });
        
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchPDF, 500);
    return () => clearTimeout(debounceTimer);
  }, [pdfUrl, searchString]);

  const highlightPattern = (text, pattern) => {
    if (!pattern || !highlightSearchResults) return text;
    const searchTerm = pattern.trim().toLowerCase();
    const lowerText = text.toLowerCase();
    if (lowerText.includes(searchTerm)) {
      const startIndex = lowerText.indexOf(searchTerm);
      const endIndex = startIndex + searchTerm.length;
      return (
        <>
          {text.substring(0, startIndex)}
          <mark style={{ background: '#ffe066', color: '#222', borderRadius: '2px' }}>
            {text.substring(startIndex, endIndex)}
          </mark>
          {text.substring(endIndex)}
        </>
      );
    }
    return text;
  };

  return {
    searchString,
    setSearchString,
    searchResults,
    highlightSearchResults,
    setHighlightSearchResults,
    highlightPattern
  };
};
