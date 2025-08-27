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
  CheckCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import useNotifications from '../hooks/useNotifications';
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

  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const [showChapterNav, setShowChapterNav] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showConsistencyChecker, setShowConsistencyChecker] = useState(false);
  const [showNovelReader, setShowNovelReader] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
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
    'list', 'bullet', 'align', 'link', 'image', 
    'blockquote', 'code-block', 'color', 'background'
  ], []);

  // Memoized statistics calculation
  const statistics = useMemo(() => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const readingTimeMinutes = Math.ceil(words.length / 200);

    return {
      wordCount: words.length,
      charCount: chars,
      readingTime: readingTimeMinutes,
      paragraphCount: (editorContent.match(/<p>/g) || []).length
    };
  }, [editorContent]);

  // Update statistics when they change
  useEffect(() => {
    setWordCount(statistics.wordCount);
    setCharCount(statistics.charCount);
    setReadingTime(statistics.readingTime);
    
    // Check writing progress for notifications
    checkWritingProgress(statistics.wordCount);
  }, [statistics, checkWritingProgress]);

  // Optimized auto-save functionality
  const handleAutoSave = useCallback(() => {
    if (editorContent && currentChapter && currentVolume) {
      updateChapter(currentVolume.id, currentChapter.id, { content: editorContent });
      addToHistory(editorContent);
      toast.success('Capítulo salvo automaticamente!', { duration: 1000 });
    }
  }, [editorContent, currentChapter, currentVolume, updateChapter, addToHistory]);

  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    if (editorContent && settings?.autoSave !== false) {
      const interval = settings?.autoSaveInterval || 30;
      autoSaveTimeoutRef.current = setTimeout(handleAutoSave, interval * 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, handleAutoSave, settings?.autoSave, settings?.autoSaveInterval]);

  // Load chapter content when selected
  useEffect(() => {
    if (currentChapter && currentChapter.content !== editorContent) {
      setEditorContent(currentChapter.content || '');
    }
  }, [currentChapter, setEditorContent]);

  // Monitor writing session for notifications
  useEffect(() => {
    // Start session monitoring when component mounts
    setSessionStartTime(Date.now());
    
    // Check session duration every 5 minutes
    sessionIntervalRef.current = setInterval(() => {
      const sessionDuration = Date.now() - sessionStartTime;
      checkWritingSession(sessionDuration);
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [sessionStartTime, checkWritingSession, editorContent]);

  // Optimized CSS application - only run once after mount
  useEffect(() => {
    const applyEditorStyles = () => {
      const editors = document.querySelectorAll('.ql-editor, .ql-container');
      editors.forEach(editor => {
        editor.style.backgroundColor = '#ffffff';
        editor.style.color = '#1f2937';
      });
      
      const toolbar = document.querySelector('.ql-toolbar');
      if (toolbar) {
        toolbar.style.backgroundColor = '#ffffff';
      }
    };

    // Apply styles after a short delay to ensure Quill is rendered
    const timer = setTimeout(applyEditorStyles, 100);
    return () => clearTimeout(timer);
  }, [editorContent]);

  // Close dropdown when clicking outside
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

  // Função para selecionar capítulo
  const handleChapterSelect = useCallback((volume, chapter) => {
    // Salvar capítulo atual antes de trocar
    if (currentChapter && currentVolume && editorContent !== currentChapter.content) {
      updateChapter(currentVolume.id, currentChapter.id, { content: editorContent });
    }
    
    setCurrentVolume(volume);
    setCurrentChapter(chapter);
  }, [currentChapter, currentVolume, editorContent, updateChapter, setCurrentVolume, setCurrentChapter]);

  // Função para salvar manualmente
  const handleManualSave = useCallback(() => {
    if (currentChapter && currentVolume) {
      updateChapter(currentVolume.id, currentChapter.id, { content: editorContent });
      toast.success('Capítulo salvo!');
      
      // Track save event
      trackEvent('chapter_saved', {
        chapterId: currentChapter.id,
        volumeId: currentVolume.id,
        wordCount: statistics.wordCount
      });
    } else {
      addToHistory(editorContent);
      toast.success('Conteúdo salvo!');
      
      // Track save event
      trackEvent('content_saved', {
        wordCount: statistics.wordCount
      });
    }
  }, [currentChapter, currentVolume, editorContent, updateChapter, addToHistory, statistics.wordCount]);

  // Handle text selection for AI helper
  const handleSelectionChange = useCallback((range, source, editor) => {
    if (range && range.length > 0) {
      const text = editor.getText(range.index, range.length);
      setSelectedText(text);
    } else {
      setSelectedText('');
    }
  }, []);

  // AI Helper functions
  const generateWithAI = useCallback(async (promptType, customPrompt = '') => {
    if (!settings?.defaultAIProvider) {
      toast.error('Configure um provedor de IA nas configurações');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Gerando texto com IA...');

    try {
      const activeProvider = settings.aiProviders[settings.defaultAIProvider];
      if (!activeProvider || !activeProvider.apiKey) {
        throw new Error('Provedor de IA não configurado corretamente.');
      }
      
      const aiService = new AIService(settings.defaultAIProvider, activeProvider.apiKey, {
        model: activeProvider.defaultModel,
        temperature: activeProvider.temperature,
        maxTokens: activeProvider.maxTokens
      });

      // Criar contexto do mundo para a IA
      const worldContext = {
        project: currentProject?.name || 'Light Novel',
        genre: currentProject?.genre || worldData?.genre,
        characters: characters.map(c => ({ name: c.name, role: c.role })),
        locations: worldData?.locations?.map(l => l.name) || [],
        currentText: selectedText
      };

      // Construir prompt contextual
      let fullPrompt = '';
      if (customPrompt) {
        fullPrompt = `${customPrompt}\n\nCONTEXTO DO PROJETO:\n${JSON.stringify(worldContext, null, 2)}\n\nResponda apenas com o texto da light novel, sem explicações adicionais.`;
      } else {
        const prompts = {
          'continuar': `Continue escrevendo esta light novel de forma natural e envolvente. ${selectedText ? `Baseie-se no texto selecionado: "${selectedText}"` : 'Continue a partir do contexto atual.'}`,
          'descrever personagem': `Crie uma descrição detalhada e envolvente de um personagem para esta light novel. ${selectedText ? `Contexto: "${selectedText}"` : ''}`,
          'cena de ação': `Escreva uma cena de ação dinâmica e emocionante para esta light novel. ${selectedText ? `Baseie-se em: "${selectedText}"` : ''}`,
          'diálogo': `Crie um diálogo natural e interessante entre personagens desta light novel. ${selectedText ? `Contexto: "${selectedText}"` : ''}`,
          'descrição de cenário': `Descreva um cenário ou ambiente de forma vívida e imersiva para esta light novel. ${selectedText ? `Baseie-se em: "${selectedText}"` : ''}`,
          'transição': `Crie uma transição suave e natural entre cenas desta light novel. ${selectedText ? `A partir de: "${selectedText}"` : ''}`,
          'melhorar': selectedText ? `Melhore e reescreva este trecho de forma mais envolvente: "${selectedText}"` : 'Melhore o texto atual.'
        };

        fullPrompt = prompts[promptType] || prompts['continuar'];
        fullPrompt += `\n\nCONTEXTO DO PROJETO:\n${JSON.stringify(worldContext, null, 2)}`;
        fullPrompt += `\n\nResponda apenas com o texto da light novel, sem explicações adicionais.`;
      }

      const result = await aiService.generateText(fullPrompt);
      
      // Inserir o texto gerado no editor
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        
        if (promptType === 'melhorar' && selectedText && range) {
          // Substituir texto selecionado
          quill.deleteText(range.index, range.length);
          quill.insertText(range.index, result);
        } else if (range) {
          // Inserir na posição do cursor
          quill.insertText(range.index, result);
        } else {
          // Inserir no final
          quill.insertText(quill.getLength(), result);
        }
      }
      
      toast.success('Texto gerado com sucesso!', { id: toastId });
      
      // Track AI generation event
      trackEvent('ai_text_generated', {
        promptType: promptType,
        wordCount: result.split(' ').length,
        provider: settings.defaultAIProvider
      });
    } catch (error) {
      toast.error(`Erro ao gerar texto: ${error.message}`, { id: toastId });
      
      // Track error event
      trackEvent('ai_generation_error', {
        error: error.message,
        promptType: promptType
      });
    } finally {
      setIsGenerating(false);
    }
  }, [settings, currentProject, characters, worldData, selectedText]);

  // Função para lidar com geração avançada de IA
  const handleAdvancedAIGeneration = useCallback(async (context) => {
    setShowAdvancedAI(false);
    
    const promptTypes = {
      continue: 'continuar',
      character: 'descrever personagem',
      scene: 'descrição de cenário',
      dialogue: 'diálogo',
      action: 'cena de ação',
      custom: 'custom'
    };

    if (context.type === 'custom') {
      await generateWithAI('custom', context.prompt);
    } else {
      await generateWithAI(promptTypes[context.type], context.prompt);
    }
  }, [generateWithAI]);

  // Advanced Export functions
  const exportAsText = useCallback(() => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'novel'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportado como texto!');
  }, [editorContent, currentProject]);

  const exportAsHTML = useCallback(() => {
    const blob = new Blob([editorContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'novel'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportado como HTML!');
  }, [editorContent, currentProject]);

  const handleExportPDF = useCallback(async () => {
    const projectData = {
      project: currentProject,
      volumes: projectStructure.volumes,
      worldData,
      characters
    };
    
    const result = await exportToPDF(projectData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Erro ao exportar PDF: ${result.error}`);
    }
  }, [currentProject, projectStructure.volumes, worldData, characters]);

  const handleExportEPUB = useCallback(async () => {
    const projectData = {
      project: currentProject,
      volumes: projectStructure.volumes,
      worldData,
      characters
    };
    
    const result = await exportToEPUB(projectData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Erro ao exportar EPUB: ${result.error}`);
    }
  }, [currentProject, projectStructure.volumes, worldData, characters]);

  const handleExportWord = useCallback(async () => {
    const projectData = {
      project: currentProject,
      volumes: projectStructure.volumes,
      worldData,
      characters
    };
    
    const result = await exportToWord(projectData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Erro ao exportar Word: ${result.error}`);
    }
  }, [currentProject, projectStructure.volumes, worldData, characters]);

  const handleExportStatistics = useCallback(() => {
    const projectData = {
      project: currentProject,
      volumes: projectStructure.volumes,
      worldData,
      characters
    };
    
    const result = exportStatistics(projectData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Erro ao exportar estatísticas: ${result.error}`);
    }
  }, [currentProject, projectStructure.volumes, worldData, characters]);

  const handleExportBackup = useCallback(() => {
    const projectData = {
      project: currentProject,
      volumes: projectStructure.volumes,
      worldData,
      characters,
      loreData: useStore.getState().loreData,
      narrativeData: useStore.getState().narrativeData
    };
    
    const result = exportBackup(projectData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Erro ao exportar backup: ${result.error}`);
    }
  }, [currentProject, projectStructure.volumes, worldData, characters]);

  // Insert character reference
  const insertCharacter = useCallback((character) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const insertText = `[${character.name}]`;
      
      if (range) {
        quill.insertText(range.index, insertText);
      } else {
        quill.insertText(quill.getLength(), insertText);
      }
    }
  }, []);

  // Insert location reference
  const insertLocation = useCallback((location) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const insertText = `[${location.name}]`;
      
      if (range) {
        quill.insertText(range.index, insertText);
      } else {
        quill.insertText(quill.getLength(), insertText);
      }
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {currentChapter ? currentChapter.title : 'Editor de Texto'}
              </h1>
              {currentVolume && (
                <p className="text-sm text-muted-foreground">
                  {currentVolume.title}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{wordCount.toLocaleString()} palavras</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{readingTime} min de leitura</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botões Principais */}
            <button
              onClick={handleManualSave}
              className="btn-primary flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </button>
            <button
              onClick={() => setShowAdvancedAI(true)}
              className="btn-secondary flex items-center bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              IA Avançada
            </button>
            <button
              onClick={() => setShowAIHelper(!showAIHelper)}
              className="btn-outline flex items-center"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Helper
            </button>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-outline flex items-center"
            >
              {isPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {isPreview ? 'Editar' : 'Visualizar'}
            </button>

            {/* Dropdown de Ferramentas */}
            <div className="relative">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="btn-outline flex items-center"
              >
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Ferramentas
              </button>
              
              {showToolsDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowChapterNav(!showChapterNav);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <BookOpen className="mr-3 h-4 w-4" />
                      Navegador de Capítulos
                    </button>
                    <button
                      onClick={() => {
                        setShowAnalytics(!showAnalytics);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <BarChart3 className="mr-3 h-4 w-4" />
                      Analytics
                    </button>
                    <button
                      onClick={() => {
                        setShowBackupManager(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Save className="mr-3 h-4 w-4" />
                      Gerenciar Backups
                    </button>
                    <button
                      onClick={() => {
                        setShowConsistencyChecker(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <CheckCircle className="mr-3 h-4 w-4" />
                      Verificar Consistência
                    </button>
                    <button
                      onClick={() => {
                        setShowNovelReader(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Book className="mr-3 h-4 w-4" />
                      Leitor Virtual
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chapter Navigator */}
        {showChapterNav && (
          <div className="w-64 bg-card border-r border-border">
            <ChapterNavigator
              onChapterSelect={handleChapterSelect}
              currentChapter={currentChapter}
              currentVolume={currentVolume}
            />
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col mr-80">
          {isPreview ? (
            <div className="flex-1 p-6 overflow-auto">
              <div 
                className="prose prose-lg max-w-none"
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

        {/* Sidebar */}
        {true && (
          <div className="w-80 bg-muted border-l border-border overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Progress Summary */}
              <ProgressSummary />
              {/* AI Helper */}
              {showAIHelper && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    Assistente IA
                  </h3>
                  
                  {selectedText && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Texto selecionado:</strong>
                      </p>
                      <p className="text-sm text-blue-700 mt-1 italic">
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
                        className="w-full text-left p-3 text-sm hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="text-sm">Gerando texto com IA...</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <textarea
                      placeholder="Ou escreva um prompt personalizado..."
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none"
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
              )}

              {/* Characters */}
              {characters.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Personagens
                  </h3>
                  <div className="space-y-2">
                    {characters.slice(0, 5).map((character) => (
                      <button
                        key={character.id}
                        onClick={() => insertCharacter(character)}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Locais
                  </h3>
                  <div className="space-y-2">
                    {worldData.locations.slice(0, 5).map((location) => (
                      <button
                        key={location.id}
                        onClick={() => insertLocation(location)}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Exportar
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={exportAsText}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Como Texto (.txt)
                  </button>
                  <button
                    onClick={exportAsHTML}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Como HTML (.html)
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Como Word (.doc)
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Como PDF (.html)
                  </button>
                  <button
                    onClick={handleExportEPUB}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Como EPUB (.json)
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleExportStatistics}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Estatísticas
                  </button>
                  <button
                    onClick={handleExportBackup}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Backup Completo
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Estatísticas
                </h3>
                <div className="space-y-2 text-sm">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Analytics Avançados</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full">
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
    </div>
  );
};

export default Editor;
