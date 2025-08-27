import React, { useState, useCallback, useEffect } from 'react';
import { 
  Book, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  FileText,
  MoreHorizontal,
  GripVertical,
  Copy,
  Eye,
  Image
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import CoverManager from './CoverManager';

const ChapterNavigator = ({ onChapterSelect, currentChapter, currentVolume }) => {
  const {
    projectStructure,
    addVolume,
    addChapter,
    updateVolume,
    updateChapter,
    deleteVolume,
    deleteChapter
  } = useStore();

  const [expandedVolumes, setExpandedVolumes] = useState(new Set());
  const [editingVolume, setEditingVolume] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [volumeTitle, setVolumeTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showCoverManager, setShowCoverManager] = useState(false);
  const [coverManagerType, setCoverManagerType] = useState('volume');
  const [coverManagerItemId, setCoverManagerItemId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleVolume = useCallback((volumeId) => {
    setExpandedVolumes(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(volumeId)) {
        newExpanded.delete(volumeId);
      } else {
        newExpanded.add(volumeId);
      }
      return newExpanded;
    });
  }, []);

  const handleAddVolume = useCallback(() => {
    const title = prompt('Título do novo volume:');
    if (title && title.trim()) {
      addVolume({
        title: title.trim(),
        description: ''
      });
      toast.success('Volume criado!');
    }
  }, [addVolume]);

  const handleAddChapter = useCallback((volumeId) => {
    const title = prompt('Título do novo capítulo:');
    if (title && title.trim()) {
      addChapter(volumeId, {
        title: title.trim(),
        description: ''
      });
      toast.success('Capítulo criado!');
      
      // Auto-expand volume when adding chapter
      setExpandedVolumes(prev => new Set([...prev, volumeId]));
    }
  }, [addChapter]);

  const handleEditVolume = useCallback((volume) => {
    setEditingVolume(volume.id);
    setVolumeTitle(volume.title);
  }, []);

  const handleSaveVolume = useCallback((volumeId) => {
    if (volumeTitle.trim()) {
      updateVolume(volumeId, { title: volumeTitle.trim() });
      setEditingVolume(null);
      setVolumeTitle('');
      toast.success('Volume atualizado!');
    }
  }, [volumeTitle, updateVolume]);

  const handleEditChapter = useCallback((chapter) => {
    setEditingChapter(chapter.id);
    setChapterTitle(chapter.title);
  }, []);

  const handleSaveChapter = useCallback((volumeId, chapterId) => {
    if (chapterTitle.trim()) {
      updateChapter(volumeId, chapterId, { title: chapterTitle.trim() });
      setEditingChapter(null);
      setChapterTitle('');
      toast.success('Capítulo atualizado!');
    }
  }, [chapterTitle, updateChapter]);

  const handleDeleteVolume = useCallback((volumeId) => {
    if (window.confirm('Tem certeza que deseja excluir este volume e todos os seus capítulos?')) {
      deleteVolume(volumeId);
      toast.success('Volume excluído!');
    }
  }, [deleteVolume]);

  const handleDeleteChapter = useCallback((volumeId, chapterId) => {
    if (window.confirm('Tem certeza que deseja excluir este capítulo?')) {
      deleteChapter(volumeId, chapterId);
      toast.success('Capítulo excluído!');
    }
  }, [deleteChapter]);

  const handleOpenCoverManager = useCallback((type, itemId) => {
    setCoverManagerType(type);
    setCoverManagerItemId(itemId);
    setShowCoverManager(true);
  }, []);

  const handleDropdownToggle = useCallback((dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  }, [openDropdown]);

  const handleDropdownClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleDuplicateChapter = useCallback((volumeId, chapter) => {
    const newTitle = `${chapter.title} (Cópia)`;
    addChapter(volumeId, {
      title: newTitle,
      description: chapter.description || '',
      content: chapter.content || ''
    });
    toast.success('Capítulo duplicado!');
  }, [addChapter]);

  const getTotalWords = useCallback((volume) => {
    return volume.chapters.reduce((total, chapter) => total + (chapter.wordCount || 0), 0);
  }, []);

  const getChapterStatus = useCallback((chapter) => {
    if (!chapter.content || chapter.content.trim() === '') {
      return { status: 'empty', label: 'Vazio', color: 'text-gray-400' };
    }
    if (chapter.wordCount < 500) {
      return { status: 'draft', label: 'Rascunho', color: 'text-yellow-600' };
    }
    if (chapter.wordCount < 2000) {
      return { status: 'progress', label: 'Em progresso', color: 'text-blue-600' };
    }
    return { status: 'complete', label: 'Completo', color: 'text-green-600' };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Book className="h-5 w-5 mr-2 text-blue-600" />
            Estrutura
          </h3>
          <button
            onClick={handleAddVolume}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Adicionar Volume"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {projectStructure.volumes.length === 0 ? (
          <div className="p-4 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-sm mb-3">Nenhum volume criado</p>
            <button
              onClick={handleAddVolume}
              className="btn-primary text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Criar Primeiro Volume
            </button>
          </div>
        ) : (
          <div className="p-2">
            {projectStructure.volumes.map((volume) => (
              <div key={volume.id} className="mb-2">
                {/* Volume Header */}
                <div className={`flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  currentVolume?.id === volume.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}>
                  <button
                    onClick={() => toggleVolume(volume.id)}
                    className="p-1 hover:bg-gray-200 rounded mr-1 transition-colors"
                  >
                    {expandedVolumes.has(volume.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  <Book className="h-4 w-4 mr-2 text-blue-600" />
                  
                  {editingVolume === volume.id ? (
                    <input
                      value={volumeTitle}
                      onChange={(e) => setVolumeTitle(e.target.value)}
                      onBlur={() => handleSaveVolume(volume.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveVolume(volume.id);
                        if (e.key === 'Escape') {
                          setEditingVolume(null);
                          setVolumeTitle('');
                        }
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                      {volume.title}
                    </span>
                  )}

                  <div className="flex items-center space-x-1 ml-2">
                    <span className="text-xs text-gray-500">
                      {getTotalWords(volume).toLocaleString()}
                    </span>
                                         <div className="relative dropdown-container">
                       <button 
                         className="p-1 hover:bg-gray-200 rounded transition-colors"
                         onClick={() => handleDropdownToggle(`volume-${volume.id}`)}
                       >
                         <MoreHorizontal className="h-3 w-3" />
                       </button>
                       {openDropdown === `volume-${volume.id}` && (
                         <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                        <button
                          onClick={() => handleEditVolume(volume)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                        >
                          <Edit3 className="h-3 w-3 mr-2" />
                          Renomear
                        </button>
                        <button
                          onClick={() => handleAddChapter(volume.id)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Novo Capítulo
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => handleOpenCoverManager('volume', volume.id)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                        >
                          <Image className="h-3 w-3 mr-2" />
                          Gerenciar Capa
                        </button>
                                                 <button
                           onClick={() => handleDeleteVolume(volume.id)}
                           className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 text-red-600 flex items-center transition-colors"
                         >
                           <Trash2 className="h-3 w-3 mr-2" />
                           Excluir
                         </button>
                       </div>
                         )}
                     </div>
                  </div>
                </div>

                {/* Chapters */}
                {expandedVolumes.has(volume.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {volume.chapters.map((chapter) => {
                      const status = getChapterStatus(chapter);
                      return (
                                                 <div
                           key={chapter.id}
                           className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors group ${
                             currentChapter?.id === chapter.id ? 'bg-blue-50 border border-blue-200' : ''
                           }`}
                           onClick={() => onChapterSelect(volume, chapter)}
                         >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          
                          {editingChapter === chapter.id ? (
                            <input
                              value={chapterTitle}
                              onChange={(e) => setChapterTitle(e.target.value)}
                              onBlur={() => handleSaveChapter(volume.id, chapter.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveChapter(volume.id, chapter.id);
                                if (e.key === 'Escape') {
                                  setEditingChapter(null);
                                  setChapterTitle('');
                                }
                              }}
                              className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-700 truncate block">
                                {chapter.title}
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs ${status.color} font-medium`}>
                                  {status.label}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {(chapter.wordCount || 0).toLocaleString()} palavras
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-1 ml-2">
                                                         <div className="relative dropdown-container">
                               <button 
                                 className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-all"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDropdownToggle(`chapter-${chapter.id}`);
                                 }}
                                 onMouseEnter={(e) => {
                                   e.stopPropagation();
                                   // Mostrar o botão no hover
                                 }}
                               >
                                 <MoreHorizontal className="h-3 w-3" />
                               </button>
                               {openDropdown === `chapter-${chapter.id}` && (
                                 <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditChapter(chapter);
                                  }}
                                  className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                                >
                                  <Edit3 className="h-3 w-3 mr-2" />
                                  Renomear
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateChapter(volume.id, chapter);
                                  }}
                                  className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                                >
                                  <Copy className="h-3 w-3 mr-2" />
                                  Duplicar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenCoverManager('chapter', chapter.id);
                                  }}
                                  className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center transition-colors"
                                >
                                  <Image className="h-3 w-3 mr-2" />
                                  Gerenciar Capa
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleDeleteChapter(volume.id, chapter.id);
                                   }}
                                   className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 text-red-600 flex items-center transition-colors"
                                 >
                                   <Trash2 className="h-3 w-3 mr-2" />
                                   Excluir
                                 </button>
                               </div>
                                 )}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Chapter Button */}
                    <button
                      onClick={() => handleAddChapter(volume.id)}
                      className="flex items-center p-2 w-full text-left text-sm text-gray-500 hover:bg-gray-50 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Capítulo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cover Manager Modal */}
      {showCoverManager && (
        <CoverManager
          onClose={() => setShowCoverManager(false)}
          type={coverManagerType}
          itemId={coverManagerItemId}
        />
      )}
    </div>
  );
};

export default ChapterNavigator;
