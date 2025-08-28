import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { AIService, getBestModelForTask } from '../utils/aiProviders';

export const useAIAgent = (aiProvider, settings) => {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateWithContext = useCallback(async (prompt, context) => {
    if (!aiProvider) {
      toast.error('Configure um provedor de IA nas configurações');
      return null;
    }

    if (!settings?.aiProviders?.[aiProvider]) {
      toast.error('Provedor de IA não configurado');
      return null;
    }

    try {
      // Get API key from settings (same pattern as getAIService in WorldBuilder.js)
      const providerSettings = settings.aiProviders[aiProvider];
      if (!providerSettings.apiKey) {
        toast.error('API Key não configurada');
        return null;
      }

      const service = new AIService(aiProvider, providerSettings.apiKey, {
        model: providerSettings.defaultModel,
        temperature: providerSettings.temperature,
        maxTokens: providerSettings.maxTokens
      });
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
  }, [aiProvider, settings]);

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

  // Função avançada para gerar elementos com análise de coerência
  const generateSmartElement = useCallback(async (elementType, worldData, projectData) => {
    // Análise profunda do contexto
    const contextAnalysis = {
      worldName: worldData?.name || 'Mundo não definido',
      genre: worldData?.genre || 'Fantasia',
      techLevel: worldData?.techLevel || 'Medieval',
      
      // Elementos existentes
      locations: worldData?.locations || [],
      peoples: worldData?.peoples || [],
      regions: worldData?.regions || [],
      landmarks: worldData?.landmarks || [],
      resources: worldData?.resources || [],
      languages: worldData?.languages || [],
      religions: worldData?.religions || [],
      traditions: worldData?.traditions || [],
      technologies: worldData?.technologies || [],
      governments: worldData?.governments || [],
      economies: worldData?.economies || [],
      events: worldData?.events || [],
      magicSystems: worldData?.magicSystems || [],
      
      // Dados do projeto
      volumes: projectData?.volumes || [],
      chapters: projectData?.chapters || [],
      characters: projectData?.characters || []
    };

    // Cria um prompt inteligente baseado no tipo de elemento
    let smartPrompt = '';
    
    switch (elementType) {
      case 'economy':
        smartPrompt = `Crie um sistema econômico detalhado e coerente para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Recursos Disponíveis: ${contextAnalysis.resources.map(r => r.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Governos: ${contextAnalysis.governments.map(g => g.name).join(', ') || 'Nenhum definido'}

REQUISITOS:
1. Sistema monetário apropriado ao nível tecnológico
2. Principais setores econômicos baseados nos recursos
3. Rotas comerciais entre regiões existentes
4. Classes sociais e distribuição de riqueza
5. Impostos e regulamentações
6. Guildas ou organizações comerciais
7. Problemas econômicos atuais
8. Oportunidades narrativas econômicas

Formate como JSON com estrutura clara e detalhada.`;
        break;

      case 'culture':
        smartPrompt = `Desenvolva uma cultura rica e detalhada para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Religiões: ${contextAnalysis.religions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Tradições: ${contextAnalysis.traditions.map(t => t.name).join(', ') || 'Nenhuma definida'}
- Idiomas: ${contextAnalysis.languages.map(l => l.name).join(', ') || 'Nenhum definido'}

REQUISITOS:
1. Valores culturais fundamentais
2. Estrutura familiar e relações sociais
3. Arte, música e literatura
4. Culinária e gastronomia
5. Vestimentas e moda
6. Festivais e celebrações
7. Tabus e normas sociais
8. Educação e conhecimento
9. Ritos de passagem
10. Entretenimento e lazer

Conecte com elementos existentes e crie oportunidades narrativas.`;
        break;

      case 'politics':
        smartPrompt = `Crie um sistema político complexo para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Governos: ${contextAnalysis.governments.map(g => g.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Eventos Históricos: ${contextAnalysis.events.map(e => e.name).join(', ') || 'Nenhum definido'}

REQUISITOS:
1. Estrutura de poder e hierarquia
2. Facções políticas e seus objetivos
3. Conflitos e tensões atuais
4. Alianças e tratados
5. Sistema legal e justiça
6. Diplomacia e relações externas
7. Intrigas e conspirações
8. Figuras políticas importantes
9. Movimentos de resistência ou reforma
10. Oportunidades para desenvolvimento narrativo

Crie conexões com personagens e eventos existentes.`;
        break;

      case 'magic':
        smartPrompt = `Desenvolva um sistema mágico único e coerente para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Sistemas Mágicos Existentes: ${contextAnalysis.magicSystems.map(m => m.name).join(', ') || 'Nenhum definido'}

REQUISITOS:
1. Origem e natureza da magia
2. Regras e limitações claras
3. Tipos de magia e especializações
4. Custo e consequências do uso
5. Quem pode usar magia e como
6. Artefatos e itens mágicos
7. Locais de poder mágico
8. Organizações mágicas
9. Relação com tecnologia e sociedade
10. Mistérios e segredos mágicos

Mantenha consistência com o tom e atmosfera do mundo.`;
        break;

      case 'history':
        smartPrompt = `Crie uma linha temporal histórica detalhada para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Eventos Existentes: ${contextAnalysis.events.map(e => e.name).join(', ') || 'Nenhum definido'}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}

REQUISITOS:
1. Eras históricas principais
2. Eventos fundadores da civilização
3. Grandes guerras e conflitos
4. Descobertas e avanços importantes
5. Figuras históricas lendárias
6. Catástrofes e crises
7. Períodos de prosperidade
8. Mistérios históricos não resolvidos
9. Profecias e previsões
10. Como a história impacta o presente

Conecte com elementos existentes e crie ganchos narrativos.`;
        break;

      case 'religion':
        smartPrompt = `Crie uma religião ÚNICA e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Religiões Existentes: ${contextAnalysis.religions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Tradições: ${contextAnalysis.traditions.map(t => t.name).join(', ') || 'Nenhuma definida'}

REGRAS CRÍTICAS:
1. NÃO repita nenhuma das religiões existentes: ${contextAnalysis.religions.map(r => r.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite temas similares aos já existentes
4. Use criatividade máxima para diferenciar

REQUISITOS:
1. Nome da religião (deve ser único e memorável)
2. Tipo específico (monoteísta, politeísta, animista, panteísta, dualista, etc.)
3. Divindades ou conceitos centrais únicos
4. Dogmas e crenças fundamentais originais
5. Rituais e práticas específicas
6. Hierarquia religiosa detalhada
7. Locais sagrados e sua importância
8. Textos e escrituras sagradas
9. Festivais religiosos únicos
10. Relação com outras religiões (conflito, tolerância, sincretismo)
11. Impacto na sociedade e política
12. Segredos ou mistérios da religião

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe uma religião de luz, crie uma de sombras
- Se já existe uma religião de guerra, crie uma de paz
- Se já existe uma religião de natureza, crie uma de tecnologia
- Se já existe uma religião monoteísta, crie uma politeísta

Formate como JSON detalhado com todos os campos acima.`;
        break;

      case 'tradition':
        smartPrompt = `Crie uma tradição cultural ÚNICA e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Religiões: ${contextAnalysis.religions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Tradições Existentes: ${contextAnalysis.traditions.map(t => t.name).join(', ') || 'Nenhuma definida'}

REGRAS CRÍTICAS:
1. NÃO repita nenhuma das tradições existentes: ${contextAnalysis.traditions.map(t => t.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite temas similares aos já existentes
4. Use criatividade máxima para diferenciar

REQUISITOS:
1. Nome da tradição (deve ser único e memorável)
2. Tipo específico (ritual de passagem, festival sazonal, cerimônia de cura, rito de fertilidade, celebração de colheita, ritual de proteção, etc.)
3. Origem histórica detalhada e única
4. Como é praticada (passo a passo específico)
5. Significado cultural profundo
6. Quem participa (idade, gênero, classe social)
7. Quando ocorre (data específica, condição climática, evento celestial)
8. Elementos simbólicos únicos
9. Variações regionais ou familiares
10. Importância social e impacto na comunidade
11. Evolução ao longo do tempo
12. Conflitos ou controvérsias relacionadas

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe um festival de luzes, crie um ritual de sombras
- Se já existe uma celebração de colheita, crie um rito de plantio
- Se já existe um ritual de passagem, crie uma cerimônia de morte
- Se já existe uma festa religiosa, crie um festival secular

FORMATO JSON OBRIGATÓRIO:
{
  "name": "Nome da Tradição",
  "type": "Tipo da Tradição",
  "origin": "Origem Histórica",
  "practice": "Como é Praticada",
  "meaning": "Significado Cultural",
  "participants": "Quem Participa",
  "frequency": "Quando Ocorre",
  "symbols": "Elementos Simbólicos",
  "variations": "Variações Regionais",
  "importance": "Importância Social",
  "evolution": "Evolução Histórica",
  "conflicts": "Conflitos ou Controvérsias"
}

Use APENAS os nomes de campos em inglês listados acima. NÃO use nomes em português.`;
        break;

      case 'technology':
        smartPrompt = `Crie uma tecnologia ÚNICA e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Tecnologias Existentes: ${contextAnalysis.technologies.map(t => t.name).join(', ') || 'Nenhuma definida'}
- Recursos: ${contextAnalysis.resources.map(r => r.name).join(', ') || 'Nenhum definido'}

REGRAS CRÍTICAS:
1. NÃO repita nenhuma das tecnologias existentes: ${contextAnalysis.technologies.map(t => t.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite categorias similares aos já existentes
4. Use criatividade máxima para diferenciar

REQUISITOS:
1. Nome da tecnologia (deve ser único e memorável)
2. Categoria específica (comunicação, transporte, medicina, agricultura, construção, guerra, entretenimento, etc.)
3. Princípio de funcionamento detalhado
4. Aplicações práticas específicas
5. Limitações e requisitos técnicos
6. Impacto na sociedade e economia
7. Quem tem acesso (classes sociais, regiões)
8. Custo e disponibilidade
9. Potencial de desenvolvimento futuro
10. Riscos e perigos associados
11. Relação com magia (se houver)
12. Inovação ou revolução que representa

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe uma tecnologia de comunicação, crie uma de transporte
- Se já existe uma tecnologia de guerra, crie uma de paz
- Se já existe uma tecnologia de produção, crie uma de consumo
- Se já existe uma tecnologia mecânica, crie uma química

Mantenha consistência com o nível tecnológico ${contextAnalysis.techLevel}.

Formate como JSON detalhado com todos os campos acima.`;
        break;

      case 'region':
        smartPrompt = `Crie uma região geográfica ÚNICA e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Regiões Existentes: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Locais: ${contextAnalysis.locations.map(l => l.name).join(', ') || 'Nenhum definido'}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}

REGRAS CRÍTICAS:
1. NÃO repita nenhuma das regiões existentes: ${contextAnalysis.regions.map(r => r.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite climas e terrenos similares aos já existentes
4. Use criatividade máxima para diferenciar
5. Considere a geografia geral do mundo

REQUISITOS:
1. Nome da região (deve ser único e memorável)
2. Tipo geográfico específico (continente, ilha, península, arquipélago, vale, planalto, deserto, floresta, montanha, costa, etc.)
3. Clima predominante e variações sazonais
4. Terreno e topografia detalhados
5. Recursos naturais abundantes
6. População estimada e distribuição
7. Principais assentamentos e cidades
8. Rotas comerciais e de transporte
9. Características ambientais únicas
10. Perigos naturais ou sobrenaturais
11. Importância estratégica ou econômica
12. Conflitos territoriais ou disputas
13. Flora e fauna características
14. Recursos hídricos (rios, lagos, mares)
15. Conectividade com outras regiões

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe uma região montanhosa, crie uma planície
- Se já existe uma região costeira, crie uma continental
- Se já existe uma região fria, crie uma quente
- Se já existe uma região árida, crie uma úmida
- Se já existe uma região populosa, crie uma isolada

FORMATO JSON OBRIGATÓRIO (use APENAS estes nomes de campos em inglês):
{
  "name": "Nome da região",
  "type": "Tipo geográfico",
  "climate": "Clima predominante",
  "terrain": "Descrição do terreno",
  "population": "População estimada",
  "description": "Descrição geral da região",
  "naturalResources": "Recursos naturais",
  "settlements": "Principais assentamentos",
  "tradeRoutes": "Rotas comerciais",
  "uniqueFeatures": "Características únicas",
  "dangers": "Perigos naturais",
  "strategicImportance": "Importância estratégica",
  "conflicts": "Conflitos territoriais",
  "floraFauna": "Flora e fauna",
  "waterResources": "Recursos hídricos",
  "connectivity": "Conectividade com outras regiões"
}

IMPORTANTE: Use APENAS os nomes de campos em inglês listados acima. NÃO use nomes em português.`;
        break;

      case 'landmark':
        smartPrompt = `Crie um marco/ponto de referência ÚNICO e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Marcos Existentes: ${contextAnalysis.landmarks.map(l => l.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Locais: ${contextAnalysis.locations.map(l => l.name).join(', ') || 'Nenhum definido'}

REGRAS CRÍTICAS:
1. NÃO repita nenhum dos marcos existentes: ${contextAnalysis.landmarks.map(l => l.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite tipos similares aos já existentes
4. Use criatividade máxima para diferenciar
5. Considere a geografia e história do mundo

REQUISITOS:
1. Nome do marco (deve ser único e memorável)
2. Tipo específico (montanha sagrada, ruínas antigas, monumento, torre, templo, ponte, caverna, árvore gigante, fonte, castelo, cidade flutuante, portal, etc.)
3. Descrição visual detalhada
4. Importância histórica ou cultural
5. Localização específica
6. Características especiais ou mágicas
7. Lendas ou mitos associados
8. Acesso e perigos
9. Impacto na narrativa
10. Conexões com outros elementos

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe um marco religioso, crie um militar
- Se já existe um marco natural, crie um artificial
- Se já existe um marco antigo, crie um moderno
- Se já existe um marco acessível, crie um inacessível
- Se já existe um marco conhecido, crie um misterioso

FORMATO JSON OBRIGATÓRIO (use APENAS estes nomes de campos em inglês):
{
  "name": "Nome do marco",
  "type": "Tipo do marco",
  "description": "Descrição detalhada",
  "significance": "Importância histórica",
  "location": "Localização específica",
  "features": "Características especiais",
  "legends": "Lendas associadas",
  "access": "Como acessar",
  "dangers": "Perigos ou desafios",
  "narrativeImpact": "Impacto na narrativa"
}

IMPORTANTE: Use APENAS os nomes de campos em inglês listados acima. NÃO use nomes em português.`;
        break;

      case 'language':
        smartPrompt = `Crie um idioma ÚNICO e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Idiomas Existentes: ${contextAnalysis.languages.map(l => l.name).join(', ') || 'Nenhum definido'}
- Povos: ${contextAnalysis.peoples.map(p => p.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}

REGRAS CRÍTICAS:
1. NÃO repita nenhum dos idiomas existentes: ${contextAnalysis.languages.map(l => l.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite famílias linguísticas similares aos já existentes
4. Use criatividade máxima para diferenciar
5. Considere a cultura e história dos povos

REQUISITOS:
1. Nome do idioma (deve ser único e memorável)
2. Família linguística específica (isolada, tonal, aglutinativa, flexional, etc.)
3. Descrição das características fonéticas
4. Principais falantes e distribuição geográfica
5. Sistema de escrita (alfabético, silábico, logográfico, etc.)
6. Exemplos de palavras e frases básicas
7. Dialetos regionais
8. Influências culturais
9. Status social e prestígio
10. Evolução histórica

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe um idioma tonal, crie um não-tonal
- Se já existe um idioma alfabético, crie um silábico
- Se já existe um idioma antigo, crie um moderno
- Se já existe um idioma formal, crie um coloquial
- Se já existe um idioma isolado, crie um com família

FORMATO JSON OBRIGATÓRIO (use APENAS estes nomes de campos em inglês):
{
  "name": "Nome do idioma",
  "family": "Família linguística",
  "description": "Descrição detalhada",
  "speakers": "Principais falantes",
  "script": "Sistema de escrita",
  "examples": "Exemplos de palavras",
  "dialects": "Dialetos regionais",
  "culturalInfluence": "Influências culturais",
  "socialStatus": "Status social",
  "evolution": "Evolução histórica"
}

IMPORTANTE: Use APENAS os nomes de campos em inglês listados acima. NÃO use nomes em português.`;
        break;

      case 'resource':
        smartPrompt = `Crie um recurso natural/material ÚNICO e ORIGINAL para o mundo "${contextAnalysis.worldName}".

ANÁLISE DE CONTEXTO:
- Gênero: ${contextAnalysis.genre}
- Nível Tecnológico: ${contextAnalysis.techLevel}
- Recursos Existentes: ${contextAnalysis.resources.map(r => r.name).join(', ') || 'Nenhum definido'}
- Regiões: ${contextAnalysis.regions.map(r => r.name).join(', ') || 'Nenhuma definida'}
- Marcos: ${contextAnalysis.landmarks.map(l => l.name).join(', ') || 'Nenhum definido'}

REGRAS CRÍTICAS:
1. NÃO repita nenhum dos recursos existentes: ${contextAnalysis.resources.map(r => r.name).join(', ')}
2. Crie algo COMPLETAMENTE DIFERENTE e ÚNICO
3. Evite tipos similares aos já existentes
4. Use criatividade máxima para diferenciar
5. Considere o nível tecnológico e mágico do mundo

REQUISITOS:
1. Nome do recurso (deve ser único e memorável)
2. Tipo específico (mineral, vegetal, animal, mágico, energético, químico, etc.)
3. Descrição das características físicas
4. Nível de raridade (comum, incomum, raro, muito raro, lendário)
5. Principais usos e aplicações
6. Localização onde pode ser encontrado
7. Métodos de extração ou obtenção
8. Valor econômico e comercial
9. Propriedades especiais ou mágicas
10. Impacto na sociedade e tecnologia

EXEMPLOS DE DIFERENCIAÇÃO:
- Se já existe um recurso mineral, crie um vegetal
- Se já existe um recurso comum, crie um raro
- Se já existe um recurso natural, crie um artificial
- Se já existe um recurso terrestre, crie um aquático
- Se já existe um recurso físico, crie um energético

FORMATO JSON OBRIGATÓRIO (use APENAS estes nomes de campos em inglês):
{
  "name": "Nome do recurso",
  "type": "Tipo do recurso",
  "description": "Características",
  "rarity": "Nível de raridade",
  "uses": "Principais usos",
  "location": "Onde é encontrado",
  "extraction": "Métodos de extração",
  "value": "Valor econômico",
  "properties": "Propriedades especiais",
  "impact": "Impacto na sociedade"
}

IMPORTANTE: Use APENAS os nomes de campos em inglês listados acima. NÃO use nomes em português.`;
        break;

      default:
        smartPrompt = `Gere um ${elementType} detalhado e coerente para o mundo "${contextAnalysis.worldName}".
        
Considere todos os elementos existentes e mantenha consistência total com o contexto estabelecido.`;
    }

    // Adiciona análise de coerência
    smartPrompt += `\n\nANÁLISE DE COERÊNCIA:
- Certifique-se de que tudo seja consistente com o gênero ${contextAnalysis.genre}
- Respeite o nível tecnológico ${contextAnalysis.techLevel}
- Conecte com pelo menos 3 elementos existentes
- Crie pelo menos 5 oportunidades narrativas
- Mantenha o tom e atmosfera estabelecidos
- Evite contradições com elementos já criados

FORMATO: Resposta estruturada e detalhada, preferencialmente em JSON quando apropriado.`;

    return generateWithContext(smartPrompt, contextAnalysis);
  }, [generateWithContext]);

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
