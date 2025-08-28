import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AIService, getBestModelForTask } from '../utils/aiProviders';
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

export const useAIAgent = (aiProvider, settings) => {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [unifiedPromptIntegration, setUnifiedPromptIntegration] = useState(null);

  // Inicializar Unified Prompt Integration
  useEffect(() => {
    if (aiProvider && settings?.aiProviders?.[aiProvider]) {
      const providerSettings = settings.aiProviders[aiProvider];
      const aiService = new AIService(aiProvider, providerSettings.apiKey, {
        model: providerSettings.defaultModel,
        temperature: providerSettings.temperature,
        maxTokens: providerSettings.maxTokens
      });
      
      const integration = createUnifiedPromptIntegration({}, aiService);
      setUnifiedPromptIntegration(integration);
    }
  }, [aiProvider, settings]);

  const generateWithContext = useCallback(async (prompt, context = {}) => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return null;
    }

    try {
      const result = await unifiedPromptIntegration.generateWithContext(prompt, context);
      return result;
    } catch (error) {
      console.error('Erro na geração com contexto:', error);
      toast.error(`Erro ao gerar conteúdo: ${error.message}`);
      return null;
    }
  }, [unifiedPromptIntegration]);

  // Função para analisar projeto e gerar insights
  const analyzeProject = useCallback(async (worldData, projectData) => {
    if (!worldData || Object.keys(worldData).length === 0) {
      setIsAnalyzing(false);
      return null;
    }
    
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return null;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await unifiedPromptIntegration.analyzeProject(worldData, projectData);
      return result;
    } catch (error) {
      console.error('Erro na análise do projeto:', error);
      toast.error('Erro ao analisar o projeto');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [unifiedPromptIntegration]);

  // Função para gerar prompt contextualizado para elementos específicos
  const generateElementPrompt = useCallback(async (elementType, elementName, worldData) => {
    if (!worldData || Object.keys(worldData).length === 0) {
      return null;
    }
    
    if (!unifiedPromptIntegration) {
      return null;
    }
    
    try {
      const result = await unifiedPromptIntegration.generateElementPrompt(elementType, elementName, worldData);
      return result;
    } catch (error) {
      console.error('Erro ao gerar prompt contextualizado:', error);
      return null;
    }
  }, [unifiedPromptIntegration]);

  // Função para obter dicas de qualidade
  const getQualityTips = useCallback(async (worldData, projectData) => {
    if (!worldData || Object.keys(worldData).length === 0) {
      return null;
    }
    
    if (!unifiedPromptIntegration) {
      return null;
    }
    
    try {
      const result = await unifiedPromptIntegration.getQualityTips(worldData, projectData);
      return result;
    } catch (error) {
      console.error('Erro ao obter dicas de qualidade:', error);
      return null;
    }
  }, [unifiedPromptIntegration]);

  // Função para obter insights para volumes
  const getVolumeInsights = useCallback(async (worldData, projectData) => {
    if (!worldData || Object.keys(worldData).length === 0) {
      return null;
    }
    
    if (!unifiedPromptIntegration) {
      return null;
    }
    
    try {
      const result = await unifiedPromptIntegration.getVolumeInsights(worldData, projectData);
      return result;
    } catch (error) {
      console.error('Erro ao obter insights para volumes:', error);
      return null;
    }
  }, [unifiedPromptIntegration]);

  // Função avançada para gerar elementos com análise de coerência
  const generateSmartElement = useCallback(async (elementType, worldData, projectData) => {
    if (!worldData || Object.keys(worldData).length === 0) {
      return null;
    }
    
    if (!unifiedPromptIntegration) {
      return null;
    }
    
    try {
      const result = await unifiedPromptIntegration.generateSmartElement(elementType, worldData, projectData);
      return result;
    } catch (error) {
      console.error('Erro ao gerar elemento inteligente:', error);
      return null;
    }
  }, [unifiedPromptIntegration]);

  return {
    isAgentOpen,
    setIsAgentOpen,
    isAnalyzing,
    generateWithContext,
    analyzeProject,
    generateElementPrompt,
    getQualityTips,
    getVolumeInsights,
    generateSmartElement
  };
};
