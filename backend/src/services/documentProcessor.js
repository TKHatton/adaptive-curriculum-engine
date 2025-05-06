const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');

const documentProcessor = {
  /**
   * Extract text from uploaded files based on file type
   */
  extractText: async (filePath, mimeType) => {
    try {
      // Extract text based on file type
      if (mimeType === 'application/pdf') {
        return await documentProcessor.extractFromPDF(filePath);
      } else if (mimeType === 'application/msword' || 
                mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await documentProcessor.extractFromWord(filePath);
      } else if (mimeType === 'text/plain') {
        return await documentProcessor.extractFromText(filePath);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      console.error(`Error extracting text from ${filePath}:`, error);
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  },

  /**
   * Extract text from PDF files
   */
  extractFromPDF: async (filePath) => {
    try {
      // Read PDF file
      const pdfBytes = await readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Get page count
      const pageCount = pdfDoc.getPageCount();
      
      // Use pdf-parse or similar library to extract text
      // This is a simplified version that doesn't actually extract text
      // In a real implementation, you would use pdf-parse, pdf.js, or another PDF text extraction library
      
      return `[PDF Document with ${pageCount} pages - Text extraction placeholder]`;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF file');
    }
  },

  /**
   * Extract text from Word documents
   */
  extractFromWord: async (filePath) => {
    try {
      // Read Word document and extract text
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('Error extracting text from Word document:', error);
      throw new Error('Failed to extract text from Word document');
    }
  },

  /**
   * Extract text from plain text files
   */
  extractFromText: async (filePath) => {
    try {
      // Read text file
      const text = await readFile(filePath, 'utf8');
      return text;
    } catch (error) {
      console.error('Error reading text file:', error);
      throw new Error('Failed to read text file');
    }
  },

  /**
   * Analyze document structure (headings, sections, etc.)
   */
  analyzeStructure: (text) => {
    // Simple structure analysis using regex patterns
    const structure = {
      title: '',
      sections: [],
      listItems: []
    };

    // Extract potential title (first line)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      structure.title = lines[0].trim();
    }

    // Find sections (lines ending with colon or lines in ALL CAPS or lines with # symbols)
    const sectionRegex = /^([A-Z][^a-z\n:]{2,}|.*:|\s*#+\s+.*|\s*\d+\.\s+[A-Z].*)$/gm;
    let match;
    while ((match = sectionRegex.exec(text)) !== null) {
      structure.sections.push({
        title: match[0].trim(),
        position: match.index
      });
    }

    // Find list items (lines starting with -, *, •, or number)
    const listItemRegex = /^[ \t]*[-*•][ \t]+.*$|^[ \t]*\d+\.[ \t]+.*$/gm;
    while ((match = listItemRegex.exec(text)) !== null) {
      structure.listItems.push({
        text: match[0].trim(),
        position: match.index
      });
    }

    return structure;
  },

  /**
   * Clean and normalize extracted text
   */
  cleanText: (text) => {
    if (!text) return '';
    
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove multiple empty lines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
};

module.exports = documentProcessor;