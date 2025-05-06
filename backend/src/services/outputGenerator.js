const PptxGenJS = require('pptxgenjs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { promisify } = require('util');
const streamFinished = promisify(require('stream').finished);

const outputGenerator = {
  /**
   * Create a PPTX presentation from slides data
   */
  createPPTX: async (slides) => {
    // Create new presentation
    const pptx = new PptxGenJS();
    
    // Set default slide size (16:9)
    pptx.layout = 'LAYOUT_16x9';
    
    // Define a clean, minimal theme
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [
        { 'line': { x: 0, y: 0.5, w: '100%', h: 0, line: { color: 'CCCCCC', width: 1 } } }
      ],
      slideNumber: { x: 0.5, y: '95%' }
    });

    // Add each slide
    for (const slide of slides) {
      // Create new slide
      const pptxSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add title
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: '95%',
        fontSize: 24,
        bold: true,
        color: '333333'
      });
      
      // Add content
      let contentY = 1.3; // Starting Y position for content
      
      for (const item of slide.content) {
        if (item.type === 'text') {
          // Add text bullet point
          pptxSlide.addText(item.text, {
            x: 0.7,
            y: contentY,
            w: '90%',
            fontSize: 18,
            bullet: { type: 'bullet' },
            color: '666666'
          });
          contentY += 0.5; // Move down for next item
        } else if (item.type === 'image') {
          // Add image placeholder text
          pptxSlide.addText(`[Image: ${item.description}]`, {
            x: 0.7,
            y: contentY,
            w: '90%',
            fontSize: 16,
            italic: true,
            color: '999999'
          });
          contentY += 0.7; // More space for image placeholder
        }
      }
      
      // Add speaker notes if present
      if (slide.speakerNotes) {
        pptxSlide.addNotes(slide.speakerNotes);
      }
    }
    
    // Generate PPTX as buffer
    const buffer = await pptx.writeFile({ outputType: 'nodebuffer' });
    return buffer;
  },
  
  /**
   * Create a PDF document from script content
   */
  createPDF: async (scriptContent) => {
    return new Promise((resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          margins: { top: 72, left: 72, right: 72, bottom: 72 },
          size: 'letter'
        });
        
        // Create memory buffer to hold PDF
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        
        // Set document metadata
        doc.info.Title = 'Instructor Script';
        doc.info.Author = 'Adaptive Curriculum Engine';
        
        // Add title
        doc.fontSize(20).font('Helvetica-Bold').text('Instructor Script', { align: 'center' });
        doc.moveDown(2);
        
        // Add current date
        const date = new Date().toLocaleDateString();
        doc.fontSize(12).font('Helvetica').text(`Generated on: ${date}`, { align: 'center' });
        doc.moveDown(2);
        
        // Add script content
        doc.fontSize(12).font('Helvetica');
        
        // Process script to identify sections, pause points, key concepts, etc.
        const scriptLines = scriptContent.split('\n');
        let inSection = false;
        
        scriptLines.forEach((line, index) => {
          // Handle blank lines
          if (!line.trim()) {
            doc.moveDown(0.5);
            return;
          }
          
          // Detect section headers [Section Name]
          if (line.match(/^\s*\[.+\]\s*$/)) {
            // If not at top of page and this is a major section, add some space
            if (doc.y > 150) {
              doc.moveDown(1);
            }
            
            doc.fontSize(14).font('Helvetica-Bold').text(line.trim());
            doc.fontSize(12).font('Helvetica');
            doc.moveDown(0.5);
            inSection = true;
            return;
          }
          
          // Detect pause points, key concepts, etc.
          if (line.includes('[Pause') || line.includes('[Key') || line.includes('{')) {
            doc.font('Helvetica-Oblique').text(line.trim());
            doc.font('Helvetica');
            doc.moveDown(0.5);
            return;
          }
          
          // Regular text
          doc.text(line.trim());
          
          // Add line spacing if not in a section
          if (!inSection) {
            doc.moveDown(0.5);
          } else {
            doc.moveDown(0.3);
          }
        });
        
        // Finalize PDF
        doc.end();
        
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Format script text for better readability
   */
  formatScript: (scriptContent) => {
    if (!scriptContent) return '';
    
    // Format the script with proper spacing, indentation, etc.
    return scriptContent
      // Ensure section headers stand out
      .replace(/\[([^\]]+)\]/g, '\n\n[[$1]]\n')
      // Highlight pause points
      .replace(/\[Pause([^\]]*)\]/g, '\n→ [Pause$1]\n')
      // Highlight key concepts
      .replace(/\{([^}]+)\}/g, '**{$1}**')
      // Ensure proper spacing
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
};

module.exports = outputGenerator;