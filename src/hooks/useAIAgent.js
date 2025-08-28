import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { AIService, getBestModelForTask } from '../utils/aiProviders';

export const useAIAgent = (aiProvider) => {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateWithContext = useCallback(async (prompt, context) => {
    if (!aiProvider) {
      toast.error('Configure um provedor de IA nas configurações');
      return null;
    }

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem(`${aiProvider}_api_key`);
      if (!apiKey) {
        toast.error('API Key não configurada');
        return null;
      }

      const service = new AIService(aiProvider, apiKey);
      const model = getBestModelForTask(aiProvider, 'creative_writing');
      
      // Enhance prompt with context
      let enhancedPrompt = prompt;
      
      if (context.worldName) {
        enhancedPrompt = `Para o mundo "${context.worldName}":\n\n${enhancedPrompt}`;
      }

      if (context.existingElements?.length > 0) {
        enhancedPrompt += `\n\nElementos existentes para referência:\n${context.existingElements.map(el => `- ${el.name}: ${el.description}`).join('\n')}`;
      }

      if (context.characters?.length > 0) {
        enhancedPrompt += `\n\nPersonagens relacionados:\n${context.characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}`;
      }

      // Add coherence rules
      enhancedPrompt += `\n\nREGRAS DE COERÊNCIA IMPORTANTES:
- Mantenha consistência com o gênero e estilo do mundo
- Evite elementos anacrônicos (ex: tecnologia moderna em mundo medieval)
- Use nomes e referências culturais apropriadas
- Mantenha a atmosfera e tom estabelecidos
- Conecte com elementos existentes quando relevante`;

      const result = await service.generateText(enhancedPrompt, { model });
      return result;
    } catch (error) {
      console.error('Erro na geração com contexto:', error);
      toast.error(`Erro ao gerar conteúdo: ${error.message}`);
      return null;
    }
  }, [aiProvider]);

  // Função para analisar projeto e gerar insights
  const analyzeProject = useCallback(async (worldData, projectData) => {
    setIsAnalyzing(true);
    try {
      // Análise de contexto
      const contextAnalysis = await generateWithContext(
        `Analise o contexto deste projeto de light novel e forneça um resumo conciso dos elementos existentes e sugestões para manter coerência.`,
        {
          worldName: worldData?.name,
          genre: worldData?.genre,
          techLevel: worldData?.techLevel,
          totalElements: Object.keys(worldData || {}).filter(key => 
            Array.isArray(worldData[key]) && worldData[key].length > 0
          ).length
        }
      );

      // Geração de insights
      const insightsPrompt = `Com base no contexto do projeto, forneça insights estruturados em JSON:

{
  "qualityTips": [
    "Dica específica sobre qualidade do projeto",
    "Sugestão para melhorar coerência"
  ],
  "volumeInsights": [
    "Insight sobre estrutura narrativa",
    "Sugestão para desenvolvimento de volumes"
  ],
  "developmentSuggestions": [
    "Sugestão de desenvolvimento específica",
    "Oportunidade narrativa identificada"
  ],
  "coherenceScore": "8",
  "priorityAreas": [
    "Área que precisa de mais desenvolvimento",
    "Elemento que pode ser expandido"
  ]
}

Mantenha as dicas práticas e específicas para o contexto do projeto.`;

      const insightsResult = await generateWithContext(insightsPrompt, {
        worldName: worldData?.name,
        genre: worldData?.genre,
        techLevel: worldData?.techLevel
      });

      // Tenta parsear os insights
      let insights = null;
      try {
        if (insightsResult) {
          const cleanResult = insightsResult.trim();
          const jsonStart = cleanResult.indexOf('{');
          const jsonEnd = cleanResult.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonStr = cleanResult.substring(jsonStart, jsonEnd + 1);
            insights = JSON.parse(jsonStr);
          }
        }
      } catch (parseError) {
        console.error('Erro ao parsear insights:', parseError);
        // Fallback para insights básicos
        insights = {
          qualityTips: ['Continue desenvolvendo os elementos do mundo', 'Mantenha consistência entre os elementos'],
          volumeInsights: ['Desenvolva a estrutura narrativa gradualmente', 'Explore as conexões entre elementos'],
          developmentSuggestions: ['Expanda elementos que precisam de mais detalhes', 'Crie conexões entre elementos existentes'],
          coherenceScore: '7',
          priorityAreas: ['Desenvolvimento de personagens', 'Expansão do mundo']
        };
      }

      return {
        contextAnalysis,
        insights
      };
    } catch (error) {
      console.error('Erro na análise do projeto:', error);
      toast.error('Erro ao analisar o projeto');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [generateWithContext]);

  // Função para gerar prompt contextualizado para elementos específicos
  const generateElementPrompt = useCallback(async (elementType, elementName, worldData) => {
    try {
      const existingElements = {};
      
      // Coleta elementos existentes relevantes
      const relevantTypes = {
        location: ['locations', 'regions', 'landmarks'],
        people: ['peoples', 'religions', 'traditions'],
        region: ['locations', 'peoples', 'resources'],
        landmark: ['locations', 'regions', 'religions'],
        resource: ['locations', 'regions', 'economies'],
        language: ['peoples', 'regions', 'traditions'],
        religion: ['peoples', 'regions', 'traditions'],
        tradition: ['peoples', 'religions', 'cultures'],
        technology: ['techLevel', 'economies', 'governments'],
        government: ['peoples', 'regions', 'economies'],
        economy: ['resources', 'governments', 'technologies'],
        event: ['peoples', 'regions', 'governments'],
        magicSystem: ['religions', 'traditions', 'peoples']
      };

      const relevant = relevantTypes[elementType] || [];
      relevant.forEach(type => {
        if (worldData[type] && Array.isArray(worldData[type])) {
          existingElements[type] = worldData[type].map(item => item.name).filter(Boolean);
        }
      });

      const contextInfo = {
        worldName: worldData?.name,
        genre: worldData?.genre,
        techLevel: worldData?.techLevel,
        existingElements: Object.entries(existingElements)
          .filter(([key, elements]) => elements.length > 0)
          .map(([key, elements]) => `${key}: ${elements.join(', ')}`)
          .join('; ')
      };

      const contextualPrompt = `Gere um ${elementName} coerente com o contexto do mundo:

CONTEXTO:
- Mundo: ${contextInfo.worldName || 'Mundo não definido'}
- Gênero: ${contextInfo.genre || 'Fantasia'}
- Nível Tecnológico: ${contextInfo.techLevel || 'Medieval'}
- Elementos Existentes: ${contextInfo.existingElements || 'Nenhum'}

REGRAS DE COERÊNCIA:
1. Mantenha consistência com o gênero e nível tecnológico
2. Evite elementos que não fazem sentido no contexto
3. Considere as conexões com elementos existentes
4. Mantenha a atmosfera e estilo do mundo estabelecido

Gere um ${elementName} que seja único e interessante, mas coerente com este contexto.`;

      return contextualPrompt;
    } catch (error) {
      console.error('Erro ao gerar prompt contextualizado:', error);
      return null;
    }
  }, []);

  // Função para obter dicas de qualidade
  const getQualityTips = useCallback(async (worldData, projectData) => {
    try {
      const tipsPrompt = `Com base no projeto atual, forneça 3-5 dicas específicas de qualidade para melhorar a light novel:

CONTEXTO:
- Mundo: ${worldData?.name || 'Não definido'}
- Gênero: ${worldData?.genre || 'Fantasia'}
- Volumes: ${projectData?.volumes?.length || 0}
- Capítulos: ${projectData?.chapters?.length || 0}

Forneça dicas práticas e específicas que possam ser aplicadas imediatamente.`;

      const result = await generateWithContext(tipsPrompt);
      return result;
    } catch (error) {
      console.error('Erro ao obter dicas de qualidade:', error);
      return null;
    }
  }, [generateWithContext]);

  // Função para obter insights para volumes
  const getVolumeInsights = useCallback(async (worldData, projectData) => {
    try {
      const insightsPrompt = `Analise o projeto atual e forneça insights específicos para o desenvolvimento de volumes e capítulos:

CONTEXTO:
- Mundo: ${worldData?.name || 'Não definido'}
- Gênero: ${worldData?.genre || 'Fantasia'}
- Elementos do Mundo: ${Object.keys(worldData || {}).filter(key => 
        Array.isArray(worldData[key]) && worldData[key].length > 0
      ).length} tipos

Forneça insights sobre:
1. Estrutura narrativa recomendada
2. Elementos que podem ser explorados
3. Pontos de tensão e desenvolvimento
4. Oportunidades narrativas`;

      const result = await generateWithContext(insightsPrompt);
      return result;
    } catch (error) {
      console.error('Erro ao obter insights para volumes:', error);
      return null;
    }
  }, [generateWithContext]);

  return {
    isAgentOpen,
    setIsAgentOpen,
    isAnalyzing,
    generateWithContext,
    analyzeProject,
    generateElementPrompt,
    getQualityTips,
    getVolumeInsights
  };
};
