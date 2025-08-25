import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { currentProject, exportProject, importProject, addProject, settings } = useStore();

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

  // Componente para mostrar o status da IA
  const AIStatusIndicator = () => {
    const currentProvider = settings?.defaultAIProvider;
    const providerConfig = settings?.aiProviders?.[currentProvider];
    
    if (!currentProvider || !providerConfig?.apiKey) {
      return (
        <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          <Zap className="h-4 w-4 mr-1 text-gray-400" />
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
      openai: 'bg-green-100 text-green-800',
      anthropic: 'bg-orange-100 text-orange-800',
      google: 'bg-blue-100 text-blue-800',
      groq: 'bg-purple-100 text-purple-800'
    };

    return (
      <div className={`flex items-center px-3 py-1 rounded-full text-sm ${providerColors[currentProvider] || 'bg-gray-100 text-gray-800'}`}>
        <Zap className="h-4 w-4 mr-1" />
        <span className="font-medium">{providerNames[currentProvider] || currentProvider}</span>
        {providerConfig.defaultModel && (
          <span className="ml-1 opacity-75">• {providerConfig.defaultModel}</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Light Novel Creator</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentProject?.name || 'Light Novel Creator'}
                </h2>
                {currentProject && (
                  <p className="text-sm text-gray-500">
                    {currentProject.genre} • {currentProject.wordCount} palavras
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <AIStatusIndicator />
              {currentProject && (
                <button
                  onClick={() => toast.success('Projeto salvo!')}
                  className="btn-primary flex items-center"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </button>
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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
