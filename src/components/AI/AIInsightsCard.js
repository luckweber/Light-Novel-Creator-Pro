import React, { useState, useCallback } from 'react';
import { Brain, Lightbulb, TrendingUp, Star, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAIAgent } from '../../hooks/useAIAgent';
import useStore from '../../store/useStore';

const AIInsightsCard = () => {
  const { worldData, volumes, chapters, characters, settings } = useStore();
  const aiProvider = settings?.aiProvider || 'openai';
  
  const {
    isAnalyzing,
    getQualityTips,
    getVolumeInsights
  } = useAIAgent(aiProvider);

  const [insights, setInsights] = useState(null);
  const [showFullInsights, setShowFullInsights] = useState(false);

  // Calcula score de coerência básico
  const coherenceScore = React.useMemo(() => {
    if (!worldData) return 0;
    
    let score = 0;
    let totalElements = 0;

    // Verifica elementos básicos
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

  // Gera insights rápidos
  const generateQuickInsights = useCallback(async () => {
    if (isAnalyzing) return;

    try {
      const [qualityTips, volumeInsights] = await Promise.all([
        getQualityTips(worldData, { volumes, chapters }),
        getVolumeInsights(worldData, { volumes, chapters })
      ]);

      setInsights({
        qualityTips: qualityTips ? qualityTips.split('\n').slice(0, 2) : [
          'Continue desenvolvendo os elementos do mundo',
          'Mantenha consistência entre os elementos'
        ],
        volumeInsights: volumeInsights ? volumeInsights.split('\n').slice(0, 2) : [
          'Desenvolva a estrutura narrativa gradualmente',
          'Explore as conexões entre elementos'
        ]
      });
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  }, [isAnalyzing, getQualityTips, getVolumeInsights, worldData, volumes, chapters]);

  // Gera insights automaticamente quando o componente monta
  React.useEffect(() => {
    if (worldData && !insights) {
      generateQuickInsights();
    }
  }, [worldData, insights, generateQuickInsights]);

  if (!worldData) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-foreground">Agente de IA</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Crie um mundo primeiro para receber insights personalizados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-foreground">Insights do Agente IA</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-foreground">{coherenceScore}/10</div>
          {coherenceScore >= 7 ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-muted-foreground">Analisando projeto...</span>
        </div>
      ) : insights ? (
        <div className="space-y-3">
          {/* Dicas de Qualidade */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <h4 className="text-sm font-medium text-foreground">Dicas de Qualidade</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {insights.qualityTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Insights para Volumes */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-medium text-foreground">Insights para Volumes</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {insights.volumeInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Botão para ver mais */}
          <button
            onClick={() => setShowFullInsights(true)}
            className="w-full flex items-center justify-center space-x-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Ver insights completos</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Clique para gerar insights personalizados
          </p>
          <button
            onClick={generateQuickInsights}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            Gerar Insights
          </button>
        </div>
      )}

      {/* Modal de insights completos */}
      {showFullInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Insights Completos do Agente IA</h2>
              <button
                onClick={() => setShowFullInsights(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Score de Coerência</span>
                  <div className="text-2xl font-bold text-blue-600">{coherenceScore}/10</div>
                </div>
              </div>
              
              {insights && (
                <>
                  <div>
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Dicas de Qualidade
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      {insights.qualityTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      Insights para Volumes
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      {insights.volumeInsights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsCard;
