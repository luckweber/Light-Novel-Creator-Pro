import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Settings, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Moon, 
  Sun,
  RotateCcw,
  Download,
  Printer,
  Eye,
  EyeOff
} from 'lucide-react';
import useStore from '../../store/useStore';

const ReadingMode = ({ content, onClose }) => {
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [maxWidth, setMaxWidth] = useState(800);
  const [fontFamily, setFontFamily] = useState('serif');
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const fonts = [
    { value: 'serif', label: 'Serif (Times)', class: 'font-serif' },
    { value: 'sans', label: 'Sans (Arial)', class: 'font-sans' },
    { value: 'mono', label: 'Mono (Courier)', class: 'font-mono' },
    { value: 'georgia', label: 'Georgia', class: 'font-georgia' }
  ];

  const themes = [
    { name: 'Claro', bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' },
    { name: 'Escuro', bg: 'bg-gray-900', text: 'text-gray-100', border: 'border-gray-700' },
    { name: 'Sepia', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' },
    { name: 'Noturno', bg: 'bg-slate-900', text: 'text-slate-100', border: 'border-slate-700' }
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  // Calcular tempo de leitura (média de 200 palavras por minuto)
  useEffect(() => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const estimatedTime = Math.ceil(wordCount / 200);
    setReadingTime(estimatedTime);
  }, [content]);

  // Simular progresso de leitura
  useEffect(() => {
    if (isReading) {
      const interval = setInterval(() => {
        setReadingProgress(prev => {
          if (prev >= 100) {
            setIsReading(false);
            return 100;
          }
          return prev + (100 / (readingTime * 60)); // Progresso baseado no tempo estimado
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isReading, readingTime]);

  const startReading = () => {
    setIsReading(true);
    setReadingProgress(0);
  };

  const pauseReading = () => {
    setIsReading(false);
  };

  const resetReading = () => {
    setIsReading(false);
    setReadingProgress(0);
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    window.print();
  };

  const formatContent = (text) => {
    // Formatar o conteúdo para melhor legibilidade
    return text
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return <br key={index} />;
        return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
      });
  };

  const getCurrentFontClass = () => {
    const font = fonts.find(f => f.value === fontFamily);
    return font ? font.class : 'font-serif';
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className={`${currentTheme.bg} ${currentTheme.border} border-b px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <BookOpen className={`h-6 w-6 ${currentTheme.text}`} />
          <h1 className={`text-xl font-semibold ${currentTheme.text}`}>Modo de Leitura</h1>
          
          {/* Progresso de Leitura */}
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className={`text-sm ${currentTheme.text}`}>
              {Math.round(readingProgress)}%
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Controles de Leitura */}
          <button
            onClick={isReading ? pauseReading : startReading}
            className={`p-2 rounded-lg ${currentTheme.border} border ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            {isReading ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          
          <button
            onClick={resetReading}
            className={`p-2 rounded-lg ${currentTheme.border} border ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${currentTheme.border} border ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={exportToPDF}
            className={`p-2 rounded-lg ${currentTheme.border} border ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700`}
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Configurações */}
      {showSettings && (
        <div className={`${currentTheme.bg} ${currentTheme.border} border-b px-6 py-4`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tamanho da Fonte */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Tamanho da Fonte
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                  className="p-1 rounded border"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className={`w-12 text-center ${currentTheme.text}`}>{fontSize}px</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                  className="p-1 rounded border"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Altura da Linha */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Altura da Linha
              </label>
              <input
                type="range"
                min="1.2"
                max="2.4"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className={`text-sm ${currentTheme.text}`}>{lineHeight}</span>
            </div>

            {/* Largura Máxima */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Largura Máxima
              </label>
              <select
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                className={`w-full p-2 rounded border ${currentTheme.bg} ${currentTheme.text}`}
              >
                <option value={600}>Narrow (600px)</option>
                <option value={800}>Medium (800px)</option>
                <option value={1000}>Wide (1000px)</option>
                <option value={1200}>Extra Wide (1200px)</option>
              </select>
            </div>

            {/* Fonte */}
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                Fonte
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={`w-full p-2 rounded border ${currentTheme.bg} ${currentTheme.text}`}
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Temas */}
          <div className="mt-4">
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Tema
            </label>
            <div className="flex space-x-2">
              {themes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => setCurrentTheme(theme)}
                  className={`px-3 py-2 rounded border ${theme.bg} ${theme.text} ${theme.border} ${
                    currentTheme.name === theme.name ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto">
        <div 
          className="mx-auto py-8 px-6"
          style={{ 
            maxWidth: `${maxWidth}px`,
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight
          }}
        >
          <div className={`${getCurrentFontClass()} ${currentTheme.text}`}>
            {formatContent(content)}
          </div>
        </div>
      </div>

      {/* Footer com Estatísticas */}
      <div className={`${currentTheme.bg} ${currentTheme.border} border-t px-6 py-3`}>
        <div className="flex items-center justify-between text-sm">
          <div className={`${currentTheme.text}`}>
            <span>Tempo estimado de leitura: {readingTime} minutos</span>
            {isReading && (
              <span className="ml-4">• Lendo...</span>
            )}
          </div>
          <div className={`${currentTheme.text}`}>
            <span>{content.split(/\s+/).filter(word => word.length > 0).length} palavras</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingMode;
