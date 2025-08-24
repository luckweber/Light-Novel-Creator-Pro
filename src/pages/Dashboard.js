import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Globe, 
  FileText, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import useStore from '../store/useStore';
import AIIntegration from '../components/AI/AIIntegration';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    currentProject, 
    projects, 
    characters, 
    worldData, 
    loreData,
    editorContent
  } = useStore();

  const wordCount = editorContent.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = characters.length;
  const locationCount = worldData.locations.length;
  const loreCount = Object.values(loreData).flat().length;

  const stats = [
    {
      name: 'Palavras Escritas',
      value: wordCount.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Personagens',
      value: characterCount,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Locais',
      value: locationCount,
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Elementos de Lore',
      value: loreCount,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActions = [
    {
      name: 'Continuar Escrita',
      description: 'Retomar o editor de texto',
      href: '/editor',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Criar Personagem',
      description: 'Gerar novo personagem',
      href: '/character-generator',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Expandir Mundo',
      description: 'Adicionar locais e culturas',
      href: '/world-builder',
      icon: Globe,
      color: 'bg-purple-500'
    },
    {
      name: 'Assistente AI',
      description: 'Obter ajuda criativa',
      href: '/ai-assistant',
      icon: Sparkles,
      color: 'bg-pink-500'
    }
  ];

  const recentProjects = projects.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao seu criador de Light Novel
          </p>
        </div>
        {currentProject && (
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentProject.name}
            </h2>
            <p className="text-sm text-gray-500">
              Projeto Ativo
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Integration Status */}
      <AIIntegration onSettingsClick={() => navigate('/settings')} />

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {action.name}
                  </h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Projetos Recentes
          </h3>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {project.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {project.genre} • {project.wordCount} palavras
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Writing Progress */}
      {currentProject && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso da Escrita
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Palavras Escritas
              </span>
              <span className="text-sm text-gray-500">
                {wordCount.toLocaleString()} / {currentProject.targetWordCount || '∞'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${currentProject.targetWordCount ? Math.min((wordCount / currentProject.targetWordCount) * 100, 100) : 0}%`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Início</span>
              <span>Meta: {currentProject.targetWordCount?.toLocaleString() || 'Não definida'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          💡 Dica do Dia
        </h3>
        <p className="text-gray-700">
          Use o Assistente AI para gerar ideias quando estiver com bloqueio criativo. 
          Ele pode ajudar com desenvolvimento de personagens, enredos e descrições de cenários.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
