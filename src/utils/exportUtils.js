// Advanced export utilities for Light Novel Creator Pro

/**
 * Export project as PDF
 * @param {Object} projectData - Project data including chapters and metadata
 * @param {Object} options - PDF generation options
 */
export const exportToPDF = async (projectData, options = {}) => {
  try {
    // This would require a PDF library like jsPDF or pdfmake
    // For now, we'll create a basic HTML structure that can be printed to PDF
    
    const { project, volumes, worldData, characters } = projectData;
    
    // Create HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${project?.name || 'Light Novel'}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 2cm;
            font-size: 12pt;
          }
          .title-page {
            text-align: center;
            page-break-after: always;
            margin-top: 30%;
          }
          .title-page h1 {
            font-size: 24pt;
            margin-bottom: 1em;
          }
          .title-page .author {
            font-size: 14pt;
            margin-bottom: 2em;
          }
          .chapter-title {
            font-size: 16pt;
            font-weight: bold;
            margin-top: 2em;
            margin-bottom: 1em;
            page-break-before: always;
          }
          .chapter-content {
            text-align: justify;
            margin-bottom: 1em;
          }
          .page-break {
            page-break-before: always;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="title-page">
          <h1>${project?.name || 'Light Novel'}</h1>
          <div class="author">${project?.author || 'Autor'}</div>
          <div>${project?.genre || 'Gênero'}</div>
        </div>
    `;

    // Add chapters
    volumes?.forEach(volume => {
      htmlContent += `<h2 class="chapter-title">${volume.title}</h2>`;
      
      volume.chapters?.forEach(chapter => {
        htmlContent += `
          <h3 class="chapter-title">${chapter.title}</h3>
          <div class="chapter-content">
            ${chapter.content || ''}
          </div>
        `;
      });
    });

    htmlContent += `
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'novel'}.html`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'PDF export initiated (HTML format)' };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export project as EPUB
 * @param {Object} projectData - Project data including chapters and metadata
 * @param {Object} options - EPUB generation options
 */
export const exportToEPUB = async (projectData, options = {}) => {
  try {
    const { project, volumes, worldData, characters } = projectData;
    
    // Create EPUB structure
    const epubContent = {
      title: project?.name || 'Light Novel',
      author: project?.author || 'Autor',
      language: 'pt-BR',
      chapters: []
    };

    // Process chapters
    volumes?.forEach(volume => {
      volume.chapters?.forEach(chapter => {
        epubContent.chapters.push({
          title: `${volume.title} - ${chapter.title}`,
          content: chapter.content || '',
          id: `chapter-${chapter.id}`
        });
      });
    });

    // For now, create a JSON file that can be converted to EPUB
    const blob = new Blob([JSON.stringify(epubContent, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'novel'}.epub.json`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'EPUB structure exported (JSON format)' };
  } catch (error) {
    console.error('EPUB export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export project as Word document
 * @param {Object} projectData - Project data including chapters and metadata
 * @param {Object} options - Word generation options
 */
export const exportToWord = async (projectData, options = {}) => {
  try {
    const { project, volumes, worldData, characters } = projectData;
    
    // Create Word-compatible HTML
    let wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="UTF-8">
        <title>${project?.name || 'Light Novel'}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 2.54cm;
          }
          .title {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2em;
          }
          .chapter-title {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 2em;
            margin-bottom: 1em;
            page-break-before: always;
          }
          .content {
            text-align: justify;
            margin-bottom: 1em;
          }
        </style>
      </head>
      <body>
        <div class="title">${project?.name || 'Light Novel'}</div>
    `;

    // Add chapters
    volumes?.forEach(volume => {
      wordContent += `<h2 class="chapter-title">${volume.title}</h2>`;
      
      volume.chapters?.forEach(chapter => {
        wordContent += `
          <h3 class="chapter-title">${chapter.title}</h3>
          <div class="content">
            ${chapter.content || ''}
          </div>
        `;
      });
    });

    wordContent += `</body></html>`;

    // Create blob and download
    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'novel'}.doc`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'Word document exported' };
  } catch (error) {
    console.error('Word export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export project statistics and metadata
 * @param {Object} projectData - Project data
 */
export const exportStatistics = (projectData) => {
  try {
    const { project, volumes, worldData, characters } = projectData;
    
    const stats = {
      project: {
        name: project?.name,
        genre: project?.genre,
        author: project?.author,
        createdAt: project?.createdAt,
        updatedAt: project?.updatedAt
      },
      volumes: volumes?.length || 0,
      chapters: volumes?.reduce((total, vol) => total + (vol.chapters?.length || 0), 0) || 0,
      totalWords: volumes?.reduce((total, vol) => 
        total + vol.chapters?.reduce((chapTotal, chap) => 
          chapTotal + (chap.wordCount || 0), 0), 0) || 0,
      characters: characters?.length || 0,
      locations: worldData?.locations?.length || 0,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(stats, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'novel'}_statistics.json`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'Statistics exported' };
  } catch (error) {
    console.error('Statistics export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export project as a complete backup
 * @param {Object} projectData - Complete project data
 */
export const exportBackup = (projectData) => {
  try {
    const backupData = {
      ...projectData,
      exportDate: new Date().toISOString(),
      version: '2.0.0',
      exportType: 'backup'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project?.name || 'novel'}_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'Backup exported successfully' };
  } catch (error) {
    console.error('Backup export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Format text for export (remove HTML tags, clean formatting)
 * @param {string} htmlContent - HTML content to format
 * @param {Object} options - Formatting options
 */
export const formatTextForExport = (htmlContent, options = {}) => {
  try {
    // Remove HTML tags
    let text = htmlContent.replace(/<[^>]*>/g, '');
    
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Add paragraph breaks
    if (options.addParagraphBreaks) {
      text = text.replace(/\. /g, '.\n\n');
    }
    
    return text;
  } catch (error) {
    console.error('Text formatting error:', error);
    return htmlContent;
  }
};
