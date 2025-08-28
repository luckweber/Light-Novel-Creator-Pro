import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/editor.css';
import {
  Save,
  Download,
  Eye,
  EyeOff,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
  X,
  AlertTriangle,
  Book,
  MoreHorizontal,
  Settings,
  Zap,
  CheckCircle,
  GitBranch
} from 'lucide-react';
import useStore from '../store/useStore';
import useNotifications from '../hooks/useNotifications';
import useVersionControl from '../hooks/useVersionControl';
import toast from 'react-hot-toast';
import { AIService } from '../utils/aiProviders';
import { exportToPDF, exportToEPUB, exportToWord, exportStatistics, exportBackup } from '../utils/exportUtils';
import { trackEvent } from '../utils/analytics';
import AIWritingAssistantModal from '../components/editor/AIWritingAssistantModal';
import ChapterNavigator from '../components/editor/ChapterNavigator';
import ProgressSummary from '../components/editor/ProgressSummary';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';
import BackupManager from '../components/backup/BackupManager';
import ConsistencyChecker from '../components/editor/ConsistencyChecker';
import NovelReader from '../components/editor/NovelReader';
import LightNovelPDFExporter from '../components/editor/LightNovelPDFExporter';
import VersionControlPanel from '../components/editor/VersionControlPanel';
import VersionNotification from '../components/editor/VersionNotification';

const Editor = () => {
  const { 
    editorContent, 
    setEditorContent, 
    addToHistory, 
    currentProject,
    characters,
    worldData,
    settings,
    projectStructure,
    currentChapter,
    currentVolume,
    setCurrentChapter,
    setCurrentVolume,
    updateChapter
  } = useStore();

  const { checkWritingProgress, checkWritingSession } = useNotifications();
  const { createManualVersion, getVersionStats } = useVersionControl(editorContent);

  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const [showChapterNav, setShowChapterNav] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showConsistencyChecker, setShowConsistencyChecker] = useState(false);
  const [showNovelReader, setShowNovelReader] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showPDFExporter, setShowPDFExporter] = useState(false);
  const [showVersionControl, setShowVersionControl] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const quillRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const sessionIntervalRef = useRef(null);

  // Memoized Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image', 'blockquote', 'code-block',
    'color', 'background'
  ], []);

  // Estatísticas do texto
  const statistics = useMemo(() => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const paragraphs = editorContent.split('</p>').length - 1;
    const readingTimeMinutes = Math.ceil(words.length / 200); // 200 palavras por minuto

    return {
      wordCount: words.length,
      charCount: chars,
      paragraphCount: paragraphs,
      readingTime: readingTimeMinutes
    };
  }, [editorContent]);

  // Atualizar estatísticas
  useEffect(() => {
    setWordCount(statistics.wordCount);
    setCharCount(statistics.charCount);
    setReadingTime(statistics.readingTime);
  }, [statistics]);

  // Auto-save
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (editorContent.trim()) {
        addToHistory(editorContent);
        trackEvent('editor_auto_save');
      }
    }, 30000); // Auto-save a cada 30 segundos

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, addToHistory]);

  // Sessão de escrita
  useEffect(() => {
    sessionIntervalRef.current = setInterval(() => {
      const sessionDuration = Date.now() - sessionStartTime;
      checkWritingSession(sessionDuration);
    }, 60000); // Verificar a cada minuto

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [sessionStartTime, checkWritingSession]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showToolsDropdown && !event.target.closest('.relative')) {
        setShowToolsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolsDropdown]);

  // Verificar progresso de escrita
  useEffect(() => {
    checkWritingProgress(wordCount);
  }, [wordCount, checkWritingProgress]);

  const handleManualSave = useCallback(() => {
    addToHistory(editorContent);
    createManualVersion('Salvamento manual');
    toast.success('Conteúdo salvo com sucesso!');
    trackEvent('editor_manual_save');
  }, [editorContent, addToHistory, createManualVersion]);

  const handleSelectionChange = useCallback((range, source, editor) => {
    if (range && range.length > 0) {
      const selectedText = editor.getText(range.index, range.length);
      setSelectedText(selectedText);
    } else {
      setSelectedText('');
    }
  }, []);

  const handleChapterSelect = useCallback((chapter) => {
    setCurrentChapter(chapter);
    setShowChapterNav(false);
    toast.success(`Capítulo "${chapter.title}" selecionado`);
  }, [setCurrentChapter]);

  const generateWithAI = useCallback(async (type, customPrompt = '') => {
    if (!settings?.defaultAIProvider) {
      toast.error('Configure um provedor de IA nas configurações');
      return;
    }

    setIsGenerating(true);
    const prompt = customPrompt || type;

    try {
      const service = new AIService(settings.defaultAIProvider, settings.aiProviders[settings.defaultAIProvider].apiKey);
      const result = await service.generateText(prompt);
      
      if (result) {
        setEditorContent(prev => prev + '\n\n' + result);
        toast.success('Texto gerado com sucesso!');
        trackEvent('ai_text_generation', { type });
      }
    } catch (error) {
      toast.error('Erro ao gerar texto: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [settings, setEditorContent]);

  const handleAdvancedAIGeneration = useCallback(async (prompt, context) => {
    setIsGenerating(true);
    try {
      const service = new AIService(settings.defaultAIProvider, settings.aiProviders[settings.defaultAIProvider].apiKey);
      const result = await service.generateText(prompt, context);
      
      if (result) {
        setEditorContent(prev => prev + '\n\n' + result);
        toast.success('Texto avançado gerado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao gerar texto avançado: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [settings, setEditorContent]);

  const insertCharacter = useCallback((character) => {
    const text = `[${character.name}]`;
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.insertText(range.index, text);
      }
    }
    toast.success(`Personagem "${character.name}" inserido`);
  }, []);

  const insertLocation = useCallback((location) => {
    const text = `[${location.name}]`;
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.insertText(range.index, text);
      }
    }
    toast.success(`Local "${location.name}" inserido`);
  }, []);

  const exportAsText = useCallback(() => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChapter?.title || 'capitulo'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo exportado como texto');
  }, [editorContent, currentChapter]);

  const exportAsHTML = useCallback(() => {
    const blob = new Blob([editorContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChapter?.title || 'capitulo'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo exportado como HTML');
  }, [editorContent, currentChapter]);

  const handleExportWord = useCallback(async () => {
    try {
      await exportToWord(editorContent, currentChapter?.title || 'capitulo');
      toast.success('Arquivo Word exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar Word: ' + error.message);
    }
  }, [editorContent, currentChapter]);

  const handleExportPDF = useCallback(async () => {
    try {
      await exportToPDF(editorContent, currentChapter?.title || 'capitulo');
      toast.success('Arquivo PDF exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar PDF: ' + error.message);
    }
  }, [editorContent, currentChapter]);

  const handleExportEPUB = useCallback(async () => {
    try {
      await exportToEPUB(editorContent, currentChapter?.title || 'capitulo');
      toast.success('Arquivo EPUB exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar EPUB: ' + error.message);
    }
  }, [editorContent, currentChapter]);

  const handleExportStatistics = useCallback(async () => {
    try {
      await exportStatistics(statistics, currentChapter?.title || 'capitulo');
      toast.success('Estatísticas exportadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar estatísticas: ' + error.message);
    }
  }, [statistics, currentChapter]);

  const handleExportBackup = useCallback(async () => {
    try {
      await exportBackup({
        content: editorContent,
        chapter: currentChapter,
        statistics
      });
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup: ' + error.message);
    }
  }, [editorContent, currentChapter, statistics]);

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-card border-b border-border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {currentChapter ? currentChapter.title : 'Editor de Texto'}
              </h1>
              {currentVolume && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {currentVolume.title}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{wordCount.toLocaleString()} palavras</span>
              <span>•</span>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{readingTime} min de leitura</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            {/* Botões Principais */}
            <button
              onClick={handleManualSave}
              className="btn-primary flex items-center text-sm"
            >
              <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Salvar</span>
              <span className="sm:hidden">Salvar</span>
            </button>
            
            {/* Botão de Versões */}
            <button
              onClick={() => setShowVersionControl(true)}
              className="btn-secondary flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              <GitBranch className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Versões</span>
              <span className="sm:hidden">Versões</span>
            </button>
            
            <button
              onClick={() => setShowAdvancedAI(true)}
              className="btn-secondary flex items-center bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">IA Avançada</span>
              <span className="sm:hidden">IA</span>
            </button>
            
            <button
              onClick={() => setShowAIHelper(!showAIHelper)}
              className="btn-outline flex items-center text-sm"
            >
              <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">AI Helper</span>
              <span className="sm:hidden">AI</span>
            </button>
            
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-outline flex items-center text-sm"
            >
              {isPreview ? <EyeOff className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="hidden sm:inline">{isPreview ? 'Editar' : 'Visualizar'}</span>
              <span className="sm:hidden">{isPreview ? 'Editar' : 'Ver'}</span>
            </button>
            
            <button
              onClick={() => setShowPDFExporter(true)}
              className="btn-secondary flex items-center bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Dropdown de Ferramentas */}
            <div className="relative">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="btn-outline flex items-center text-sm"
              >
                <MoreHorizontal className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Ferramentas</span>
                <span className="sm:hidden">...</span>
              </button>
             
             {showToolsDropdown && (
               <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                 <div className="py-2">
                   <button
                     onClick={() => {
                       setShowChapterNav(!showChapterNav);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <BookOpen className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Navegador de Capítulos</span>
                     <span className="sm:hidden">Capítulos</span>
                   </button>
                   <button
                     onClick={() => {
                       setShowAnalytics(!showAnalytics);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <BarChart3 className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Analytics</span>
                     <span className="sm:hidden">Analytics</span>
                   </button>
                   <button
                     onClick={() => {
                       setShowBackupManager(true);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <Save className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Gerenciar Backups</span>
                     <span className="sm:hidden">Backups</span>
                   </button>
                   <button
                     onClick={() => {
                       setShowConsistencyChecker(true);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <CheckCircle className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Verificar Consistência</span>
                     <span className="sm:hidden">Consistência</span>
                   </button>
                   <button
                     onClick={() => {
                       setShowNovelReader(true);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <Book className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Leitor Virtual</span>
                     <span className="sm:hidden">Leitor</span>
                   </button>
                   <button
                     onClick={() => {
                       setShowPDFExporter(true);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <FileText className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Exportar PDF Profissional</span>
                     <span className="sm:hidden">PDF Profissional</span>
                   </button>
                   
                   <div className="border-t border-gray-200 my-2"></div>
                   
                   <button
                     onClick={() => {
                       setShowVersionControl(true);
                       setShowToolsDropdown(false);
                     }}
                     className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                   >
                     <GitBranch className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">Controle de Versões</span>
                     <span className="sm:hidden">Versões</span>
                   </button>
                 </div>
               </div>
             )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chapter Navigator - Mobile: Drawer, Desktop: Sidebar */}
        {showChapterNav && (
          <div className="fixed inset-0 z-50 lg:relative lg:z-auto">
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowChapterNav(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border lg:relative lg:translate-x-0 transform transition-transform duration-300 ease-in-out lg:transform-none">
              <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
                <h3 className="text-lg font-semibold">Capítulos</h3>
                <button onClick={() => setShowChapterNav(false)} className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ChapterNavigator
                onChapterSelect={handleChapterSelect}
                currentChapter={currentChapter}
                currentVolume={currentVolume}
              />
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col lg:mr-80">
          {isPreview ? (
            <div className="flex-1 p-4 sm:p-6 overflow-auto">
              <div 
                className="prose prose-sm sm:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col" style={{ backgroundColor: '#ffffff' }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                modules={modules}
                formats={formats}
                placeholder="Comece a escrever sua light novel..."
                onSelectionChange={handleSelectionChange}
                className="flex-1"
                style={{ 
                  height: '100%',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          )}
        </div>

        {/* Sidebar - Mobile: Bottom Sheet, Desktop: Sidebar */}
        {showAIHelper && (
          <div className="fixed inset-0 z-50 lg:relative lg:z-auto">
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAIHelper(false)} />
            <div className="fixed bottom-0 left-0 right-0 h-96 bg-card border-t border-border rounded-t-lg lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:h-auto lg:w-80 lg:border-t-0 lg:border-l lg:rounded-t-none transform transition-transform duration-300 ease-in-out lg:transform-none">
              <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
                <h3 className="text-lg font-semibold">Assistente IA</h3>
                <button onClick={() => setShowAIHelper(false)} className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-4 lg:space-y-6 overflow-y-auto h-full">
                {/* Progress Summary */}
                <ProgressSummary />
                
                {/* AI Helper */}
                <div className="card">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                    Assistente IA
                  </h3>
                  
                  {selectedText && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs sm:text-sm text-blue-800">
                        <strong>Texto selecionado:</strong>
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700 mt-1 italic">
                        "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {[
                      { key: 'continuar', label: '✍️ Continuar escrevendo', desc: 'Continue a história' },
                      { key: 'descrever personagem', label: '👤 Descrever personagem', desc: 'Crie descrições detalhadas' },
                      { key: 'cena de ação', label: '⚡ Cena de ação', desc: 'Escreva cenas dinâmicas' },
                      { key: 'diálogo', label: '💬 Diálogo', desc: 'Crie conversas naturais' },
                      { key: 'descrição de cenário', label: '🏞️ Cenário', desc: 'Descreva ambientes' },
                      { key: 'transição', label: '🔄 Transição', desc: 'Conecte cenas suavemente' },
                      ...(selectedText ? [{ key: 'melhorar', label: '✨ Melhorar texto', desc: 'Aprimore o texto selecionado' }] : [])
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => generateWithAI(option.key)}
                        disabled={isGenerating}
                        className="w-full text-left p-2 sm:p-3 text-xs sm:text-sm hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                  
                  {isGenerating && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center text-purple-700">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-2"></div>
                        <span className="text-xs sm:text-sm">Gerando texto com IA...</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <textarea
                      placeholder="Ou escreva um prompt personalizado..."
                      className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                          generateWithAI('custom', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Ctrl + Enter para enviar</p>
                  </div>
                </div>

                {/* Characters */}
                {characters.length > 0 && (
                  <div className="card">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                      Personagens
                    </h3>
                    <div className="space-y-2">
                      {characters.slice(0, 5).map((character) => (
                        <button
                          key={character.id}
                          onClick={() => insertCharacter(character)}
                          className="w-full text-left p-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          {character.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {worldData.locations.length > 0 && (
                  <div className="card">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                      Locais
                    </h3>
                    <div className="space-y-2">
                      {worldData.locations.slice(0, 5).map((location) => (
                        <button
                          key={location.id}
                          onClick={() => insertLocation(location)}
                          className="w-full text-left p-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          {location.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Options */}
                <div className="card">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Exportar
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={exportAsText}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Como Texto (.txt)</span>
                      <span className="sm:hidden">Texto</span>
                    </button>
                    <button
                      onClick={exportAsHTML}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Como HTML (.html)</span>
                      <span className="sm:hidden">HTML</span>
                    </button>
                    <button
                      onClick={handleExportWord}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Como Word (.doc)</span>
                      <span className="sm:hidden">Word</span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Como PDF (.html)</span>
                      <span className="sm:hidden">PDF</span>
                    </button>
                    <button
                      onClick={handleExportEPUB}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Como EPUB (.json)</span>
                      <span className="sm:hidden">EPUB</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleExportStatistics}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Estatísticas</span>
                      <span className="sm:hidden">Stats</span>
                    </button>
                    <button
                      onClick={handleExportBackup}
                      className="w-full btn-outline flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Backup Completo</span>
                      <span className="sm:hidden">Backup</span>
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="card">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Estatísticas
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Palavras:</span>
                      <span className="font-medium">{wordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Caracteres:</span>
                      <span className="font-medium">{charCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo de leitura:</span>
                      <span className="font-medium">{readingTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parágrafos:</span>
                      <span className="font-medium">{statistics.paragraphCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de IA Avançada */}
      {showAdvancedAI && (
        <AIWritingAssistantModal
          onClose={() => setShowAdvancedAI(false)}
          onGenerate={handleAdvancedAIGeneration}
          isGenerating={isGenerating}
          worldData={worldData}
          characters={characters}
          selectedText={selectedText}
        />
      )}

      {/* Modal de Analytics Avançados */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Analytics Avançados</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto h-full">
              <AdvancedAnalytics 
                content={editorContent.replace(/<[^>]*>/g, '')}
                projectData={{
                  project: currentProject,
                  volumes: projectStructure.volumes,
                  worldData,
                  characters
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciador de Backups */}
      {showBackupManager && (
        <BackupManager onClose={() => setShowBackupManager(false)} />
      )}

      {/* Modal de Verificador de Consistência */}
      {showConsistencyChecker && (
        <ConsistencyChecker onClose={() => setShowConsistencyChecker(false)} />
      )}

      {/* Modal de Leitor de Light Novel */}
      {showNovelReader && (
        <NovelReader onClose={() => setShowNovelReader(false)} />
      )}

      {/* Modal de Exportador de PDF Profissional */}
      {showPDFExporter && (
        <LightNovelPDFExporter onClose={() => setShowPDFExporter(false)} />
      )}

      {/* Modal de Controle de Versões */}
      {showVersionControl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Controle de Versões</h2>
              <button
                onClick={() => setShowVersionControl(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto h-full">
              <VersionControlPanel 
                content={editorContent.replace(/<[^>]*>/g, '')}
                onContentUpdate={(newContent) => {
                  setEditorContent(newContent);
                  addToHistory(newContent);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Versão */}
      <VersionNotification content={editorContent} />
    </div>
  );
};

export default Editor;
