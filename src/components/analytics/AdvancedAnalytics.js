import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  Target,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  BookOpen,
  Users,
  MapPin
} from 'lucide-react';
import useStore from '../../store/useStore';

const AdvancedAnalytics = ({ content, projectData }) => {
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('writing');

  // Calcular métricas do texto
  useEffect(() => {
    if (!content) return;

    const text = content;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    
    // Análise de diálogos
    const dialogueRegex = /"[^"]*"/g;
    const dialogues = text.match(dialogueRegex) || [];
    const dialogueWords = dialogues.join(' ').split(/\s+/).filter(word => word.length > 0);
    
    // Análise de ritmo
    const shortSentences = sentences.filter(s => s.split(/\s+/).length <= 10);
    const mediumSentences = sentences.filter(s => {
      const wordCount = s.split(/\s+/).length;
      return wordCount > 10 && wordCount <= 20;
    });
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 20);

    // Análise de vocabulário
    const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
    const vocabularyDiversity = (uniqueWords.size / words.length) * 100;

    // Análise de densidade
    const dialogueDensity = (dialogueWords.length / words.length) * 100;
    const descriptionDensity = 100 - dialogueDensity;

    const newAnalytics = {
      basic: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        characterCount: text.length,
        averageWordsPerSentence: words.length / sentences.length,
        averageWordsPerParagraph: words.length / paragraphs.length
      },
      dialogue: {
        dialogueCount: dialogues.length,
        dialogueWords: dialogueWords.length,
        dialogueDensity: dialogueDensity,
        averageDialogueLength: dialogueWords.length / dialogues.length,
        descriptionDensity: descriptionDensity
      },
      rhythm: {
        shortSentences: shortSentences.length,
        mediumSentences: mediumSentences.length,
        longSentences: longSentences.length,
        shortSentencePercentage: (shortSentences.length / sentences.length) * 100,
        mediumSentencePercentage: (mediumSentences.length / sentences.length) * 100,
        longSentencePercentage: (longSentences.length / sentences.length) * 100
      },
      vocabulary: {
        uniqueWords: uniqueWords.size,
        vocabularyDiversity: vocabularyDiversity,
        averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
      }
    };

    setAnalytics(newAnalytics);
  }, [content]);

  const getWritingPace = () => {
    if (!analytics.basic) return 'Médio';
    
    const avgWordsPerSentence = analytics.basic.averageWordsPerSentence;
    if (avgWordsPerSentence < 10) return 'Rápido';
    if (avgWordsPerSentence > 20) return 'Lento';
    return 'Médio';
  };

  const getDialogueBalance = () => {
    if (!analytics.dialogue) return 'Equilibrado';
    
    const density = analytics.dialogue.dialogueDensity;
    if (density < 20) return 'Narrativo';
    if (density > 60) return 'Dialogado';
    return 'Equilibrado';
  };

  const getRhythmAnalysis = () => {
    if (!analytics.rhythm) return 'Variado';
    
    const short = analytics.rhythm.shortSentencePercentage;
    const long = analytics.rhythm.longSentencePercentage;
    
    if (short > 50) return 'Dinâmico';
    if (long > 30) return 'Contemplativo';
    return 'Variado';
  };

  const metrics = [
    {
      id: 'writing',
      name: 'Escrita',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'dialogue',
      name: 'Diálogos',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'rhythm',
      name: 'Ritmo',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'vocabulary',
      name: 'Vocabulário',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const renderWritingMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Palavras</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.basic?.wordCount?.toLocaleString() || 0}
            </p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Frases</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.basic?.sentenceCount || 0}
            </p>
          </div>
          <MessageSquare className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Parágrafos</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.basic?.paragraphCount || 0}
            </p>
          </div>
          <BarChart3 className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Palavras/Frase</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.basic?.averageWordsPerSentence?.toFixed(1) || 0}
            </p>
          </div>
          <Target className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );

  const renderDialogueMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Diálogos</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.dialogue?.dialogueCount || 0}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Densidade</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.dialogue?.dialogueDensity?.toFixed(1) || 0}%
              </p>
            </div>
            <PieChart className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Palavras/Dial.</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.dialogue?.averageDialogueLength?.toFixed(1) || 0}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Distribuição de Conteúdo</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Diálogos</span>
              <span>{analytics.dialogue?.dialogueDensity?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.dialogue?.dialogueDensity || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Narrativa</span>
              <span>{analytics.dialogue?.descriptionDensity?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.dialogue?.descriptionDensity || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRhythmMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Frases Curtas</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.rhythm?.shortSentences || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {analytics.rhythm?.shortSentencePercentage?.toFixed(1) || 0}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Frases Médias</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.rhythm?.mediumSentences || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {analytics.rhythm?.mediumSentencePercentage?.toFixed(1) || 0}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Frases Longas</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.rhythm?.longSentences || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {analytics.rhythm?.longSentencePercentage?.toFixed(1) || 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Análise de Ritmo</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-medium">Pace de Escrita:</span>
            <span className="text-blue-600 font-semibold">{getWritingPace()}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-medium">Ritmo Geral:</span>
            <span className="text-purple-600 font-semibold">{getRhythmAnalysis()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVocabularyMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Palavras Únicas</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.vocabulary?.uniqueWords?.toLocaleString() || 0}
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Diversidade</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.vocabulary?.vocabularyDiversity?.toFixed(1) || 0}%
              </p>
            </div>
            <PieChart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tamanho Médio</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.vocabulary?.averageWordLength?.toFixed(1) || 0}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Recomendações</h4>
        <div className="space-y-3">
          {analytics.vocabulary?.vocabularyDiversity < 50 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Vocabulário:</strong> Considere usar mais variedade de palavras para enriquecer o texto.
              </p>
            </div>
          )}
          
          {analytics.dialogue?.dialogueDensity > 70 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Diálogos:</strong> O texto tem muitos diálogos. Considere adicionar mais descrições.
              </p>
            </div>
          )}

          {analytics.rhythm?.longSentencePercentage > 40 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <strong>Ritmo:</strong> Muitas frases longas podem tornar a leitura cansativa. Considere quebrar algumas frases.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Avançados</h2>
          <p className="text-muted-foreground">Análise detalhada do seu texto e métricas de escrita</p>
        </div>
      </div>

      {/* Métricas Selecionadas */}
      <div className="flex space-x-2 overflow-x-auto">
        {metrics.map(metric => {
          const MetricIcon = metric.icon;
          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedMetric === metric.id
                  ? `${metric.bgColor} ${metric.color}`
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <MetricIcon className="h-4 w-4" />
              <span>{metric.name}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Métricas */}
      <div className="space-y-6">
        {selectedMetric === 'writing' && renderWritingMetrics()}
        {selectedMetric === 'dialogue' && renderDialogueMetrics()}
        {selectedMetric === 'rhythm' && renderRhythmMetrics()}
        {selectedMetric === 'vocabulary' && renderVocabularyMetrics()}
      </div>

      {/* Resumo Geral */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resumo Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pace de Escrita</p>
            <p className="text-lg font-semibold text-blue-600">{getWritingPace()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Balance de Diálogos</p>
            <p className="text-lg font-semibold text-green-600">{getDialogueBalance()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Ritmo</p>
            <p className="text-lg font-semibold text-purple-600">{getRhythmAnalysis()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Diversidade</p>
            <p className="text-lg font-semibold text-orange-600">
              {analytics.vocabulary?.vocabularyDiversity?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
