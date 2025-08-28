import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Globe, 
  FileText, 
  Calendar,
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Flame,
  AlertTriangle,
  Book
} from 'lucide-react';
import useStore from '../store/useStore';
import AIIntegration from '../components/AI/AIIntegration';
import ConsistencyChecker from '../components/editor/ConsistencyChecker';
import NovelReader from '../components/editor/NovelReader';
import LightNovelPDFExporter from '../components/editor/LightNovelPDFExporter';
import PDFExporterTest from '../components/editor/PDFExporterTest';
import AIInsightsCard from '../components/AI/AIInsightsCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showConsistencyChecker, setShowConsistencyChecker] = React.useState(false);
  const [showNovelReader, setShowNovelReader] = React.useState(false);
  const [showPDFExporter, setShowPDFExporter] = React.useState(false);
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

  // Sistema de metas
  const [dailyStats, setDailyStats] = React.useState(() => {
    const saved = localStorage.getItem('daily-writing-stats');
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = React.useState(() => {
    const saved = localStorage.getItem('writing-goals');
    return saved ? JSON.parse(saved) : [];
  });

  const getCurrentStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date();
    
    while (dailyStats[currentDate.toISOString().split('T')[0]]?.wordsWritten > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getWeeklyStats = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let totalWords = 0;
    let daysWithWriting = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayWords = dailyStats[dateStr]?.wordsWritten || 0;
      totalWords += dayWords;
      if (dayWords > 0) daysWithWriting++;
    }
    
    return { totalWords, daysWithWriting, averageWords: daysWithWriting > 0 ? Math.round(totalWords / daysWithWriting) : 0 };
  };

  const weeklyStats = getWeeklyStats();
  const currentStreak = getCurrentStreak();

  const stats = [
    {
      name: 'Palavras Escritas',
      value: wordCount.toLocaleString(),
      icon: FileText,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20'
    },
    {
      name: 'Personagens',
      value: characterCount,
      icon: Users,
      color: 'text-secondary-600 dark:text-secondary-400',
      bgColor: 'bg-secondary-50 dark:bg-secondary-900/20'
    },
    {
      name: 'Locais',
      value: locationCount,
      icon: Globe,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent'
    },
    {
      name: 'Elementos de Lore',
      value: loreCount,
      icon: BookOpen,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ];

  const goalStats = [
    {
      name: 'Streak Atual',
      value: currentStreak,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      name: 'Palavras Esta Semana',
      value: weeklyStats.totalWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'Média Diária',
      value: weeklyStats.averageWords.toLocaleString(),
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Dias Ativos',
      value: `${weeklyStats.daysWithWriting}/7`,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const quickActions = [
    {
      name: 'Continuar Escrita',
      description: 'Retomar o editor de texto',
      href: '/editor',
      icon: FileText,
      color: 'bg-primary-600'
    },
    {
      name: 'Criar Personagem',
      description: 'Gerar novo personagem',
      href: '/character-generator',
      icon: Users,
      color: 'bg-secondary-600'
    },
    {
      name: 'Expandir Mundo',
      description: 'Adicionar locais e culturas',
      href: '/world-builder',
      icon: Globe,
      color: 'bg-accent'
    },
    {
      name: 'Assistente AI',
      description: 'Obter ajuda criativa',
      href: '/ai-assistant',
      icon: Sparkles,
      color: 'bg-muted'
    }
  ];

  const recentProjects = projects.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo ao seu criador de Light Novel
          </p>
        </div>
        {currentProject && (
          <div className="text-right">
            <h2 className="text-lg font-semibold text-foreground">
              {currentProject.name}
            </h2>
            <p className="text-sm text-muted-foreground">
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
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Stats */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Metas de Escrita</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goalStats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Integration Status */}
      <AIIntegration onSettingsClick={() => navigate('/settings')} />

      {/* Test Consistency Checker */}
      <div className="card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Teste do Sistema de Feedback
        </h3>
        <button
          onClick={() => setShowConsistencyChecker(true)}
          className="btn-primary flex items-center"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Testar Feedback Light Novel
        </button>
      </div>

      {/* Novel Reader */}
      <div className="card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Leitor de Light Novel
        </h3>
        <button
          onClick={() => setShowNovelReader(true)}
          className="btn-primary flex items-center"
        >
          <Book className="mr-2 h-4 w-4" />
          Abrir Leitor Virtual
        </button>
      </div>

      {/* PDF Exporter */}
      <div className="card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Exportação Profissional
        </h3>
        <button
          onClick={() => setShowPDFExporter(true)}
          className="btn-secondary flex items-center bg-green-600 hover:bg-green-700 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Exportar PDF Profissional
        </button>
        
        {/* Teste do Exportador */}
        <div className="mt-4">
          <PDFExporterTest />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group block p-4 border border-border rounded-lg hover:border-border hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary-600">
                    {action.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Agent Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIInsightsCard />
        
        {/* Tips */}
        <div className="card bg-gradient-to-r from-primary-100/50 to-secondary-100/50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            💡 Dica do Dia
          </h3>
          <p className="text-foreground">
            Use o Assistente AI para gerar ideias quando estiver com bloqueio criativo. 
            Ele pode ajudar com desenvolvimento de personagens, enredos e descrições de cenários.
          </p>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Projetos Recentes
          </h3>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {project.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {project.genre} • {project.wordCount} palavras
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
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
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Progresso da Escrita
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Palavras Escritas
              </span>
              <span className="text-sm text-muted-foreground">
                {wordCount.toLocaleString()} / {currentProject.targetWordCount || '∞'}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${currentProject.targetWordCount ? Math.min((wordCount / currentProject.targetWordCount) * 100, 100) : 0}%`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Início</span>
              <span>Meta: {currentProject.targetWordCount?.toLocaleString() || 'Não definida'}</span>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default Dashboard;
