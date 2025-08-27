import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText,
  Download,
  Settings,
  BookOpen,
  User,
  Calendar,
  Tag,
  X,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import useStore from '../../store/useStore';

const LightNovelPDFExporter = ({ onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOptions, setExportOptions] = useState({
    includeCover: true,
    includeTableOfContents: true,
    includeMetadata: true,
    includeAuthorBio: true,
    pageSize: 'A5',
    fontSize: 12,
    lineHeight: 1.6,
    margins: 2,
    fontFamily: 'Times New Roman',
    includePageNumbers: true,
    includeHeaders: true,
    includeFooters: true,
    quality: 'high'
  });

  const { currentProject, projectStructure, characters, worldData } = useStore();
  const contentRef = useRef(null);

  const generateCoverPage = () => {
    const coverDiv = document.createElement('div');
    coverDiv.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 60px;
      font-family: 'Times New Roman', serif;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    `;

    // Adicionar elementos decorativos
    coverDiv.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');"></div>
      
      <div style="position: relative; z-index: 2;">
        <div style="font-size: 14px; margin-bottom: 20px; opacity: 0.9; letter-spacing: 2px;">
          LIGHT NOVEL
        </div>
        
        <h1 style="font-size: 48px; margin: 0 0 30px 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); line-height: 1.2;">
          ${currentProject?.title || 'Título da Light Novel'}
        </h1>
        
        <div style="width: 60px; height: 3px; background: white; margin: 30px auto;"></div>
        
        <div style="font-size: 20px; margin-bottom: 40px; opacity: 0.9;">
          ${currentProject?.author || 'Autor'}
        </div>
        
        <div style="font-size: 16px; opacity: 0.8; margin-bottom: 20px;">
          ${currentProject?.genre || 'Gênero'}
        </div>
        
        <div style="position: absolute; bottom: 60px; left: 60px; right: 60px;">
          <div style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">
            Volume ${projectStructure?.volumes?.length || 1}
          </div>
          <div style="font-size: 14px; opacity: 0.9;">
            ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    `;

    return coverDiv;
  };

  const generateTableOfContents = () => {
    const tocDiv = document.createElement('div');
    tocDiv.style.cssText = `
      width: 100%;
      min-height: 100%;
      padding: 60px;
      font-family: 'Times New Roman', serif;
      background: white;
      color: #333;
      box-sizing: border-box;
    `;

    let tocContent = `
      <h1 style="font-size: 24px; text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        SUMÁRIO
      </h1>
    `;

    projectStructure?.volumes?.forEach((volume, volumeIndex) => {
      tocContent += `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; color: #667eea; margin-bottom: 10px;">
            ${volume.title}
          </h2>
      `;

      volume.chapters?.forEach((chapter, chapterIndex) => {
        tocContent += `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; padding-left: 20px;">
            <span style="font-size: 14px;">${chapter.title}</span>
            <span style="font-size: 14px; color: #666;">${volumeIndex + 1}.${chapterIndex + 1}</span>
          </div>
        `;
      });

      tocContent += `</div>`;
    });

    tocDiv.innerHTML = tocContent;
    return tocDiv;
  };

  const generateChapterContent = (volume, chapter) => {
    const chapterDiv = document.createElement('div');
    chapterDiv.style.cssText = `
      width: 100%;
      min-height: 100%;
      padding: 60px;
      font-family: '${exportOptions.fontFamily}', serif;
      background: white;
      color: #333;
      font-size: ${exportOptions.fontSize}px;
      line-height: ${exportOptions.lineHeight};
      box-sizing: border-box;
    `;

    // Cabeçalho do capítulo
    const headerContent = `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
        <h1 style="font-size: 20px; margin: 0 0 10px 0; color: #333;">
          ${volume.title}
        </h1>
        <h2 style="font-size: 16px; margin: 0; color: #667eea; font-weight: normal;">
          ${chapter.title}
        </h2>
      </div>
    `;

    // Conteúdo do capítulo
    const content = chapter.content || 'Conteúdo não disponível.';
    const formattedContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split('\n\n')
      .map(paragraph => `<p style="text-align: justify; margin-bottom: 16px; text-indent: 20px;">${paragraph}</p>`)
      .join('');

    chapterDiv.innerHTML = headerContent + formattedContent;
    return chapterDiv;
  };

  const generateMetadataPage = () => {
    const metadataDiv = document.createElement('div');
    metadataDiv.style.cssText = `
      width: 100%;
      min-height: 100%;
      padding: 60px;
      font-family: 'Times New Roman', serif;
      background: white;
      color: #333;
      box-sizing: border-box;
    `;

    const wordCount = projectStructure?.volumes?.reduce((total, vol) => 
      total + vol.chapters?.reduce((chapTotal, chap) => 
        chapTotal + (chap.content?.split(' ').length || 0), 0), 0) || 0;

    const chapterCount = projectStructure?.volumes?.reduce((total, vol) => 
      total + (vol.chapters?.length || 0), 0) || 0;

    metadataDiv.innerHTML = `
      <h1 style="font-size: 24px; text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        INFORMAÇÕES DA OBRA
      </h1>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
        <div>
          <h3 style="font-size: 16px; color: #667eea; margin-bottom: 15px;">Informações Básicas</h3>
          <div style="margin-bottom: 10px;">
            <strong>Título:</strong> ${currentProject?.title || 'N/A'}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Autor:</strong> ${currentProject?.author || 'N/A'}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Gênero:</strong> ${currentProject?.genre || 'N/A'}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Público-alvo:</strong> ${currentProject?.targetAudience || 'N/A'}
          </div>
        </div>
        
        <div>
          <h3 style="font-size: 16px; color: #667eea; margin-bottom: 15px;">Estatísticas</h3>
          <div style="margin-bottom: 10px;">
            <strong>Volumes:</strong> ${projectStructure?.volumes?.length || 0}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Capítulos:</strong> ${chapterCount}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Palavras:</strong> ${wordCount.toLocaleString()}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Personagens:</strong> ${characters?.length || 0}
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; color: #667eea; margin-bottom: 15px;">Sinopse</h3>
        <p style="text-align: justify; line-height: 1.6;">
          ${currentProject?.description || 'Sinopse não disponível.'}
        </p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; color: #667eea; margin-bottom: 15px;">Personagens Principais</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${characters?.slice(0, 6).map(char => `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
              <strong>${char.name}</strong><br/>
              <small style="color: #666;">${char.role || 'Personagem'}</small>
            </div>
          `).join('') || 'Nenhum personagem cadastrado.'}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p>Light Novel Creator Pro</p>
      </div>
    `;

    return metadataDiv;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let currentPage = 0;

      // Função auxiliar para renderizar elemento no DOM temporariamente
      const renderElementToCanvas = async (element) => {
        // Criar um container temporário
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '595px'; // A4 width in points
        tempContainer.style.height = '842px'; // A4 height in points
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '40px';
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        tempContainer.style.fontSize = '12px';
        tempContainer.style.lineHeight = '1.6';
        tempContainer.style.overflow = 'hidden';
        
        // Adicionar o elemento ao container
        tempContainer.appendChild(element);
        document.body.appendChild(tempContainer);

        try {
          // Aguardar um pouco para o DOM ser renderizado
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 595,
            height: 842
          });
          
          return canvas;
        } finally {
          // Remover o container temporário
          document.body.removeChild(tempContainer);
        }
      };

      // Capa
      if (exportOptions.includeCover) {
        setExportProgress(10);
        const cover = generateCoverPage();
        const coverCanvas = await renderElementToCanvas(cover);
        
        const coverImg = coverCanvas.toDataURL('image/png');
        pdf.addImage(coverImg, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.addPage();
        currentPage++;
      }

      // Página de metadados
      if (exportOptions.includeMetadata) {
        setExportProgress(30);
        const metadata = generateMetadataPage();
        const metadataCanvas = await renderElementToCanvas(metadata);
        
        const metadataImg = metadataCanvas.toDataURL('image/png');
        pdf.addImage(metadataImg, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.addPage();
        currentPage++;
      }

      // Sumário
      if (exportOptions.includeTableOfContents) {
        setExportProgress(50);
        const toc = generateTableOfContents();
        const tocCanvas = await renderElementToCanvas(toc);
        
        const tocImg = tocCanvas.toDataURL('image/png');
        pdf.addImage(tocImg, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.addPage();
        currentPage++;
      }

      // Capítulos
      const totalChapters = projectStructure?.volumes?.reduce((total, vol) => 
        total + (vol.chapters?.length || 0), 0) || 0;
      let processedChapters = 0;

      for (const volume of projectStructure?.volumes || []) {
        for (const chapter of volume.chapters || []) {
          setExportProgress(60 + (processedChapters / totalChapters) * 30);
          
          const chapterContent = generateChapterContent(volume, chapter);
          const chapterCanvas = await renderElementToCanvas(chapterContent);
          
          const chapterImg = chapterCanvas.toDataURL('image/png');
          pdf.addImage(chapterImg, 'PNG', 0, 0, pageWidth, pageHeight);
          pdf.addPage();
          currentPage++;
          processedChapters++;
        }
      }

      setExportProgress(95);

      // Salvar PDF
      const fileName = `${currentProject?.title || 'light-novel'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setExportProgress(100);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Erro na exportação:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Exportar Light Novel para PDF</h2>
              <p className="text-sm text-gray-600">Formatação profissional para portais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isExporting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Opções de Exportação */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Opções de Exportação
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCover}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeCover: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Incluir Capa</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTableOfContents}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeTableOfContents: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Incluir Sumário</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeMetadata: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Incluir Metadados</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includePageNumbers}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includePageNumbers: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Números de Página</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Formatação
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho da Fonte</label>
                  <select
                    value={exportOptions.fontSize}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      fontSize: parseInt(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value={10}>10px</option>
                    <option value={11}>11px</option>
                    <option value={12}>12px</option>
                    <option value={13}>13px</option>
                    <option value={14}>14px</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Altura da Linha</label>
                  <select
                    value={exportOptions.lineHeight}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      lineHeight: parseFloat(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value={1.4}>1.4</option>
                    <option value={1.5}>1.5</option>
                    <option value={1.6}>1.6</option>
                    <option value={1.7}>1.7</option>
                    <option value={1.8}>1.8</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Informações do Projeto */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Projeto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Título:</strong> {currentProject?.title || 'N/A'}
                </div>
                <div>
                  <strong>Autor:</strong> {currentProject?.author || 'N/A'}
                </div>
                <div>
                  <strong>Gênero:</strong> {currentProject?.genre || 'N/A'}
                </div>
                <div>
                  <strong>Volumes:</strong> {projectStructure?.volumes?.length || 0}
                </div>
                <div>
                  <strong>Capítulos:</strong> {projectStructure?.volumes?.reduce((total, vol) => 
                    total + (vol.chapters?.length || 0), 0) || 0}
                </div>
                <div>
                  <strong>Palavras:</strong> {projectStructure?.volumes?.reduce((total, vol) => 
                    total + vol.chapters?.reduce((chapTotal, chap) => 
                      chapTotal + (chap.content?.split(' ').length || 0), 0), 0)?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isExporting && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Exportando PDF...</span>
                <span className="text-sm text-gray-600">{Math.round(exportProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isExporting}
            >
              Cancelar
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Exportar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightNovelPDFExporter;
