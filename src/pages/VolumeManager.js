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
  Image,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  BarChart3,
  Settings,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertCircle,
  Info,
  Clock,
  User,
  Tag,
  Star,
  Heart,
  Share2,
  Archive,
  RefreshCw,
  Grid,
  List,
  Columns,
  EyeOff,
  Lock,
  Unlock,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  FilePlus,
  FolderPlus,
  Move,
  Link,
  Unlink,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as ListIcon,
  Hash,
  Quote,
  Code,
  Table,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Folder,
  HardDrive,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Volume1,
  Bell,
  BellOff,
  BellRing,
  Mail,
  MessageSquare,
  Phone,
  Video as VideoIcon,
  Camera,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Database,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  UserMinus,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge,
  Certificate,
  Diploma,
  GraduationCap,
  School,
  University,
  Building,
  Home,
  Store,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  AreaChart,
  Scatter,
  Map,
  Globe,
  Navigation,
  Compass,
  MapPin,
  Navigation2,
  Flag,
  Target,
  Crosshair,
  Zap,
  ZapOff,
  Power,
  PowerOff,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryEmpty,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Bluetooth,
  BluetoothOff,
  Airplay,
  Cast,
  MonitorOff,
  MonitorSpeaker,
  MonitorSmartphone,
  MonitorLaptop,
  MonitorTablet,
  MonitorDesktop,
  MonitorCheck,
  MonitorX,
  MonitorPause,
  MonitorPlay,
  MonitorStop,
  MonitorSkipBack,
  MonitorSkipForward,
  MonitorRewind,
  MonitorFastForward,
  MonitorVolume,
  MonitorVolume1,
  MonitorVolume2,
  MonitorVolumeX,
  MonitorMute,
  MonitorUnmute,
  MonitorPause as MonitorPauseIcon,
  MonitorPlay as MonitorPlayIcon,
  MonitorStop as MonitorStopIcon,
  MonitorSkipBack as MonitorSkipBackIcon,
  MonitorSkipForward as MonitorSkipForwardIcon,
  MonitorRewind as MonitorRewindIcon,
  MonitorFastForward as MonitorFastForwardIcon,
  MonitorVolume as MonitorVolumeIcon,
  MonitorVolume1 as MonitorVolume1Icon,
  MonitorVolume2 as MonitorVolume2Icon,
  MonitorVolumeX as MonitorVolumeXIcon,
  MonitorMute as MonitorMuteIcon,
  MonitorUnmute as MonitorUnmuteIcon
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import CoverManager from '../components/editor/CoverManager';

const VolumeManager = () => {
  const {
    projectStructure,
    addVolume,
    addChapter,
    updateVolume,
    updateChapter,
    deleteVolume,
    deleteChapter,
    setCurrentVolume,
    setCurrentChapter
  } = useStore();

  // Estados locais
  const [expandedVolumes, setExpandedVolumes] = useState(new Set());
  const [editingVolume, setEditingVolume] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [volumeTitle, setVolumeTitle] = useState('');
  const [volumeDescription, setVolumeDescription] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showCoverManager, setShowCoverManager] = useState(false);
  const [coverManagerType, setCoverManagerType] = useState('volume');
  const [coverManagerItemId, setCoverManagerItemId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, volumes, chapters
  const [sortBy, setSortBy] = useState('title'); // title, date, wordCount
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [viewMode, setViewMode] = useState('list'); // list, grid, compact
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [currentVolumeId, setCurrentVolumeId] = useState(null);

  // Estatísticas
  const stats = React.useMemo(() => {
    const totalVolumes = projectStructure.volumes.length;
    const totalChapters = projectStructure.volumes.reduce((acc, vol) => acc + vol.chapters.length, 0);
    const totalWords = projectStructure.volumes.reduce((acc, vol) => 
      acc + vol.chapters.reduce((chAcc, ch) => chAcc + (ch.wordCount || 0), 0), 0
    );
    const avgWordsPerChapter = totalChapters > 0 ? Math.round(totalWords / totalChapters) : 0;
    const avgChaptersPerVolume = totalVolumes > 0 ? Math.round(totalChapters / totalVolumes) : 0;

    return {
      totalVolumes,
      totalChapters,
      totalWords,
      avgWordsPerChapter,
      avgChaptersPerVolume
    };
  }, [projectStructure]);

  // Funções de utilidade
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

  const expandAllVolumes = useCallback(() => {
    const allVolumeIds = new Set(projectStructure.volumes.map(v => v.id));
    setExpandedVolumes(allVolumeIds);
  }, [projectStructure.volumes]);

  const collapseAllVolumes = useCallback(() => {
    setExpandedVolumes(new Set());
  }, []);

  // Funções de CRUD para Volumes
  const handleAddVolume = useCallback(() => {
    setShowVolumeModal(true);
    setVolumeTitle('');
    setVolumeDescription('');
  }, []);

  const handleSaveVolume = useCallback(() => {
    if (volumeTitle.trim()) {
      if (editingVolume) {
        updateVolume(editingVolume, { 
          title: volumeTitle.trim(),
          description: volumeDescription.trim()
        });
        toast.success('Volume atualizado!');
      } else {
        addVolume({
          title: volumeTitle.trim(),
          description: volumeDescription.trim()
        });
        toast.success('Volume criado!');
      }
      setShowVolumeModal(false);
      setEditingVolume(null);
      setVolumeTitle('');
      setVolumeDescription('');
    }
  }, [volumeTitle, volumeDescription, editingVolume, addVolume, updateVolume]);

  const handleEditVolume = useCallback((volume) => {
    setEditingVolume(volume.id);
    setVolumeTitle(volume.title);
    setVolumeDescription(volume.description || '');
    setShowVolumeModal(true);
  }, []);

  const handleDeleteVolume = useCallback((volumeId) => {
    if (window.confirm('Tem certeza que deseja excluir este volume e todos os seus capítulos?')) {
      deleteVolume(volumeId);
      toast.success('Volume excluído!');
    }
  }, [deleteVolume]);

  // Funções de CRUD para Capítulos
  const handleAddChapter = useCallback((volumeId) => {
    setCurrentVolumeId(volumeId);
    setShowChapterModal(true);
    setChapterTitle('');
    setChapterDescription('');
  }, []);

  const handleSaveChapter = useCallback(() => {
    if (chapterTitle.trim() && currentVolumeId) {
      if (editingChapter) {
        updateChapter(currentVolumeId, editingChapter, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim()
        });
        toast.success('Capítulo atualizado!');
      } else {
        addChapter(currentVolumeId, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim()
        });
        toast.success('Capítulo criado!');
        // Auto-expand volume when adding chapter
        setExpandedVolumes(prev => new Set([...prev, currentVolumeId]));
      }
      setShowChapterModal(false);
      setEditingChapter(null);
      setChapterTitle('');
      setChapterDescription('');
      setCurrentVolumeId(null);
    }
  }, [chapterTitle, chapterDescription, editingChapter, currentVolumeId, addChapter, updateChapter]);

  const handleEditChapter = useCallback((volumeId, chapter) => {
    setCurrentVolumeId(volumeId);
    setEditingChapter(chapter.id);
    setChapterTitle(chapter.title);
    setChapterDescription(chapter.description || '');
    setShowChapterModal(true);
  }, []);

  const handleDeleteChapter = useCallback((volumeId, chapterId) => {
    if (window.confirm('Tem certeza que deseja excluir este capítulo?')) {
      deleteChapter(volumeId, chapterId);
      toast.success('Capítulo excluído!');
    }
  }, [deleteChapter]);

  // Funções de gerenciamento de capas
  const handleOpenCoverManager = useCallback((type, itemId) => {
    setCoverManagerType(type);
    setCoverManagerItemId(itemId);
    setShowCoverManager(true);
  }, []);

  // Funções de filtro e busca
  const filteredVolumes = React.useMemo(() => {
    let filtered = projectStructure.volumes;

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(volume => 
        volume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volume.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volume.chapters.some(chapter => 
          chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'wordCount':
          aValue = a.chapters.reduce((acc, ch) => acc + (ch.wordCount || 0), 0);
          bValue = b.chapters.reduce((acc, ch) => acc + (ch.wordCount || 0), 0);
          break;
        case 'chapters':
          aValue = a.chapters.length;
          bValue = b.chapters.length;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projectStructure.volumes, searchTerm, sortBy, sortOrder]);

  // Funções de seleção múltipla
  const toggleItemSelection = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = new Set();
    projectStructure.volumes.forEach(volume => {
      allIds.add(volume.id);
      volume.chapters.forEach(chapter => {
        allIds.add(chapter.id);
      });
    });
    setSelectedItems(allIds);
  }, [projectStructure.volumes]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  // Funções de ação em massa
  const handleBulkDelete = useCallback(() => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedItems.size} itens selecionados?`)) {
      selectedItems.forEach(itemId => {
        // Verificar se é volume ou capítulo
        const volume = projectStructure.volumes.find(v => v.id === itemId);
        if (volume) {
          deleteVolume(itemId);
        } else {
          // Procurar capítulo
          for (const vol of projectStructure.volumes) {
            const chapter = vol.chapters.find(c => c.id === itemId);
            if (chapter) {
              deleteChapter(vol.id, itemId);
              break;
            }
          }
        }
      });
      toast.success(`${selectedItems.size} itens excluídos!`);
      clearSelection();
    }
  }, [selectedItems, projectStructure.volumes, deleteVolume, deleteChapter, clearSelection]);

  // Componente de estatísticas
  const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-900/10 border border-${color}-200 dark:border-${color}-800 rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  // Componente de volume
  const VolumeCard = ({ volume }) => {
    const isExpanded = expandedVolumes.has(volume.id);
    const isSelected = selectedItems.has(volume.id);
    const wordCount = volume.chapters.reduce((acc, ch) => acc + (ch.wordCount || 0), 0);

    return (
      <div className={`border rounded-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItemSelection(volume.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <button
                onClick={() => toggleVolume(volume.id)}
                className="flex items-center space-x-2 text-left hover:text-blue-600 transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Book className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{volume.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {volume.chapters.length} capítulos • {wordCount.toLocaleString()} palavras
                  </p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditVolume(volume)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleOpenCoverManager('volume', volume.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Image className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteVolume(volume.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {volume.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{volume.description}</p>
          )}

          {isExpanded && (
            <div className="mt-4 space-y-2">
              {volume.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} volume={volume} chapter={chapter} />
              ))}
              
              <button
                onClick={() => handleAddChapter(volume.id)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Capítulo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente de capítulo
  const ChapterCard = ({ volume, chapter }) => {
    const isSelected = selectedItems.has(chapter.id);

    return (
      <div className={`ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleItemSelection(chapter.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{chapter.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {chapter.wordCount?.toLocaleString() || 0} palavras
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditChapter(volume.id, chapter)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Edit3 className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleOpenCoverManager('chapter', chapter.id)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Image className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleDeleteChapter(volume.id, chapter.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {chapter.description && (
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{chapter.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciador de Volumes</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Organize e gerencie seus volumes e capítulos de forma eficiente
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddVolume}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Volume
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total de Volumes" value={stats.totalVolumes} icon={Book} color="blue" />
          <StatsCard title="Total de Capítulos" value={stats.totalChapters} icon={FileText} color="green" />
          <StatsCard title="Total de Palavras" value={stats.totalWords.toLocaleString()} icon={Type} color="purple" />
          <StatsCard title="Média por Capítulo" value={stats.avgWordsPerChapter} icon={BarChart3} color="yellow" />
          <StatsCard title="Capítulos por Volume" value={stats.avgChaptersPerVolume} icon={BarChart3} color="red" />
        </div>

        {/* Controles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar volumes e capítulos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="title">Ordenar por Título</option>
                <option value="date">Ordenar por Data</option>
                <option value="wordCount">Ordenar por Palavras</option>
                <option value="chapters">Ordenar por Capítulos</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={expandAllVolumes}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Expandir Tudo
              </button>
              <button
                onClick={collapseAllVolumes}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Recolher Tudo
              </button>
            </div>
          </div>
        </div>

        {/* Ações em massa */}
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedItems.size} item(s) selecionado(s)
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Limpar seleção
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir Selecionados
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de volumes */}
        <div className="space-y-4">
          {filteredVolumes.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum volume encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando seu primeiro volume.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddVolume}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Volume
                </button>
              )}
            </div>
          ) : (
            filteredVolumes.map((volume) => (
              <VolumeCard key={volume.id} volume={volume} />
            ))
          )}
        </div>
      </div>

      {/* Modal de Volume */}
      {showVolumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingVolume ? 'Editar Volume' : 'Novo Volume'}
              </h2>
              <button
                onClick={() => setShowVolumeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={volumeTitle}
                  onChange={(e) => setVolumeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o título do volume"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={volumeDescription}
                  onChange={(e) => setVolumeDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite uma descrição para o volume"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowVolumeModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveVolume}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editingVolume ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Capítulo */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingChapter ? 'Editar Capítulo' : 'Novo Capítulo'}
              </h2>
              <button
                onClick={() => setShowChapterModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o título do capítulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={chapterDescription}
                  onChange={(e) => setChapterDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite uma descrição para o capítulo"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChapter}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editingChapter ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default VolumeManager;
