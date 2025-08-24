import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  Type, 
  Bold, 
  Italic, 
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Settings,
  BookOpen,
  FileText,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Editor = () => {
  const { 
    editorContent, 
    setEditorContent, 
    addToHistory, 
    currentProject,
    characters,
    worldData,
    aiSettings
  } = useStore();

  const [isPreview, setIsPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const quillRef = useRef(null);

  // Quill modules configuration
  const modules = {
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
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image', 
    'blockquote', 'code-block', 'color', 'background'
  ];

  // Calculate statistics
  useEffect(() => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const readingTimeMinutes = Math.ceil(words.length / 200); // Average reading speed

    setWordCount(words.length);
    setCharCount(chars);
    setReadingTime(readingTimeMinutes);
  }, [editorContent]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorContent && currentProject) {
        addToHistory(editorContent);
        toast.success('Auto-salvo!', { duration: 1000 });
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [editorContent, currentProject, addToHistory]);

  // Handle text selection for AI helper
  const handleSelectionChange = (range, source, editor) => {
    if (range && range.length > 0) {
      const text = editor.getText(range.index, range.length);
      setSelectedText(text);
    } else {
      setSelectedText('');
    }
  };

  // AI Helper functions
  const generateWithAI = async (prompt) => {
    try {
      // Simulate AI response (replace with actual AI API call)
      const response = await simulateAIResponse(prompt);
      
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, response);
        } else {
          quill.insertText(quill.getLength(), response);
        }
      }
      
      toast.success('Texto gerado com AI!');
    } catch (error) {
      toast.error('Erro ao gerar texto com AI');
    }
  };

  const simulateAIResponse = async (prompt) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      'descrever personagem': 'O personagem se destacava pela presença marcante, com olhos que refletiam uma história de vida intensa e experiências que moldaram sua personalidade única.',
      'cena de ação': 'A tensão no ar era palpável enquanto os personagens se preparavam para o confronto inevitável, cada movimento calculado e preciso.',
      'diálogo': '"Você não entende o que está em jogo aqui," disse ele, sua voz carregada de emoção e determinação.',
      'descrição de cenário': 'O local se estendia diante deles como uma tela pintada pela natureza, com cores vibrantes e texturas que contavam a história de eras passadas.'
    };
    
    return responses[prompt] || 'Texto gerado com base na sua solicitação.';
  };

  // Export functions
  const exportAsText = () => {
    const text = editorContent.replace(/<[^>]*>/g, '');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'novel'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportado como texto!');
  };

  const exportAsHTML = () => {
    const blob = new Blob([editorContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'novel'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportado como HTML!');
  };

  // Insert character reference
  const insertCharacter = (character) => {
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
  };

  // Insert location reference
  const insertLocation = (location) => {
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
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Editor de Texto</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>{wordCount.toLocaleString()} palavras</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{readingTime} min de leitura</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAIHelper(!showAIHelper)}
              className="btn-secondary flex items-center"
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
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="btn-outline flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              Painel
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor */}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'mr-80' : ''}`}>
          {isPreview ? (
            <div className="flex-1 p-6 overflow-auto">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
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
                style={{ height: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* AI Helper */}
              {showAIHelper && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Assistente AI
                  </h3>
                  {selectedText && (
                    <div className="mb-3 p-2 bg-blue-50 rounded border">
                      <p className="text-sm text-gray-700">
                        <strong>Texto selecionado:</strong> "{selectedText}"
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {['descrever personagem', 'cena de ação', 'diálogo', 'descrição de cenário'].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => generateWithAI(prompt)}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
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
                    <span className="font-medium">{(editorContent.match(/<p>/g) || []).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
