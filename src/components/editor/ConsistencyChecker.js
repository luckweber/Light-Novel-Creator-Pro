import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  BookOpen,
  User,
  MapPin,
  Clock,
  Search,
  Info,
  Settings,
  FileText,
  Star,
  MessageSquare,
  Edit3,
  Book,
  Heart,
  Zap
} from 'lucide-react';
import useStore from '../../store/useStore';
import LightNovelImprover from './LightNovelImprover';

const ConsistencyChecker = ({ onClose }) => {
  const [issues, setIssues] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showLightNovelFeedback, setShowLightNovelFeedback] = useState(false);
  const [lightNovelFeedback, setLightNovelFeedback] = useState(null);
  const [showImprover, setShowImprover] = useState(false);
  const [settings, setSettings] = useState({
    checkCharacterNames: true,
    checkLocations: true,
    checkTimeline: true,
    checkMagicSystem: true,
    checkRelationships: true,
    checkWorldRules: true,
    checkLightNovelElements: true,
    checkWritingStyle: true,
    checkPacing: true,
    checkDialogue: true
  });

  const { currentProject, projectStructure, characters, worldData } = useStore();

  const categories = [
    { id: 'all', name: 'Todos', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'characters', name: 'Personagens', icon: User, color: 'text-blue-600' },
    { id: 'locations', name: 'Locais', icon: MapPin, color: 'text-green-600' },
    { id: 'timeline', name: 'Timeline', icon: Clock, color: 'text-purple-600' },
    { id: 'world', name: 'Mundo', icon: BookOpen, color: 'text-orange-600' },
    { id: 'relationships', name: 'Relacionamentos', icon: User, color: 'text-pink-600' },
    { id: 'lightnovel', name: 'Light Novel', icon: Book, color: 'text-indigo-600' },
    { id: 'writing', name: 'Escrita', icon: Edit3, color: 'text-teal-600' }
  ];

  const generateLightNovelFeedback = async () => {
    setIsChecking(true);
    try {
      // Simular análise de IA para feedback de light novel
      const feedback = await analyzeLightNovelContent();
      setLightNovelFeedback(feedback);
      setShowLightNovelFeedback(true);
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const analyzeLightNovelContent = async () => {
    // Simular análise baseada no conteúdo atual
    const content = currentProject?.content || '';
    const characterCount = characters.length;
    const worldElements = Object.keys(worldData).length;

    // Análise de elementos típicos de light novel
    const analysis = {
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      elements: {
        characterDevelopment: { score: 0, feedback: '' },
        worldBuilding: { score: 0, feedback: '' },
        plotStructure: { score: 0, feedback: '' },
        dialogueQuality: { score: 0, feedback: '' },
        pacing: { score: 0, feedback: '' },
        tropes: { score: 0, feedback: '' },
        emotionalImpact: { score: 0, feedback: '' },
        originality: { score: 0, feedback: '' }
      }
    };

    // Análise de desenvolvimento de personagens
    if (characterCount >= 3) {
      analysis.elements.characterDevelopment.score = 8;
      analysis.elements.characterDevelopment.feedback = 'Boa quantidade de personagens principais';
      analysis.strengths.push('Variedade de personagens bem desenvolvida');
    } else {
      analysis.elements.characterDevelopment.score = 4;
      analysis.elements.characterDevelopment.feedback = 'Considere adicionar mais personagens principais';
      analysis.weaknesses.push('Poucos personagens principais');
      analysis.suggestions.push('Desenvolva pelo menos 3-5 personagens principais com arcos bem definidos');
    }

    // Análise de world building
    if (worldElements >= 5) {
      analysis.elements.worldBuilding.score = 9;
      analysis.elements.worldBuilding.feedback = 'Mundo rico e bem construído';
      analysis.strengths.push('World building detalhado e imersivo');
    } else {
      analysis.elements.worldBuilding.score = 5;
      analysis.elements.worldBuilding.feedback = 'World building pode ser expandido';
      analysis.weaknesses.push('World building limitado');
      analysis.suggestions.push('Expanda o sistema de magia, geografia e cultura do mundo');
    }

    // Análise de estrutura de plot
    const hasMagic = worldData.magicSystems && worldData.magicSystems.length > 0;
    const hasRelationships = worldData.relationships && worldData.relationships.length > 0;
    
    if (hasMagic && hasRelationships) {
      analysis.elements.plotStructure.score = 8;
      analysis.elements.plotStructure.feedback = 'Estrutura narrativa bem balanceada';
      analysis.strengths.push('Equilíbrio entre elementos de ação e romance');
    } else {
      analysis.elements.plotStructure.score = 6;
      analysis.elements.plotStructure.feedback = 'Estrutura pode ser melhorada';
      analysis.suggestions.push('Balance elementos de ação, romance e desenvolvimento de personagem');
    }

    // Análise de diálogos
    const dialogueIndicators = ['disse', 'falou', 'perguntou', 'respondeu', '"', '"'];
    const hasDialogue = dialogueIndicators.some(indicator => content.toLowerCase().includes(indicator));
    
    if (hasDialogue) {
      analysis.elements.dialogueQuality.score = 7;
      analysis.elements.dialogueQuality.feedback = 'Presença de diálogos na narrativa';
      analysis.strengths.push('Uso de diálogos para desenvolvimento');
    } else {
      analysis.elements.dialogueQuality.score = 4;
      analysis.elements.dialogueQuality.feedback = 'Diálogos podem ser expandidos';
      analysis.weaknesses.push('Poucos diálogos');
      analysis.suggestions.push('Use mais diálogos para mostrar em vez de contar');
    }

    // Análise de pacing
    const contentLength = content.length;
    if (contentLength > 5000) {
      analysis.elements.pacing.score = 8;
      analysis.elements.pacing.feedback = 'Conteúdo com boa extensão';
      analysis.strengths.push('Pacing adequado para light novel');
    } else {
      analysis.elements.pacing.score = 5;
      analysis.elements.pacing.feedback = 'Conteúdo pode ser expandido';
      analysis.suggestions.push('Desenvolva mais cenas e descrições');
    }

    // Análise de tropes
    const commonTropes = ['isekai', 'reencarnação', 'sistema', 'habilidade', 'nível', 'status'];
    const hasTropes = commonTropes.some(trope => content.toLowerCase().includes(trope));
    
    if (hasTropes) {
      analysis.elements.tropes.score = 7;
      analysis.elements.tropes.feedback = 'Uso de elementos familiares do gênero';
      analysis.strengths.push('Tropes bem utilizados');
    } else {
      analysis.elements.tropes.score = 6;
      analysis.elements.tropes.feedback = 'Considere elementos típicos do gênero';
      analysis.suggestions.push('Incorpore elementos familiares de light novels');
    }

    // Análise de impacto emocional
    const emotionalWords = ['coração', 'sentimento', 'amor', 'ódio', 'tristeza', 'alegria', 'medo'];
    const hasEmotionalContent = emotionalWords.some(word => content.toLowerCase().includes(word));
    
    if (hasEmotionalContent) {
      analysis.elements.emotionalImpact.score = 8;
      analysis.elements.emotionalImpact.feedback = 'Conteúdo emocional presente';
      analysis.strengths.push('Desenvolvimento emocional dos personagens');
    } else {
      analysis.elements.emotionalImpact.score = 5;
      analysis.elements.emotionalImpact.feedback = 'Desenvolvimento emocional pode ser melhorado';
      analysis.suggestions.push('Explore mais as emoções e motivações dos personagens');
    }

    // Análise de originalidade
    const uniqueElements = worldData.magicSystems?.length || 0 + worldData.locations?.length || 0;
    if (uniqueElements >= 3) {
      analysis.elements.originality.score = 8;
      analysis.elements.originality.feedback = 'Elementos únicos bem desenvolvidos';
      analysis.strengths.push('Originalidade no world building');
    } else {
      analysis.elements.originality.score = 6;
      analysis.elements.originality.feedback = 'Pode ser mais original';
      analysis.suggestions.push('Crie elementos únicos que diferenciem sua história');
    }

    // Calcular pontuação geral
    const totalScore = Object.values(analysis.elements).reduce((sum, element) => sum + element.score, 0);
    analysis.overallScore = Math.round(totalScore / Object.keys(analysis.elements).length);

    // Adicionar feedback geral baseado na pontuação
    if (analysis.overallScore >= 8) {
      analysis.strengths.push('História com grande potencial para light novel');
    } else if (analysis.overallScore >= 6) {
      analysis.suggestions.push('Continue desenvolvendo para alcançar o potencial máximo');
    } else {
      analysis.suggestions.push('Foque nos elementos fundamentais antes de expandir');
    }

    return analysis;
  };

  const checkConsistency = async () => {
    setIsChecking(true);
    const newIssues = [];

    try {
      // Verificar nomes de personagens
      if (settings.checkCharacterNames) {
        const characterIssues = checkCharacterConsistency();
        newIssues.push(...characterIssues);
      }

      // Verificar locais
      if (settings.checkLocations) {
        const locationIssues = checkLocationConsistency();
        newIssues.push(...locationIssues);
      }

      // Verificar timeline
      if (settings.checkTimeline) {
        const timelineIssues = checkTimelineConsistency();
        newIssues.push(...timelineIssues);
      }

      // Verificar sistema de magia
      if (settings.checkMagicSystem) {
        const magicIssues = checkMagicSystemConsistency();
        newIssues.push(...magicIssues);
      }

      // Verificar relacionamentos
      if (settings.checkRelationships) {
        const relationshipIssues = checkRelationshipConsistency();
        newIssues.push(...relationshipIssues);
      }

      // Verificar regras do mundo
      if (settings.checkWorldRules) {
        const worldIssues = checkWorldRulesConsistency();
        newIssues.push(...worldIssues);
      }

      // Verificar elementos de light novel
      if (settings.checkLightNovelElements) {
        const lightNovelIssues = checkLightNovelElements();
        newIssues.push(...lightNovelIssues);
      }

      // Verificar estilo de escrita
      if (settings.checkWritingStyle) {
        const writingIssues = checkWritingStyle();
        newIssues.push(...writingIssues);
      }

      setIssues(newIssues);
    } catch (error) {
      console.error('Erro ao verificar consistência:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const checkCharacterConsistency = () => {
    const issues = [];
    
    // Verificar se personagens têm nomes únicos
    const characterNames = characters.map(c => c.name.toLowerCase());
    const duplicateNames = characterNames.filter((name, index) => characterNames.indexOf(name) !== index);
    
    if (duplicateNames.length > 0) {
      issues.push({
        id: 'char-duplicate-names',
        category: 'characters',
        severity: 'warning',
        title: 'Nomes de personagens duplicados',
        description: `Encontrados nomes duplicados: ${duplicateNames.join(', ')}`,
        suggestion: 'Considere usar nomes únicos para cada personagem',
        location: 'Personagens'
      });
    }

    // Verificar se personagens têm descrições
    const charactersWithoutDescription = characters.filter(c => !c.description || c.description.trim() === '');
    if (charactersWithoutDescription.length > 0) {
      issues.push({
        id: 'char-no-description',
        category: 'characters',
        severity: 'info',
        title: 'Personagens sem descrição',
        description: `${charactersWithoutDescription.length} personagem(s) sem descrição`,
        suggestion: 'Adicione descrições para melhor desenvolvimento dos personagens',
        location: 'Personagens'
      });
    }

    return issues;
  };

  const checkLocationConsistency = () => {
    const issues = [];
    
    // Verificar se locais têm descrições
    const locationsWithoutDescription = worldData.locations.filter(l => !l.description || l.description.trim() === '');
    if (locationsWithoutDescription.length > 0) {
      issues.push({
        id: 'loc-no-description',
        category: 'locations',
        severity: 'info',
        title: 'Locais sem descrição',
        description: `${locationsWithoutDescription.length} local(is) sem descrição`,
        suggestion: 'Adicione descrições para melhor imersão no mundo',
        location: 'Locais'
      });
    }

    return issues;
  };

  const checkTimelineConsistency = () => {
    const issues = [];
    
    // Verificar se há eventos definidos
    if (!worldData.events || worldData.events.length === 0) {
      issues.push({
        id: 'timeline-no-events',
        category: 'timeline',
        severity: 'info',
        title: 'Timeline vazia',
        description: 'Nenhum evento histórico definido',
        suggestion: 'Considere adicionar eventos importantes da história do mundo',
        location: 'Timeline'
      });
    }

    return issues;
  };

  const checkMagicSystemConsistency = () => {
    const issues = [];
    
    // Verificar se há sistema de magia definido
    if (!worldData.magicSystems || worldData.magicSystems.length === 0) {
      issues.push({
        id: 'magic-no-system',
        category: 'world',
        severity: 'info',
        title: 'Sistema de magia não definido',
        description: 'Nenhum sistema de magia foi definido',
        suggestion: 'Se sua história tem magia, defina as regras do sistema',
        location: 'Sistema de Magia'
      });
    } else {
      // Verificar se sistemas de magia têm regras
      const magicSystemsWithoutRules = worldData.magicSystems.filter(m => !m.rules || m.rules.length === 0);
      if (magicSystemsWithoutRules.length > 0) {
        issues.push({
          id: 'magic-no-rules',
          category: 'world',
          severity: 'warning',
          title: 'Sistema de magia sem regras',
          description: `${magicSystemsWithoutRules.length} sistema(s) de magia sem regras definidas`,
          suggestion: 'Defina regras claras para evitar inconsistências',
          location: 'Sistema de Magia'
        });
      }
    }

    return issues;
  };

  const checkRelationshipConsistency = () => {
    const issues = [];
    
    // Verificar se há relacionamentos definidos
    if (!worldData.relationships || worldData.relationships.length === 0) {
      issues.push({
        id: 'rel-no-relationships',
        category: 'relationships',
        severity: 'info',
        title: 'Relacionamentos não definidos',
        description: 'Nenhum relacionamento entre personagens foi definido',
        suggestion: 'Defina relacionamentos para enriquecer a história',
        location: 'Relacionamentos'
      });
    }

    return issues;
  };

  const checkWorldRulesConsistency = () => {
    const issues = [];
    
    // Verificar se há regras do mundo definidas
    if (!worldData.description || worldData.description.trim() === '') {
      issues.push({
        id: 'world-no-description',
        category: 'world',
        severity: 'info',
        title: 'Mundo sem descrição',
        description: 'O mundo não possui descrição geral',
        suggestion: 'Adicione uma descrição geral do mundo',
        location: 'Mundo'
      });
    }

    return issues;
  };

  const checkLightNovelElements = () => {
    const issues = [];
    
    // Verificar elementos típicos de light novel
    const hasMagic = worldData.magicSystems && worldData.magicSystems.length > 0;
    const hasSchool = worldData.locations && worldData.locations.some(l =>
      l.name.toLowerCase().includes('escola') || l.name.toLowerCase().includes('academia')
    );
    const hasAdventure = worldData.events && worldData.events.length > 0;
    
    if (!hasMagic && !hasSchool && !hasAdventure) {
      issues.push({
        id: 'ln-no-elements',
        category: 'lightnovel',
        severity: 'info',
        title: 'Elementos de Light Novel ausentes',
        description: 'Considere adicionar elementos típicos do gênero',
        suggestion: 'Adicione sistema de magia, cenário escolar ou elementos de aventura',
        location: 'Elementos de Light Novel'
      });
    }

    // Verificar se há protagonista definido
    const hasMainCharacter = characters.some(c => c.role === 'protagonista' || c.role === 'main');
    if (!hasMainCharacter) {
      issues.push({
        id: 'ln-no-protagonist',
        category: 'lightnovel',
        severity: 'warning',
        title: 'Protagonista não definido',
        description: 'Light novels geralmente têm um protagonista claro',
        suggestion: 'Defina claramente o protagonista e seus objetivos',
        location: 'Personagens'
      });
    }

    return issues;
  };

  const checkWritingStyle = () => {
    const issues = [];
    
    // Verificar descrições visuais dos personagens
    const hasVisualDescriptions = characters.some(c =>
      c.appearance && c.appearance.length > 50
    );
    
    if (!hasVisualDescriptions) {
      issues.push({
        id: 'writing-no-visual',
        category: 'writing',
        severity: 'info',
        title: 'Descrições visuais limitadas',
        description: 'Light novels beneficiam de descrições visuais detalhadas',
        suggestion: 'Adicione descrições físicas detalhadas dos personagens',
        location: 'Estilo de Escrita'
      });
    }

    // Verificar se há diálogos
    const hasDialogue = characters.length > 1;
    if (!hasDialogue) {
      issues.push({
        id: 'writing-no-dialogue',
        category: 'writing',
        severity: 'info',
        title: 'Poucos personagens para diálogos',
        description: 'Diálogos são importantes em light novels',
        suggestion: 'Adicione mais personagens para criar interações interessantes',
        location: 'Estilo de Escrita'
      });
    }

    return issues;
  };



  const getFilteredIssues = () => {
    if (selectedCategory === 'all') {
      return issues;
    }
    return issues.filter(issue => issue.category === selectedCategory);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (currentProject) {
      checkConsistency();
    }
  }, [currentProject, settings]);

  const filteredIssues = getFilteredIssues();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Verificador de Consistência</h2>
              <p className="text-sm text-muted-foreground">Detecta inconsistências na sua história</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar com categorias */}
          <div className="w-64 bg-muted border-r border-border p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const categoryIssues = issues.filter(issue => issue.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                                         className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                       selectedCategory === category.id
                         ? 'bg-blue-600 text-white shadow-md'
                         : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground'
                     }`}
                  >
                                         <div className="flex items-center space-x-3">
                       <CategoryIcon className={`h-4 w-4 ${
                         selectedCategory === category.id
                           ? 'text-white'
                           : 'text-gray-600 dark:text-gray-400'
                       }`} />
                       <span className="text-sm font-medium">{category.name}</span>
                     </div>
                                         {categoryIssues.length > 0 && (
                       <span className={`text-xs px-2 py-1 rounded-full ${
                         selectedCategory === category.id
                           ? 'bg-white text-blue-600 font-semibold'
                           : 'bg-red-500 text-white'
                       }`}>
                         {categoryIssues.length}
                       </span>
                     )}
                  </button>
                );
              })}
            </div>

            {/* Configurações */}
            {showSettings && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Configurações:</h4>
                <div className="space-y-2">
                  {Object.entries(settings).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-xs text-blue-800 dark:text-blue-200">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lista de problemas */}
          <div className="flex-1 p-6">
            {/* Header da lista */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {filteredIssues.length} problema(s) encontrado(s)
                </h3>
                <p className="text-sm text-muted-foreground">
                  {issues.filter(i => i.severity === 'error').length} erro(s), 
                  {issues.filter(i => i.severity === 'warning').length} aviso(s), 
                  {issues.filter(i => i.severity === 'info').length} informação(is)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={generateLightNovelFeedback}
                  disabled={isChecking}
                  className="btn-primary flex items-center"
                >
                  <Book className="mr-2 h-4 w-4" />
                  {isChecking ? 'Analisando...' : 'Feedback Light Novel'}
                </button>
                <button
                  onClick={checkConsistency}
                  disabled={isChecking}
                  className="btn-outline flex items-center"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                  {isChecking ? 'Verificando...' : 'Verificar Novamente'}
                </button>
              </div>
            </div>

            {/* Lista de problemas */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue, index) => (
                  <div
                    key={`${issue.id}-${index}`}
                    className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getSeverityIcon(issue.severity)}
                          <h4 className="font-medium">{issue.title}</h4>
                          <span className="text-xs px-2 py-1 bg-white/20 rounded">
                            {issue.location}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{issue.description}</p>
                        {issue.suggestion && (
                          <div className="bg-white/20 p-3 rounded">
                            <p className="text-sm font-medium mb-1">Sugestão:</p>
                            <p className="text-sm">{issue.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum problema encontrado!
                  </h3>
                  <p className="text-muted-foreground">
                    Sua história está consistente. Continue assim!
                  </p>
                </div>
              )}
            </div>

            {/* Resumo */}
            {filteredIssues.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {filteredIssues.filter(i => i.severity === 'error').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Erros</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredIssues.filter(i => i.severity === 'warning').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Avisos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredIssues.filter(i => i.severity === 'info').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Informações</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Feedback de Light Novel */}
        {showLightNovelFeedback && lightNovelFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
              {/* Header do Feedback */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Book className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Feedback de Light Novel</h2>
                    <p className="text-sm text-muted-foreground">Análise especializada para o gênero</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLightNovelFeedback(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto h-full">
                {/* Pontuação Geral */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Pontuação Geral</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-3xl font-bold text-primary">{lightNovelFeedback.overallScore}/10</div>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < lightNovelFeedback.overallScore
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(lightNovelFeedback.overallScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Análise por Elementos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {Object.entries(lightNovelFeedback.elements).map(([key, element]) => (
                    <div key={key} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-primary">{element.score}/10</span>
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < element.score
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{element.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Pontos Fortes */}
                {lightNovelFeedback.strengths.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Pontos Fortes
                    </h3>
                    <div className="space-y-2">
                      {lightNovelFeedback.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-foreground">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pontos de Melhoria */}
                {lightNovelFeedback.weaknesses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      Pontos de Melhoria
                    </h3>
                    <div className="space-y-2">
                      {lightNovelFeedback.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-foreground">{weakness}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sugestões */}
                {lightNovelFeedback.suggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                      Sugestões de Melhoria
                    </h3>
                    <div className="space-y-2">
                      {lightNovelFeedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-foreground">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações Recomendadas */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Próximos Passos Recomendados:
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <p>1. Foque nos pontos de melhoria identificados</p>
                    <p>2. Implemente as sugestões de melhoria</p>
                    <p>3. Revise e refine os elementos com pontuação baixa</p>
                    <p>4. Continue desenvolvendo os pontos fortes</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowLightNovelFeedback(false)}
                    className="btn-outline"
                  >
                    Fechar
                  </button>
                  <div className="flex items-center space-x-2">
                                      <button
                    onClick={() => setShowImprover(true)}
                    className="btn-primary flex items-center"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Aplicar Melhorias
                  </button>
                    <button
                      onClick={() => {
                        // Gerar novo feedback após melhorias
                        generateLightNovelFeedback();
                      }}
                      className="btn-outline flex items-center"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reanalisar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Componente de Aplicação de Melhorias */}
        {showImprover && lightNovelFeedback && (
          <LightNovelImprover
            feedback={lightNovelFeedback}
            onClose={() => setShowImprover(false)}
            onImprovementsApplied={(improvements) => {
              console.log('Melhorias aplicadas:', improvements);
              setShowImprover(false);
              // Opcional: gerar novo feedback após melhorias
              setTimeout(() => {
                generateLightNovelFeedback();
              }, 1000);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConsistencyChecker;
