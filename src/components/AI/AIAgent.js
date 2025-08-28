import React, { useState, useCallback, useMemo } from 'react';
import { Brain, Lightbulb, Target, BookOpen, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AIAgent = ({ 
  worldData, 
  projectData, 
  onGenerateWithContext, 
  onGetInsights,
  isOpen, 
  onClose 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [contextSummary, setContextSummary] = useState(null);

  // Analisa o contexto do projeto
  const analyzeProjectContext = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        worldName: worldData?.name || 'Mundo não definido',
        genre: worldData?.genre || 'Fantasia',
        techLevel: worldData?.techLevel || 'Medieval',
        locations: worldData?.locations?.length || 0,
        peoples: worldData?.peoples?.length || 0,
        regions: worldData?.regions?.length || 0,
        landmarks: worldData?.landmarks?.length || 0,
        resources: worldData?.resources?.length || 0,
        languages: worldData?.languages?.length || 0,
        religions: worldData?.religions?.length || 0,
        traditions: worldData?.traditions?.length || 0,
        technologies: worldData?.technologies?.length || 0,
        governments: worldData?.governments?.length || 0,
        economies: worldData?.economies?.length || 0,
        events: worldData?.events?.length || 0,
        magicSystems: worldData?.magicSystems?.length || 0,
        volumes: projectData?.volumes?.length || 0,
        chapters: projectData?.chapters?.length || 0,
        characters: projectData?.characters?.length || 0
      };

      // Gera resumo do contexto
      const contextPrompt = `Analise o contexto deste projeto de light novel:

MUNDO:
- Nome: ${context.worldName}
- Gênero: ${context.genre}
- Nível Tecnológico: ${context.techLevel}

ELEMENTOS EXISTENTES:
- Locais: ${context.locations}
- Povos: ${context.peoples}
- Regiões: ${context.regions}
- Marcos: ${context.landmarks}
- Recursos: ${context.resources}
- Idiomas: ${context.languages}
- Religiões: ${context.religions}
- Tradições: ${context.traditions}
- Tecnologias: ${context.technologies}
- Governos: ${context.governments}
- Economias: ${context.economies}
- Eventos: ${context.events}
- Sistemas Mágicos: ${context.magicSystems}

PROJETO:
- Volumes: ${context.volumes}
- Capítulos: ${context.chapters}
- Personagens: ${context.characters}

Forneça um resumo conciso do contexto atual e sugestões para manter coerência.`;

      const contextResult = await onGenerateWithContext(contextPrompt);
      setContextSummary(contextResult);

      // Gera insights e dicas
      const insightsPrompt = `Com base no contexto do projeto, forneça:

1. DICAS DE QUALIDADE:
- Pontos fortes do projeto atual
- Áreas que precisam de desenvolvimento
- Sugestões para melhorar a coerência

2. INSIGHTS PARA VOLUMES E CAPÍTULOS:
- Estrutura narrativa recomendada
- Elementos que podem ser explorados
- Pontos de tensão e desenvolvimento

3. SUGESTÕES DE DESENVOLVIMENTO:
- Elementos do mundo que podem ser expandidos
- Conexões entre elementos existentes
- Oportunidades narrativas

Formate como JSON:
{
  "qualityTips": ["dica 1", "dica 2"],
  "volumeInsights": ["insight 1", "insight 2"],
  "developmentSuggestions": ["sugestão 1", "sugestão 2"],
  "coherenceScore": "score de 1-10",
  "priorityAreas": ["área 1", "área 2"]
}`;

      const insightsResult = await onGenerateWithContext(insightsPrompt);
      setInsights(insightsResult);

      toast.success('Análise do projeto concluída!');
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao analisar o projeto');
    } finally {
      setIsAnalyzing(false);
    }
  }, [worldData, projectData, onGenerateWithContext]);

  // Gera prompt contextualizado para um elemento específico
  const generateContextualPrompt = useCallback(async (elementType, elementName) => {
    try {
      const contextInfo = {
        worldName: worldData?.name,
        genre: worldData?.genre,
        techLevel: worldData?.techLevel,
        existingElements: {
          locations: worldData?.locations?.map(l => l.name) || [],
          peoples: worldData?.peoples?.map(p => p.name) || [],
          regions: worldData?.regions?.map(r => r.name) || [],
          landmarks: worldData?.landmarks?.map(l => l.name) || [],
          resources: worldData?.resources?.map(r => r.name) || [],
          languages: worldData?.languages?.map(l => l.name) || [],
          religions: worldData?.religions?.map(r => r.name) || [],
          traditions: worldData?.traditions?.map(t => t.name) || [],
          technologies: worldData?.technologies?.map(t => t.name) || [],
          governments: worldData?.governments?.map(g => g.name) || [],
          economies: worldData?.economies?.map(e => e.name) || [],
          events: worldData?.events?.map(e => e.name) || [],
          magicSystems: worldData?.magicSystems?.map(m => m.name) || []
        }
      };

      const contextualPrompt = `CONTEXTO DO MUNDO:
- Nome: ${contextInfo.worldName}
- Gênero: ${contextInfo.genre}
- Nível Tecnológico: ${contextInfo.techLevel}

ELEMENTOS EXISTENTES:
${Object.entries(contextInfo.existingElements)
  .filter(([key, elements]) => elements.length > 0)
  .map(([key, elements]) => `- ${key}: ${elements.join(', ')}`)
  .join('\n')}

REGRAS DE COERÊNCIA:
1. Mantenha consistência com o gênero e nível tecnológico
2. Evite elementos que não fazem sentido no contexto (ex: tecnologia moderna em mundo medieval)
3. Considere as conexões com elementos existentes
4. Mantenha a atmosfera e estilo do mundo estabelecido

Agora gere um ${elementName} que seja coerente com este contexto.`;

      return contextualPrompt;
    } catch (error) {
      console.error('Erro ao gerar prompt contextualizado:', error);
      return null;
    }
  }, [worldData]);

  // Calcula score de coerência
  const coherenceScore = useMemo(() => {
    if (!worldData) return 0;
    
    let score = 0;
    let totalElements = 0;

    // Verifica se há elementos básicos
    if (worldData.name) score += 2;
    if (worldData.genre) score += 1;
    if (worldData.techLevel) score += 1;
    totalElements += 4;

    // Verifica elementos do mundo
    const worldElements = [
      'locations', 'peoples', 'regions', 'landmarks', 
      'resources', 'languages', 'religions', 'traditions',
      'technologies', 'governments', 'economies', 'events', 'magicSystems'
    ];

    worldElements.forEach(element => {
      if (worldData[element] && worldData[element].length > 0) {
        score += 1;
      }
      totalElements += 1;
    });

    return Math.round((score / totalElements) * 10);
  }, [worldData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Agente de IA - Análise Inteligente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score de Coerência */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Score de Coerência do Projeto
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">{coherenceScore}/10</div>
                {coherenceScore >= 7 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {coherenceScore >= 7 
                ? 'Excelente! Seu projeto tem boa coerência interna.'
                : 'Considere expandir mais elementos para melhorar a coerência.'
              }
            </div>
          </div>

          {/* Botão de Análise */}
          <div className="text-center">
            <button
              onClick={analyzeProjectContext}
              disabled={isAnalyzing}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analisar Projeto Completo
                </>
              )}
            </button>
          </div>

          {/* Context Summary */}
          {contextSummary && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Resumo do Contexto
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {contextSummary}
              </p>
            </div>
          )}

          {/* Insights */}
          {insights && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Insights e Dicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dicas de Qualidade */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Dicas de Qualidade
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {insights.qualityTips?.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Insights para Volumes */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Insights para Volumes
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {insights.volumeInsights?.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sugestões de Desenvolvimento */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-500" />
                  Sugestões de Desenvolvimento
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {insights.developmentSuggestions?.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Funcionalidades do Agente */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Funcionalidades do Agente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Análise contextual automática</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Prompts inteligentes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Dicas de qualidade</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Insights para volumes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
