import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Edit3, 
  Globe, 
  Users, 
  ScrollText, 
  FileText, 
  Bot, 
  FolderOpen, 
  Settings,
  Menu,
  X,
  Save,
  Download,
  Upload,
  Plus,
  Zap,
  ChevronDown,
  Book,
  Calendar,
  Target
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import NotificationCenter from '../notifications/NotificationCenter';
import GlobalSearch from '../search/GlobalSearch';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const location = useLocation();
  const projectDropdownRef = useRef(null);
  const { currentProject, projects, setCurrentProject, restoreSelectedProject, exportProject, importProject, addProject, settings } = useStore();

  // Restaurar projeto selecionado ao carregar
  useEffect(() => {
    restoreSelectedProject();
  }, [restoreSelectedProject]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setProjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BookOpen },
    { name: 'Editor', href: '/editor', icon: Edit3 },
    { name: 'Construtor de Mundo', href: '/world-builder', icon: Globe },
    { name: 'Gerador de Personagens', href: '/character-generator', icon: Users },
    { name: 'Gerador de Lore', href: '/lore-generator', icon: ScrollText },
    { name: 'Gerador de Narrativa', href: '/narrative-generator', icon: FileText },
    { name: 'Assistente AI', href: '/ai-assistant', icon: Bot },
    { name: 'Projetos', href: '/projects', icon: FolderOpen },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const handleNewProject = () => {
    const projectName = prompt('Nome do novo projeto:');
    if (projectName) {
      addProject({
        name: projectName,
        description: '',
        genre: '',
        targetAudience: '',
        wordCount: 0,
        chapters: []
      });
      toast.success('Projeto criado com sucesso!');
    }
  };

  const handleExport = () => {
    if (!currentProject) {
      toast.error('Nenhum projeto selecionado');
      return;
    }
    exportProject();
    toast.success('Projeto exportado com sucesso!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const success = importProject(e.target.result);
          if (success) {
            toast.success('Projeto importado com sucesso!');
          } else {
            toast.error('Erro ao importar projeto');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setProjectDropdownOpen(false);
    toast.success(`Projeto "${project.name}" selecionado`);
  };

  const getProjectStats = (project) => {
    if (!project) return { chapters: 0, wordCount: 0, lastModified: null };
    
    const chapters = project.chapters?.length || 0;
    const wordCount = project.chapters?.reduce((total, chapter) => total + (chapter.wordCount || 0), 0) || 0;
    const lastModified = project.updatedAt || project.createdAt;
    
    return { chapters, wordCount, lastModified };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR');
  };

  // Componente para mostrar o status da IA
  const AIStatusIndicator = () => {
    const currentProvider = settings?.defaultAIProvider;
    const providerConfig = settings?.aiProviders?.[currentProvider];
    
    if (!currentProvider || !providerConfig?.apiKey) {
      return (
        <div className="flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
          <Zap className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>IA não configurada</span>
        </div>
      );
    }

    const providerNames = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      google: 'Google AI',
      groq: 'Groq'
    };

    const providerColors = {
      openai: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      anthropic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      google: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      groq: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <div className={`flex items-center px-3 py-1 rounded-full text-sm ${providerColors[currentProvider] || 'bg-muted text-muted-foreground'}`}>
        <Zap className="h-4 w-4 mr-1" />
        <span className="font-medium">{providerNames[currentProvider] || currentProvider}</span>
        {providerConfig.defaultModel && (
          <span className="ml-1 opacity-75">• {providerConfig.defaultModel}</span>
        )}
      </div>
    );
  };

  // Componente para o seletor de projetos
  const ProjectSelector = () => {
    const stats = getProjectStats(currentProject);
    
    return (
      <div className="relative" ref={projectDropdownRef}>
        <button
          onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
          className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Book className="h-5 w-5 text-primary-600" />
            <div className="text-left">
              <div className="font-medium text-card-foreground">
                {currentProject?.name || 'Selecionar Projeto'}
              </div>
              {currentProject && (
                <div className="text-xs text-muted-foreground flex items-center space-x-2">
                  <span>{stats.chapters} capítulos</span>
                  <span>•</span>
                  <span>{stats.wordCount.toLocaleString()} palavras</span>
                  <span>•</span>
                  <span>{formatDate(stats.lastModified)}</span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {projectDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              {projects && projects.length > 0 ? (
                <div className="space-y-1">
                  {projects.map((project) => {
                    const projectStats = getProjectStats(project);
                    const isSelected = currentProject?.id === project.id;
                    
                    return (
                      <button
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' 
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Book className={`h-4 w-4 ${isSelected ? 'text-primary-600' : 'text-muted-foreground'}`} />
                            <div>
                              <div className="font-medium text-card-foreground">{project.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                <span>{projectStats.chapters} capítulos</span>
                                <span>•</span>
                                <span>{projectStats.wordCount.toLocaleString()} palavras</span>
                                <span>•</span>
                                <span>{formatDate(projectStats.lastModified)}</span>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum projeto criado</p>
                  <p className="text-xs">Crie seu primeiro projeto para começar</p>
                </div>
              )}
              
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    handleNewProject();
                  }}
                  className="w-full flex items-center space-x-2 p-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar Novo Projeto</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-card-foreground">Light Novel Creator</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Project Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="space-y-2">
            <button
              onClick={handleNewProject}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="btn-outline flex items-center justify-center text-sm"
                title="Exportar Projeto"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleImport}
                className="btn-outline flex items-center justify-center text-sm"
                title="Importar Projeto"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <ProjectSelector />
            </div>

            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <NotificationCenter />
              <AIStatusIndicator />
              {currentProject && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExport}
                    className="btn-outline flex items-center"
                    title="Exportar Projeto"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </button>
                  <button
                    onClick={() => toast.success('Projeto salvo!')}
                    className="btn-primary flex items-center"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
