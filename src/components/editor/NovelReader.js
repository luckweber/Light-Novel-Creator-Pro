import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Type,
  X,
  Play,
  Pause,
  RotateCcw,
  Book,
  FileText,
  List,
  Grid,
  Sliders
} from 'lucide-react';
import useStore from '../../store/useStore';

const NovelReader = ({ onClose }) => {
  const [currentVolume, setCurrentVolume] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(1);
  const [viewMode, setViewMode] = useState('book'); // 'book', 'list', 'grid'
  const [showSettings, setShowSettings] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const { currentProject, projectStructure } = useStore();

  // Usar estrutura real do projeto
  const novelStructure = projectStructure?.volumes?.length > 0 ? projectStructure : {
    volumes: [
      {
        id: 1,
        title: "Volume 1: Introdução",
        chapters: [
          { 
            id: 1, 
            title: "Capítulo 1: Início", 
            content: currentProject?.description || "Nenhum conteúdo disponível. Comece a escrever no editor para ver o conteúdo aqui."
          }
        ]
      }
    ]
  };

  // Função para obter conteúdo do capítulo
  const getChapterContent = (volumeId, chapterId) => {
    const volume = novelStructure.volumes.find(v => v.id === volumeId);
    const chapter = volume?.chapters.find(c => c.id === chapterId);
    return chapter?.content || "Conteúdo não disponível. Este capítulo ainda não foi escrito.";
  };

  // Verificar se há conteúdo real no projeto
  const hasRealContent = novelStructure.volumes.some(volume => 
    volume.chapters.some(chapter => chapter.content && chapter.content.trim().length > 0)
  );

  const currentVolumeData = novelStructure.volumes.find(v => v.id === currentVolume);
  const currentChapterData = currentVolumeData?.chapters.find(c => c.id === currentChapter);

  const nextChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    const totalChapters = getTotalChaptersInVolume();
    
    if (currentIndex < totalChapters - 1) {
      // Próximo capítulo no mesmo volume
      const nextChapterData = currentVolumeData.chapters[currentIndex + 1];
      setCurrentChapter(nextChapterData.id);
    } else if (currentVolume < novelStructure.volumes.length) {
      // Primeiro capítulo do próximo volume
      const nextVolume = novelStructure.volumes.find(v => v.id === currentVolume + 1);
      if (nextVolume && nextVolume.chapters.length > 0) {
        setCurrentVolume(currentVolume + 1);
        setCurrentChapter(nextVolume.chapters[0].id);
      }
    }
  };

  const prevChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    
    if (currentIndex > 0) {
      // Capítulo anterior no mesmo volume
      const prevChapterData = currentVolumeData.chapters[currentIndex - 1];
      setCurrentChapter(prevChapterData.id);
    } else if (currentVolume > 1) {
      // Último capítulo do volume anterior
      const prevVolume = novelStructure.volumes.find(v => v.id === currentVolume - 1);
      if (prevVolume && prevVolume.chapters.length > 0) {
        setCurrentVolume(currentVolume - 1);
        setCurrentChapter(prevVolume.chapters[prevVolume.chapters.length - 1].id);
      }
    }
  };

  // Função para obter o índice do capítulo atual no volume
  const getCurrentChapterIndex = () => {
    return currentVolumeData?.chapters.findIndex(c => c.id === currentChapter) || 0;
  };

  // Função para obter o total de capítulos no volume atual
  const getTotalChaptersInVolume = () => {
    return currentVolumeData?.chapters.length || 0;
  };

  const goToChapter = (volumeId, chapterId) => {
    setCurrentVolume(volumeId);
    setCurrentChapter(chapterId);
    setShowTableOfContents(false);
  };

  // Inicializar com o primeiro volume e capítulo disponíveis
  useEffect(() => {
    if (novelStructure.volumes.length > 0) {
      const firstVolume = novelStructure.volumes[0];
      if (firstVolume.chapters.length > 0) {
        setCurrentVolume(firstVolume.id);
        setCurrentChapter(firstVolume.chapters[0].id);
      }
    }
  }, [novelStructure]);

  useEffect(() => {
    if (isAutoScroll) {
      const interval = setInterval(() => {
        const reader = document.getElementById('novel-content');
        if (reader) {
          reader.scrollTop += autoScrollSpeed;
          if (reader.scrollTop >= reader.scrollHeight - reader.clientHeight) {
            nextChapter();
            reader.scrollTop = 0;
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAutoScroll, autoScrollSpeed, currentVolume, currentChapter]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 w-screen h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <div className={`w-full h-full flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-amber-100 border-amber-200'}`}>
          <div className="flex items-center space-x-4">
            <BookOpen className="h-6 w-6 text-amber-600" />
            <div>
              <h1 className="text-lg font-semibold">{currentProject?.title || 'Minha Light Novel'}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentVolumeData?.title} - {currentChapterData?.title}
              </p>
              {!hasRealContent && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ Nenhum conteúdo encontrado. Escreva no editor para ver o conteúdo aqui.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700"
              title="Sumário"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700"
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex w-full h-full flex-1">
          {/* Sidebar - Sumário */}
          {showTableOfContents && (
            <div className={`w-80 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-amber-50 border-amber-200'}`}>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Sumário</h3>
                <div className="space-y-4">
                  {novelStructure.volumes.map((volume) => (
                    <div key={volume.id} className="space-y-2">
                      <h4 className="font-medium text-amber-600">{volume.title}</h4>
                      <div className="ml-4 space-y-1">
                        {volume.chapters.map((chapter) => (
                          <button
                            key={chapter.id}
                            onClick={() => goToChapter(volume.id, chapter.id)}
                            className={`w-full text-left p-2 rounded text-sm hover:bg-amber-200 dark:hover:bg-gray-700 ${
                              currentVolume === volume.id && currentChapter === chapter.id
                                ? 'bg-amber-300 dark:bg-gray-600'
                                : ''
                            }`}
                          >
                            {chapter.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Configurações */}
          {showSettings && (
            <div className={`w-80 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-amber-50 border-amber-200'}`}>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Configurações</h3>
                
                {/* Modo Escuro */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Modo Escuro</span>
                    {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </label>
                </div>

                {/* Tamanho da Fonte */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Tamanho da Fonte</label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{fontSize}px</span>
                </div>

                {/* Altura da Linha */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Altura da Linha</label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{lineHeight}</span>
                </div>

                {/* Auto-scroll */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isAutoScroll}
                      onChange={(e) => setIsAutoScroll(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Auto-scroll</span>
                    {isAutoScroll ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </label>
                  
                  {isAutoScroll && (
                    <div className="mt-2 ml-6">
                      <label className="block text-xs mb-1">Velocidade</label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={autoScrollSpeed}
                        onChange={(e) => setAutoScrollSpeed(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{autoScrollSpeed}x</span>
                    </div>
                  )}
                </div>

                {/* Modo de Visualização */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Modo de Visualização</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('book')}
                      className={`p-2 rounded ${viewMode === 'book' ? 'bg-amber-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                      title="Livro"
                    >
                      <Book className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                      title="Lista"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                      title="Grade"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col w-full">
            {/* Controles de Navegação */}
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-amber-100 border-amber-200'}`}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevChapter}
                  disabled={currentVolume === 1 && getCurrentChapterIndex() === 0}
                  className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  title="Capítulo Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Volume {currentVolumeData?.title || currentVolume}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm">Capítulo {getCurrentChapterIndex() + 1}</span>
                </div>

                <button
                  onClick={nextChapter}
                  disabled={currentVolume === novelStructure.volumes.length && getCurrentChapterIndex() === getTotalChaptersInVolume() - 1}
                  className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  title="Próximo Capítulo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {getCurrentChapterIndex() + 1} de {getTotalChaptersInVolume()} capítulos
                </span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((getCurrentChapterIndex() + 1) / getTotalChaptersInVolume()) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Área de Leitura */}
            <div className="flex-1 overflow-hidden w-full">
              {viewMode === 'book' ? (
                // Modo Livro
                <div className="h-full flex w-full">
                  {/* Página Esquerda */}
                  <div className={`flex-1 p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                    <div
                      id="novel-content"
                      className={`h-full overflow-y-auto pr-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: lineHeight,
                        fontFamily: 'serif'
                      }}
                    >
                      <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">{currentChapterData?.title}</h2>
                        <div className="prose prose-lg max-w-none">
                          {(() => {
                            const content = getChapterContent(currentVolume, currentChapter);
                            // Se o conteúdo tem HTML, renderizar como HTML
                            if (content.includes('<')) {
                              return (
                                <div 
                                  dangerouslySetInnerHTML={{ __html: content }}
                                  className="text-justify leading-relaxed"
                                />
                              );
                            }
                            // Se não tem HTML, dividir por parágrafos
                            return content.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="mb-4 text-justify leading-relaxed">
                                {paragraph}
                              </p>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Página Direita */}
                  <div className={`flex-1 p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                    <div className={`h-full border-l ${isDarkMode ? 'border-gray-700' : 'border-amber-200'}`}>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Notas do Capítulo</h3>
                        <div className="space-y-2 text-sm">
                          <p>• Este capítulo introduz novos elementos da história</p>
                          <p>• Desenvolvimento do personagem principal</p>
                          <p>• Preparação para eventos futuros</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                // Modo Lista
                <div className={`h-full w-full p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                  <div
                    id="novel-content"
                    className={`h-full overflow-y-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight
                    }}
                  >
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold mb-8 text-center">{currentChapterData?.title}</h2>
                      <div className="prose prose-xl max-w-none">
                        {(() => {
                          const content = getChapterContent(currentVolume, currentChapter);
                          // Se o conteúdo tem HTML, renderizar como HTML
                          if (content.includes('<')) {
                            return (
                              <div 
                                dangerouslySetInnerHTML={{ __html: content }}
                                className="text-justify leading-relaxed"
                              />
                            );
                          }
                          // Se não tem HTML, dividir por parágrafos
                          return content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6 text-justify leading-relaxed">
                              {paragraph}
                            </p>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Modo Grade
                <div className={`h-full w-full p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
                  <div
                    id="novel-content"
                    className={`h-full overflow-y-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight
                    }}
                  >
                    <div className="max-w-6xl mx-auto">
                      <h2 className="text-2xl font-bold mb-6 text-center">{currentChapterData?.title}</h2>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="prose prose-lg max-w-none">
                          {(() => {
                            const content = getChapterContent(currentVolume, currentChapter);
                            const paragraphs = content.includes('<') ? 
                              [content] : 
                              content.split('\n\n');
                            const halfLength = Math.ceil(paragraphs.length / 2);
                            
                            return paragraphs.slice(0, halfLength).map((paragraph, index) => (
                              <div key={index} className="mb-4 text-justify leading-relaxed">
                                {content.includes('<') ? (
                                  <div dangerouslySetInnerHTML={{ __html: paragraph }} />
                                ) : (
                                  <p>{paragraph}</p>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                        <div className="prose prose-lg max-w-none">
                          {(() => {
                            const content = getChapterContent(currentVolume, currentChapter);
                            const paragraphs = content.includes('<') ? 
                              [content] : 
                              content.split('\n\n');
                            const halfLength = Math.ceil(paragraphs.length / 2);
                            
                            return paragraphs.slice(halfLength).map((paragraph, index) => (
                              <div key={index} className="mb-4 text-justify leading-relaxed">
                                {content.includes('<') ? (
                                  <div dangerouslySetInnerHTML={{ __html: paragraph }} />
                                ) : (
                                  <p>{paragraph}</p>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelReader;
