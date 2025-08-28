// Sistema Unificado de Integração de Prompts
// Substitui todos os prompts hardcoded em todos os componentes

import { BASE_PROMPTS, PromptUtils } from './promptBank';
import { PromptManager, DynamicPromptGenerator, PromptTemplate } from './promptTools';
import { cleanAIResponse as cleanResponseHelper, cleanAIResponseSync } from './cleanAIResponse';

export class UnifiedPromptIntegration {
  constructor(worldData, aiService) {
    this.worldData = worldData;
    this.aiService = aiService;
    this.promptManager = new PromptManager();
    this.dynamicGenerator = new DynamicPromptGenerator(worldData);
    this.initializePromptManager();
  }

  // Inicializa o prompt manager com todos os prompts do banco
  initializePromptManager() {
    // Registra todos os prompts do BASE_PROMPTS
    this.registerAllPrompts();
  }

  // Registra todos os prompts do banco no prompt manager
  registerAllPrompts() {
    // Registra prompts de geografia
    Object.entries(BASE_PROMPTS.geography).forEach(([key, prompt]) => {
      if (typeof prompt === 'object') {
        Object.entries(prompt).forEach(([subKey, subPrompt]) => {
          const template = new PromptTemplate(`geography_${key}_${subKey}`, subPrompt)
            .withMetadata({ category: 'geography', subcategory: key, type: subKey });
          this.promptManager.registerTemplate(template);
        });
      } else {
        const template = new PromptTemplate(`geography_${key}`, prompt)
          .withMetadata({ category: 'geography', type: key });
        this.promptManager.registerTemplate(template);
      }
    });

    // Registra prompts de culturas
    Object.entries(BASE_PROMPTS.cultures).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`cultures_${key}`, prompt)
        .withMetadata({ category: 'cultures', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de sistemas
    Object.entries(BASE_PROMPTS.systems).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`systems_${key}`, prompt)
        .withMetadata({ category: 'systems', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de história
    Object.entries(BASE_PROMPTS.history).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`history_${key}`, prompt)
        .withMetadata({ category: 'history', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de personagens
    Object.entries(BASE_PROMPTS.characters).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`characters_${key}`, prompt)
        .withMetadata({ category: 'characters', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de lore
    Object.entries(BASE_PROMPTS.lore).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`lore_${key}`, prompt)
        .withMetadata({ category: 'lore', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de narrativa
    Object.entries(BASE_PROMPTS.narrative).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`narrative_${key}`, prompt)
        .withMetadata({ category: 'narrative', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de análise
    Object.entries(BASE_PROMPTS.analysis).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`analysis_${key}`, prompt)
        .withMetadata({ category: 'analysis', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de interdependências
    Object.entries(BASE_PROMPTS.interdependencies).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`interdependencies_${key}`, prompt)
        .withMetadata({ category: 'interdependencies', type: key });
      this.promptManager.registerTemplate(template);
    });

    // Registra prompts de informações do mundo
    Object.entries(BASE_PROMPTS.worldInfo).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`worldInfo_${key}`, prompt)
        .withMetadata({ category: 'worldInfo', type: key });
      this.promptManager.registerTemplate(template);
    });
  }

  // Métodos para WorldBuilder
  async generateLocation(type = 'random') {
    const promptName = `geography_location_${type}`;
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'location');
    
    // Se o parsing falhou, retorna um local básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para local');
      return this.createFallbackLocation(result);
    }
    
    return parsedResult;
  }

  async generatePeople() {
    const promptName = 'cultures_people';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'people');
    
    // Se o parsing falhou, retorna um povo básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para povo');
      return this.createFallbackPeople(result);
    }
    
    return parsedResult;
  }

  async generateEvent() {
    const promptName = 'history_event';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'event');
    
    // Se o parsing falhou, retorna um evento básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para evento');
      return this.createFallbackEvent(result);
    }
    
    return parsedResult;
  }

  async generateEra() {
    console.log('unifiedPromptIntegration.generateEra() chamada');
    console.log('aiService disponível:', !!this.aiService);
    console.log('promptManager disponível:', !!this.promptManager);
    
    const promptName = 'history_era';
    const context = this.buildWorldContext();
    console.log('Contexto construído:', context);
    
    try {
      console.log('Executando prompt:', promptName);
      const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
      console.log('Resultado bruto da IA:', result);
      
      const parsedResult = await this.cleanAIResponse(result, 'era');
      console.log('Resultado parseado:', parsedResult);
      
      // Se o parsing falhou, retorna uma era básica como fallback
      if (!parsedResult) {
        console.warn('Falha no parsing JSON, usando fallback para era');
        return this.createFallbackEra(result);
      }
      
      return parsedResult;
    } catch (error) {
      console.error('Erro em generateEra:', error);
      throw error;
    }
  }

  async generateMagicSystem() {
    const promptName = 'systems_magic';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'magicSystem');
    
    // Se o parsing falhou, retorna um sistema mágico básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para sistema mágico');
      return this.createFallbackMagicSystem(result);
    }
    
    return parsedResult;
  }

  async generateReligion() {
    const promptName = 'cultures_religion';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'religion');
    
    // Se o parsing falhou, retorna uma religião básica como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para religião');
      return this.createFallbackReligion(result);
    }
    
    return parsedResult;
  }

  async generateTechnology() {
    const promptName = 'systems_technology';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'technology');
    
    // Se o parsing falhou, retorna uma tecnologia básica como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para tecnologia');
      return this.createFallbackTechnology(result);
    }
    
    return parsedResult;
  }

  async generateGovernment() {
    const promptName = 'systems_government';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'government');
    
    // Se o parsing falhou, retorna um governo básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para governo');
      return this.createFallbackGovernment(result);
    }
    
    return parsedResult;
  }

  async generateEconomy() {
    const promptName = 'systems_economy';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'economy');
    
    // Se o parsing falhou, retorna uma economia básica como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para economia');
      return this.createFallbackEconomy(result);
    }
    
    return parsedResult;
  }

  async generateBasicInfo() {
    const promptName = 'worldInfo_basic';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'basicInfo');
  }

  // Métodos adicionais para WorldBuilder
  async generateLanguage() {
    const promptName = 'cultures_language';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'language');
    
    // Se o parsing falhou, retorna um idioma básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para idioma');
      return this.createFallbackLanguage(result);
    }
    
    return parsedResult;
  }

  async generateTradition() {
    const promptName = 'cultures_tradition';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'tradition');
    
    // Se o parsing falhou, retorna uma tradição básica como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para tradição');
      return this.createFallbackTradition(result);
    }
    
    return parsedResult;
  }

  async generateRegion() {
    const promptName = 'geography_region';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'region');
    
    // Se o parsing falhou, retorna uma região básica como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para região');
      return this.createFallbackRegion(result);
    }
    
    return parsedResult;
  }

  async generateLandmark() {
    const promptName = 'geography_landmark';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'landmark');
    
    // Se o parsing falhou, retorna um marco básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para marco');
      return this.createFallbackLandmark(result);
    }
    
    return parsedResult;
  }

  async generateResource() {
    const promptName = 'geography_resource';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'resource');
    
    // Se o parsing falhou, retorna um recurso básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para recurso');
      return this.createFallbackResource(result);
    }
    
    return parsedResult;
  }

  // Métodos para CharacterGenerator
  async generateCharacter(type = 'basic', additionalContext = {}) {
    const promptName = `characters_${type}`;
    const context = {
      ...this.buildWorldContext(),
      ...additionalContext
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'character');
    
    // Se o parsing falhou, retorna um personagem básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para personagem');
      return this.createFallbackCharacter(additionalContext);
    }
    
    return parsedResult;
  }

  async generateCharacterField(field, characterForm) {
    const promptName = `characters_field_${field}`;
    const context = {
      ...this.buildWorldContext(),
      currentForm: characterForm
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'characterField');
  }

  // Métodos para LoreGenerator
  async generateLoreItem(type, additionalContext = {}) {
    const promptName = `lore_${type}`;
    const context = {
      ...this.buildWorldContext(),
      ...additionalContext
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    const parsedResult = await this.cleanAIResponse(result, 'lore');
    
    // Se o parsing falhou, retorna um item de lore básico como fallback
    if (!parsedResult) {
      console.warn('Falha no parsing JSON, usando fallback para lore');
      return this.createFallbackLoreItem(type, additionalContext);
    }
    
    return parsedResult;
  }

  // Métodos para NarrativeGenerator
  async generateNarrativeItem(type, additionalContext = {}) {
    const promptName = `narrative_${type}`;
    const context = {
      ...this.buildWorldContext(),
      ...additionalContext
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'narrative');
  }

  async generateNarrativeField(field, narrativeForm, activeTab) {
    const promptName = `narrative_${activeTab}_${field}`;
    const context = {
      ...this.buildWorldContext(),
      currentForm: narrativeForm,
      activeTab: activeTab
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'narrativeField');
  }

  // Métodos para AIAssistant
  async generateAIResponse(prompt, additionalContext = {}) {
    const context = {
      ...this.buildWorldContext(),
      ...additionalContext,
      userPrompt: prompt
    };
    
    // Usa o prompt do usuário com contexto do mundo
    const enhancedPrompt = this.enhanceUserPrompt(prompt, context);
    return await this.aiService.generateText(enhancedPrompt);
  }

  // Métodos para useAIAgent
  async generateQualityTips(worldData, projectData) {
    const promptName = 'analysis_qualityTips';
    const context = {
      ...this.buildWorldContext(),
      volumesCount: projectData?.volumes?.length || 0,
      chaptersCount: projectData?.chapters?.length || 0
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'qualityTips');
  }

  async getQualityTips(worldData, projectData) {
    return await this.generateQualityTips(worldData, projectData);
  }

  async getVolumeInsights(worldData, projectData) {
    return await this.generateVolumeInsights(worldData, projectData);
  }

  async analyzeProject(worldData, projectData) {
    return await this.generateProjectAnalysis(worldData, projectData);
  }

  async generateElementPrompt(elementType, elementName, worldData) {
    const promptName = `analysis_elementPrompt_${elementType}`;
    const context = {
      ...this.buildWorldContext(),
      elementType,
      elementName
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'elementPrompt');
  }

  async generateWithContext(prompt, context = {}) {
    const enhancedContext = {
      ...this.buildWorldContext(),
      ...context
    };
    const enhancedPrompt = this.enhanceUserPrompt(prompt, enhancedContext);
    return await this.aiService.generateText(enhancedPrompt);
  }

  async extractStructuredData(content, actionType) {
    const promptName = `analysis_extractStructuredData_${actionType}`;
    const context = {
      content,
      actionType
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'structuredData');
  }

  async testConnection() {
    try {
      await this.aiService.generateText('Teste de conexão', {
        maxTokens: 10
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async generateVolumeInsights(worldData, projectData) {
    const promptName = 'analysis_volumeInsights';
    const context = {
      ...this.buildWorldContext(),
      elementsCount: Object.keys(worldData || {}).filter(key => 
        Array.isArray(worldData[key]) && worldData[key].length > 0
      ).length
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'volumeInsights');
  }

  async generateProjectAnalysis(worldData, projectData) {
    const promptName = 'analysis_projectAnalysis';
    const context = {
      ...this.buildWorldContext(),
      projectData
    };
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'projectAnalysis');
  }

  // Métodos para análise inteligente
  async generateSmartElement(elementType, additionalContext = {}) {
    const smartPrompt = this.dynamicGenerator.generateSmartPrompt(elementType);
    const context = {
      ...this.buildWorldContext(),
      ...additionalContext
    };
    
    const enhancedPrompt = PromptUtils.combineWithContext(smartPrompt, context);
    return await this.aiService.generateText(enhancedPrompt);
  }

  // Métodos utilitários
  buildWorldContext() {
    return {
      worldName: this.worldData?.name || 'Mundo da Light Novel',
      genre: this.worldData?.genre || 'fantasy',
      techLevel: this.worldData?.techLevel || 'medieval',
      description: this.worldData?.description || 'Um mundo de fantasia',
      existingElements: this.getExistingElements(),
      characters: this.worldData?.characters || [],
      locations: this.worldData?.locations || [],
      peoples: this.worldData?.peoples || [],
      religions: this.worldData?.religions || [],
      magicSystems: this.worldData?.magicSystems || [],
      technologies: this.worldData?.technologies || [],
      governments: this.worldData?.governments || [],
      economies: this.worldData?.economies || [],
      events: this.worldData?.events || []
    };
  }

  getExistingElements() {
    const elements = [];
    
    if (this.worldData?.locations) elements.push(...this.worldData.locations);
    if (this.worldData?.peoples) elements.push(...this.worldData.peoples);
    if (this.worldData?.religions) elements.push(...this.worldData.religions);
    if (this.worldData?.magicSystems) elements.push(...this.worldData.magicSystems);
    if (this.worldData?.technologies) elements.push(...this.worldData.technologies);
    if (this.worldData?.governments) elements.push(...this.worldData.governments);
    if (this.worldData?.economies) elements.push(...this.worldData.economies);
    if (this.worldData?.events) elements.push(...this.worldData.events);
    
    return elements;
  }

  enhanceUserPrompt(userPrompt, context) {
    let enhancedPrompt = userPrompt;
    
    // Adiciona contexto do mundo
    if (context.worldName) {
      enhancedPrompt = `Para o mundo "${context.worldName}":\n\n${enhancedPrompt}`;
    }

    // Adiciona elementos existentes para referência
    if (context.existingElements?.length > 0) {
      enhancedPrompt += `\n\nElementos existentes para referência:\n${context.existingElements.map(el => `- ${el.name}: ${el.description}`).join('\n')}`;
    }

    // Adiciona personagens relacionados
    if (context.characters?.length > 0) {
      enhancedPrompt += `\n\nPersonagens relacionados:\n${context.characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}`;
    }

    // Adiciona regras de formato JSON se necessário
    if (enhancedPrompt.toLowerCase().includes('json')) {
      enhancedPrompt += `\n\n${BASE_PROMPTS.rules.jsonFormat}`;
    }

    return enhancedPrompt;
  }

  // Métodos de acesso
  getAnalytics() {
    return this.promptManager.getAnalytics();
  }

  getHistory(limit = 50) {
    return this.promptManager.getHistory(limit);
  }

  getAvailablePrompts(category = null) {
    return this.promptManager.listTemplates(category);
  }

  // Método para limpar resposta da IA usando IA (versão assíncrona)
  async cleanAIResponse(response, fieldType = 'magicSystem') {
    // Usa o helper externo para limpeza com IA
    return await cleanResponseHelper(response, fieldType, this.aiService);
  }

  // Método síncrono para compatibilidade
  cleanAIResponseSync(response, fieldType = 'magicSystem') {
    // Versão síncrona para compatibilidade
    return cleanAIResponseSync(response, fieldType);
  }

  cleanAIResponseOLD(response) {
    // Se a resposta já é um objeto (não uma string), retorna diretamente
    if (typeof response === 'object' && response !== null) {
      console.log('📦 Resposta já é um objeto, retornando diretamente:', response);
      // Adiciona campo generatedBy se não existir
      if (!response.generatedBy) {
        response.generatedBy = 'AI';
        response.createdAt = new Date().toISOString();
      }
      return response;
    }
    
    // Primeiro, tenta extrair o conteúdo se for uma resposta de API completa
    let cleaned = this.extractContentFromAPIResponse(response);
    
    // Remove texto antes do primeiro {
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace > 0) {
      cleaned = cleaned.substring(firstBrace);
    }
    
    // Remove texto após o último }
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < cleaned.length - 1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }
    
    // Verifica se o JSON está incompleto (faltando chave de fechamento)
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;
    
    if (openBraces > closeBraces) {
      console.log('🔧 JSON incompleto detectado, adicionando chaves de fechamento...');
      // Adiciona as chaves de fechamento necessárias
      const missingBraces = openBraces - closeBraces;
      cleaned += '}'.repeat(missingBraces);
      console.log('✅ Chaves de fechamento adicionadas:', missingBraces);
    }
    
    if (openBrackets > closeBrackets) {
      console.log('🔧 JSON incompleto detectado, adicionando colchetes de fechamento...');
      const missingBrackets = openBrackets - closeBrackets;
      cleaned += ']'.repeat(missingBrackets);
      console.log('✅ Colchetes de fechamento adicionados:', missingBrackets);
    }
    
    // Remove quebras de linha e espaços extras
    cleaned = cleaned.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Remove HTML entities e markdown artifacts que a IA pode incluir
    cleaned = cleaned.replace(/\\u003c\/span\\u003e/g, '');
    cleaned = cleaned.replace(/```json/g, '');
    cleaned = cleaned.replace(/```/g, '');
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\n/g, ' ');
    cleaned = cleaned.replace(/\\t/g, ' ');
    
    // Remove caracteres problemáticos que podem quebrar o JSON
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    
    // Corrige problemas comuns de formatação JSON
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1'); // Remove vírgulas trailing
    cleaned = cleaned.replace(/([^\\])"/g, '$1"'); // Corrige aspas não escapadas
    cleaned = cleaned.replace(/,\s*,/g, ','); // Remove vírgulas duplas
    cleaned = cleaned.replace(/:\s*,/g, ': null,'); // Substitui valores vazios por null
    
    // Corrige parênteses não escapados em strings (problema comum com pronúncias)
    cleaned = cleaned.replace(/\(([^)]+)\)/g, '\\($1\\)');
    
    // Corrige aspas não escapadas dentro de strings que contêm parênteses
    cleaned = cleaned.replace(/"([^"]*?)\(([^)]*?)"([^"]*?)"/g, '"$1\\($2\\)$3"');
    
    // Corrige caracteres escapados malformados
    // Remove escapes desnecessários de aspas dentro de strings
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\\\/g, '\\');
    
    // Corrige parênteses escapados malformados
    cleaned = cleaned.replace(/\\\(/g, '(');
    cleaned = cleaned.replace(/\\\)/g, ')');
    
    // Remove escapes de caracteres que não precisam ser escapados
    cleaned = cleaned.replace(/\\([^"\\\/bfnrt])/g, '$1');
    
    // Corrige aspas não escapadas dentro de strings (problema específico com exemplos de idiomas)
    // Procura por padrões como "hello": ""kala'kha"" e corrige para "hello": "kala'kha"
    cleaned = cleaned.replace(/"([^"]+)":\s*""([^"]+)""/g, '"$1": "$2"');
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"([^"]*)"([^"]*)"/g, '"$1": "$2$3$4"');
    
    // Corrige problemas específicos com objetos aninhados que estão malformados
    // Exemplo: "examples": { "hello": "Zhilakai, goodbye": "Korvathri" } -> "examples": { "hello": "Zhilakai", "goodbye": "Korvathri" }
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]+),\s*([^"]+)":\s*"([^"]+)"/g, '"$1": "$2", "$3": "$4"');
    
    // Corrige chaves de fechamento mal posicionadas dentro de strings
    // Exemplo: "Focus": "texto }" -> "Focus": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*}\s*"/g, '"$1": "$2"');
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*]\s*"/g, '"$1": "$2"');
    
         // Corrige aspas de fechamento mal posicionadas
     // Exemplo: "Focus": "texto" } -> "Focus": "texto"
     cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}/g, '"$1": "$2"');
     cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*]/g, '"$1": "$2"');
     
         // Corrige JSON incompleto que termina abruptamente
    // Verifica se o JSON termina com aspas duplas sem chave de fechamento
    if (cleaned.endsWith('"') && !cleaned.endsWith('"}')) {
      cleaned += '}';
      console.log('🔧 Adicionada chave de fechamento para JSON incompleto');
    }
    
    // Corrige JSON que termina com espaço após a última propriedade
    if (cleaned.endsWith('" ') && !cleaned.endsWith('" }')) {
      cleaned = cleaned.trim() + '}';
      console.log('🔧 Corrigido JSON que terminava com espaço');
    }
    
    // Corrige JSON que termina abruptamente sem chave de fechamento
    if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
      // Conta chaves abertas e fechadas
      const openBraces = (cleaned.match(/\{/g) || []).length;
      const closeBraces = (cleaned.match(/\}/g) || []).length;
      const openBrackets = (cleaned.match(/\[/g) || []).length;
      const closeBrackets = (cleaned.match(/\]/g) || []).length;
      
      // Adiciona chaves de fechamento necessárias
      const missingBraces = openBraces - closeBraces;
      const missingBrackets = openBrackets - closeBrackets;
      
      if (missingBraces > 0) {
        cleaned += '}'.repeat(missingBraces);
        console.log(`🔧 Adicionadas ${missingBraces} chaves de fechamento para JSON incompleto`);
      }
      
      if (missingBrackets > 0) {
        cleaned += ']'.repeat(missingBrackets);
        console.log(`🔧 Adicionados ${missingBrackets} colchetes de fechamento para JSON incompleto`);
      }
    }
    
    // Remove caracteres problemáticos como bullet points (•) e quebras de linha dentro de strings
    cleaned = cleaned.replace(/•/g, '-'); // Substitui bullet points por hífens
    cleaned = cleaned.replace(/\n/g, ' '); // Remove quebras de linha
    cleaned = cleaned.replace(/\r/g, ' '); // Remove retornos de carro
    cleaned = cleaned.replace(/\t/g, ' '); // Remove tabs
    
    // Corrige strings que contêm caracteres problemáticos
    cleaned = cleaned.replace(/"([^"]*?)(\n|\r|\t|•)([^"]*?)"/g, '"$1 $3"');
     
         // Corrige JSON aninhado malformado (problema específico com rules e limitations)
    // Procura por padrões como "rules": "{key: "value","key2": "value2}"
    cleaned = cleaned.replace(/"([^"]+)":\s*"\{([^}]+)\}"/g, (match, key, content) => {
      // Escapa as aspas dentro do conteúdo JSON aninhado
      const escapedContent = content.replace(/"/g, '\\"');
      return `"${key}": "${escapedContent}"`;
    });
    
    // Corrige JSON aninhado que não tem aspas nas chaves
    // Exemplo: "rules": "{mana: "value","key2": "value2}" -> "rules": "{\"mana\": \"value\",\"key2\": \"value2\"}"
    cleaned = cleaned.replace(/"([^"]+)":\s*"\{([^}]+)\}"/g, (match, key, content) => {
      // Adiciona aspas nas chaves que não têm
      const fixedContent = content.replace(/([a-zA-Z_][a-zA-Z0-9_]*):\s*"/g, '"$1": "');
      return `"${key}": "{${fixedContent}}"`;
    });
    
    // Corrige chaves malformadas em objetos aninhados (problema específico com "Advanced": {)
    // Exemplo: Advanced": { -> "Advanced": {
    cleaned = cleaned.replace(/([a-zA-Z_][a-zA-Z0-9_]*)"\s*:\s*\{/g, '"$1": {');
    
    // Corrige objetos aninhados que terminam sem chave de fechamento
    // Procura por padrões como "Range": "texto } e adiciona chave de fechamento
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*}\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento mal posicionada
    // Exemplo: "Range": "texto } " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento e vírgula mal posicionada
    // Exemplo: "Range": "texto }, " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*},\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento e aspas mal posicionadas
    // Exemplo: "Range": "texto" } " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}\s*"/g, '"$1": "$2"');
    
    // Corrige chaves malformadas em objetos aninhados (problema específico com "Advanced": {)
    // Exemplo: Advanced": { -> "Advanced": {
    cleaned = cleaned.replace(/([a-zA-Z_][a-zA-Z0-9_]*)"\s*:\s*\{/g, '"$1": {');
    
    // Corrige objetos aninhados que terminam sem chave de fechamento
    // Procura por padrões como "Range": "texto } e adiciona chave de fechamento
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*}\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento mal posicionada
    // Exemplo: "Range": "texto } " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento e vírgula mal posicionada
    // Exemplo: "Range": "texto }, " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*},\s*"/g, '"$1": "$2"');
    
    // Corrige objetos aninhados que terminam com chave de fechamento e aspas mal posicionadas
    // Exemplo: "Range": "texto" } " -> "Range": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}\s*"/g, '"$1": "$2"');
     
     // Tenta fazer parse do JSON
    try {
      const parsed = JSON.parse(cleaned);
      
      // Verifica se o objeto tem chaves em português que precisam ser convertidas
      if (parsed && typeof parsed === 'object') {
        const converted = this.convertPortugueseKeys(parsed);
        if (converted) {
          console.log('🔄 Chaves convertidas de português para inglês:', converted);
          // Adiciona campo generatedBy se não existir
          if (!converted.generatedBy) {
            converted.generatedBy = 'AI';
            converted.createdAt = new Date().toISOString();
          }
          return converted;
        }
      }
      
      // Adiciona campo generatedBy se não existir
      if (parsed && typeof parsed === 'object' && !parsed.generatedBy) {
        parsed.generatedBy = 'AI';
        parsed.createdAt = new Date().toISOString();
      }
      
      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      console.error('Resposta original:', response);
      console.error('Resposta limpa:', cleaned);
      
      // Log detalhado para debug
      this.logJSONDebugInfo(cleaned, error);
      
      // Tenta uma segunda limpeza mais agressiva
      try {
        // Remove tudo que não seja JSON válido
        const jsonMatch = cleaned.match(/\{.*\}/s);
        if (jsonMatch) {
          const aggressiveClean = jsonMatch[0]
            .replace(/[^\x20-\x7E]/g, '') // Remove caracteres não-ASCII
            .replace(/,(\s*[}\]])/g, '$1') // Remove vírgulas trailing novamente
            .replace(/,\s*,/g, ',') // Remove vírgulas duplas novamente
            .replace(/:\s*,/g, ': null,'); // Substitui valores vazios por null novamente
          
          const parsed = JSON.parse(aggressiveClean);
          const converted = this.convertPortugueseKeys(parsed);
          if (converted) {
            return converted;
          }
          return parsed;
        }
      } catch (secondError) {
        console.error('Segunda tentativa de parse também falhou:', secondError);
      }
      
      // Terceira tentativa: limpeza ultra-agressiva
      try {
        const ultraClean = this.performUltraAggressiveCleaning(cleaned);
        if (ultraClean) {
          const parsed = JSON.parse(ultraClean);
          const converted = this.convertPortugueseKeys(parsed);
          if (converted) {
            return converted;
          }
          return parsed;
        }
      } catch (thirdError) {
        console.error('Terceira tentativa de parse também falhou:', thirdError);
      }
      
      return null;
    }
  }

  // Método para converter chaves em português para inglês
  convertPortugueseKeys(obj) {
    if (!obj || typeof obj !== 'object') return null;
    
    const portugueseToEnglish = {
      // Magic System keys
      'energia': 'energy',
      'frequência': 'frequency', 
      'interferência': 'interference',
      'nome': 'name',
      'descrição': 'description',
      'regras': 'rules',
      'fonte': 'source',
      'limitações': 'limitations',
      'custo': 'cost',
      'usuários': 'users',
      'artefatos': 'artifacts',
      'locais': 'locations',
      'organizações': 'organizations',
      'relação': 'relationship',
      'mistérios': 'mysteries',
      'origem': 'origin',
      'tipos': 'types',
      'poderes': 'powers',
      'história': 'history',
      'localização': 'location',
      'passos': 'steps',
      'requisitos': 'requirements',
      'efeitos': 'effects',
      'personagens': 'characters',
      'moral': 'moral',
      'poder': 'power',
      'importância': 'importance',
      'conexões': 'connections',
      'segredos': 'secrets',
      'impacto': 'impact',
      'variações': 'variations',
      'fontes': 'sources',
      'notas': 'notes',
      'título': 'title',
      'texto': 'text',
      'interpretação': 'interpretation',
      'cumprimento': 'fulfillment',
      'profeta': 'prophet',
      'condições': 'conditions',
      'lições': 'lessons',
      'influência': 'influence',
      'tipo': 'type',
      'prática': 'practice',
      'significado': 'meaning',
      'participantes': 'participants',
      'frequência': 'frequency',
      'símbolos': 'symbols',
      'evolução': 'evolution',
      'conflitos': 'conflicts',
      'controvérsias': 'controversies',
      'idade': 'age',
      'aparência': 'appearance',
      'personalidade': 'personality',
      'histórico': 'background',
      'objetivos': 'goals',
      'habilidades': 'abilities',
      'medos': 'fears',
      'forças': 'strengths',
      'fraquezas': 'weaknesses',
      'relacionamentos': 'relationships',
      'desenvolvimento': 'development',
      'região': 'region',
      'ocupação': 'occupation',
      'equipamentos': 'equipment',
      'frases': 'quotes',
      'clima': 'climate',
      'população': 'population',
      'cultura': 'culture',
      'governo': 'government',
      'economia': 'economy',
      'pontos': 'points',
      'atmosfera': 'atmosphere',
      'ano': 'year',
      'participantes': 'participants',
      'causas': 'causes',
      'consequências': 'consequences',
      'legado': 'legacy',
      'divindades': 'deities',
      'crenças': 'beliefs',
      'rituais': 'rituals',
      'seguidores': 'followers',
      'símbolos': 'symbols',
      'família': 'family',
      'falantes': 'speakers',
      'escrita': 'script',
      'exemplos': 'examples',
      'dialetos': 'dialects',
      'influência': 'influence',
      'status': 'status',
      'evolução': 'evolution',
      'traços': 'traits',
      'estrutura': 'structure',
      'território': 'territory',
      'idioma': 'language',
      'religião': 'religion',
      'tecnologia': 'technology',
      'conflitos': 'conflicts',
      'data': 'date',
      'causas': 'causes',
      'consequências': 'consequences',
      'fontes': 'sources',
      'controvérsias': 'controversies',
      'aplicações': 'applications',
      'acesso': 'access',
      'desenvolvimento': 'development',
      'riscos': 'risks',
      'inovação': 'innovation',
      'líderes': 'leaders',
      'sistema': 'system',
      'relações': 'relations',
      'políticas': 'policies',
      'facções': 'factions',
      'alianças': 'alliances',
      'intrigas': 'intrigues',
      'figuras': 'figures',
      'movimentos': 'movements',
      'moeda': 'currency',
      'setores': 'sectors',
      'rotas': 'routes',
      'classes': 'classes',
      'impostos': 'taxes',
      'problemas': 'problems',
      'oportunidades': 'opportunities',
      'recursos': 'resources',
      'mercados': 'markets',
      'guildas': 'guilds'
    };
    
    let hasChanges = false;
    const converted = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const englishKey = portugueseToEnglish[key] || key;
      if (englishKey !== key) {
        hasChanges = true;
      }
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        converted[englishKey] = this.convertPortugueseKeys(value);
      } else if (Array.isArray(value)) {
        converted[englishKey] = value.map(item => 
          typeof item === 'object' ? this.convertPortugueseKeys(item) : item
        );
      } else {
        converted[englishKey] = value;
      }
    }
    
    return hasChanges ? converted : null;
  }

  // Métodos de fallback (mantidos do WorldBuilder original)
  createFallbackLocation(result) {
    return {
      name: result?.name || 'Local Gerado',
      type: result?.type || 'local',
      description: result?.description || 'Um local interessante gerado pela IA.',
      climate: result?.climate || 'Temperado',
      population: result?.population || 'Variável',
      culture: result?.culture || 'Diversa',
      government: result?.government || 'Variado',
      economy: result?.economy || 'Mista',
      pointsOfInterest: result?.pointsOfInterest || ['Ponto de Interesse'],
      atmosphere: result?.atmosphere || 'Misteriosa',
      secrets: result?.secrets || 'Segredos ocultos',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackRegion(result) {
    return {
      name: result?.name || 'Região Gerada',
      type: result?.type || 'Montanhoso',
      climate: result?.climate || 'Temperado',
      seasonalVariations: result?.seasonalVariations || 'Estações bem definidas',
      terrain: result?.terrain || 'Montanhas e vales',
      naturalResources: result?.naturalResources || 'Minérios e madeira',
      population: result?.population || '10.000',
      distribution: result?.distribution || 'Distribuída em assentamentos',
      settlements: result?.settlements || 'Cidades e aldeias',
      tradeRoutes: result?.tradeRoutes || 'Rotas comerciais importantes',
      uniqueFeatures: result?.uniqueFeatures || 'Características únicas',
      dangers: result?.dangers || 'Perigos naturais',
      strategicImportance: result?.strategicImportance || 'Importância estratégica',
      conflicts: result?.conflicts || 'Conflitos regionais',
      floraFauna: result?.floraFauna || 'Flora e fauna diversa',
      waterResources: result?.waterResources || 'Rios e lagos',
      connectivity: result?.connectivity || 'Bem conectada',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackLandmark(result) {
    return {
      name: result?.name || 'Marco Importante',
      type: result?.type || 'Natural',
      description: result?.description || 'Um marco significativo no mundo',
      significance: result?.significance || 'Importância histórica ou cultural',
      location: result?.location || 'Localização específica',
      history: result?.history || 'História rica e antiga',
      features: result?.features || 'Características únicas',
      accessibility: result?.accessibility || 'Acesso variado',
      legends: result?.legends || 'Lendas associadas',
      visitors: result?.visitors || 'Visitantes frequentes',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackResource(result) {
    return {
      name: result?.name || 'Recurso Natural',
      type: result?.type || 'Mineral',
      description: result?.description || 'Um recurso valioso do mundo',
      rarity: result?.rarity || 'Raro',
      uses: result?.uses || 'Múltiplos usos',
      location: result?.location || 'Localização específica',
      extraction: result?.extraction || 'Método de extração',
      value: result?.value || 'Alto valor',
      trade: result?.trade || 'Comercializado',
      regulations: result?.regulations || 'Regulamentações',
      impact: result?.impact || 'Impacto ambiental',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackLanguage(result) {
    return {
      name: result?.name || 'Idioma Gerado',
      family: result?.family || 'Indo-Europeu',
      speakers: result?.speakers || 'Falantes nativos da região',
      script: result?.script || 'Sistema de escrita único',
      examples: result?.examples || {
        hello: 'Olá',
        goodbye: 'Adeus',
        water: 'Água'
      },
      dialects: result?.dialects || {
        'Dialeto Principal': 'Caracterizado por pronúncia clara',
        'Dialeto Regional': 'Influenciado por culturas locais'
      },
      culturalInfluence: result?.culturalInfluence || 'Influenciado pela cultura local',
      socialStatus: result?.socialStatus || 'Idioma respeitado na sociedade',
      evolution: result?.evolution || 'Evoluiu ao longo dos séculos',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackPeople(result) {
    return {
      name: result?.name || 'Povo Gerado',
      physicalTraits: result?.physicalTraits || 'Características únicas',
      culture: result?.culture || 'Cultura rica e diversa',
      socialStructure: result?.socialStructure || 'Estrutura social complexa',
      specialAbilities: result?.specialAbilities || 'Habilidades especiais',
      relationships: result?.relationships || 'Relacionamentos complexos',
      history: result?.history || 'História rica e antiga',
      values: result?.values || 'Valores tradicionais',
      territory: result?.territory || 'Território vasto',
      population: result?.population || 'População significativa',
      language: result?.language || 'Idioma único',
      religion: result?.religion || 'Sistema religioso próprio',
      technology: result?.technology || 'Tecnologia avançada',
      economy: result?.economy || 'Economia próspera',
      conflicts: result?.conflicts || 'Conflitos internos',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackEvent(result) {
    return {
      name: result?.name || 'Evento Histórico',
      date: result?.date || 'Data antiga',
      location: result?.location || 'Local histórico',
      characters: result?.characters || 'Personagens importantes',
      description: result?.description || 'Evento significativo na história',
      causes: result?.causes || 'Causas complexas',
      consequences: result?.consequences || 'Consequências duradouras',
      impact: result?.impact || 'Impacto histórico',
      legacy: result?.legacy || 'Legado importante',
      sources: result?.sources || 'Fontes históricas',
      controversies: result?.controversies || 'Controvérsias',
      lessons: result?.lessons || 'Lições aprendidas',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackEra(result) {
    return {
      name: result?.name || 'Era Histórica',
      startYear: result?.startYear || 'Início da era',
      endYear: result?.endYear || 'Fim da era',
      description: result?.description || 'Período histórico significativo',
      characteristics: result?.characteristics || 'Características da era',
      majorEvents: result?.majorEvents || 'Eventos principais',
      keyFigures: result?.keyFigures || 'Figuras importantes',
      culturalChanges: result?.culturalChanges || 'Mudanças culturais',
      technologicalAdvances: result?.technologicalAdvances || 'Avanços tecnológicos',
      socialStructures: result?.socialStructures || 'Estruturas sociais',
      conflicts: result?.conflicts || 'Conflitos da era',
      achievements: result?.achievements || 'Conquistas importantes',
      legacy: result?.legacy || 'Legado da era',
      transition: result?.transition || 'Transição para próxima era',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackMagicSystem(result) {
    return {
      name: result?.name || 'Sistema Mágico',
      origin: result?.origin || 'Origem misteriosa',
      rules: result?.rules || 'Regras complexas',
      types: result?.types || 'Tipos variados',
      cost: result?.cost || 'Custo significativo',
      users: result?.users || 'Usuários selecionados',
      artifacts: result?.artifacts || 'Artefatos poderosos',
      powerPlaces: result?.powerPlaces || 'Locais de poder',
      organizations: result?.organizations || 'Organizações mágicas',
      relationship: result?.relationship || 'Relação com tecnologia',
      mysteries: result?.mysteries || 'Mistérios profundos',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackTradition(result) {
    return {
      name: result?.name || 'Tradição Cultural',
      type: result?.type || 'Tipo de tradição',
      origin: result?.origin || 'Origem histórica',
      practice: result?.practice || 'Como é praticada',
      meaning: result?.meaning || 'Significado cultural',
      participants: result?.participants || 'Quem participa',
      frequency: result?.frequency || 'Quando ocorre',
      symbols: result?.symbols || 'Elementos simbólicos',
      variations: result?.variations || 'Variações regionais',
      importance: result?.importance || 'Importância social',
      evolution: result?.evolution || 'Evolução histórica',
      conflicts: result?.conflicts || 'Conflitos ou controvérsias',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackReligion(result) {
    return {
      name: result?.name || 'Religião',
      type: result?.type || 'Tipo religioso',
      deities: result?.deities || 'Divindades',
      dogmas: result?.dogmas || 'Dogmas sagrados',
      rituals: result?.rituals || 'Rituais importantes',
      hierarchy: result?.hierarchy || 'Hierarquia religiosa',
      sacredPlaces: result?.sacredPlaces || 'Locais sagrados',
      sacredTexts: result?.sacredTexts || 'Textos sagrados',
      festivals: result?.festivals || 'Festivais religiosos',
      relationships: result?.relationships || 'Relações inter-religiosas',
      impact: result?.impact || 'Impacto social',
      secrets: result?.secrets || 'Segredos sagrados',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackTechnology(result) {
    return {
      name: result?.name || 'Tecnologia',
      category: result?.category || 'Categoria tecnológica',
      principle: result?.principle || 'Princípio de funcionamento',
      applications: result?.applications || 'Aplicações práticas',
      limitations: result?.limitations || 'Limitações técnicas',
      impact: result?.impact || 'Impacto na sociedade',
      access: result?.access || 'Controle de acesso',
      cost: result?.cost || 'Custo elevado',
      development: result?.development || 'Potencial de desenvolvimento',
      risks: result?.risks || 'Riscos associados',
      magicRelation: result?.magicRelation || 'Relação com magia',
      innovation: result?.innovation || 'Inovação significativa',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackGovernment(result) {
    return {
      name: result?.name || 'Sistema Governamental',
      type: result?.type || 'Tipo de governo',
      structure: result?.structure || 'Estrutura de poder',
      leaders: result?.leaders || 'Líderes políticos',
      legalSystem: result?.legalSystem || 'Sistema legal',
      externalRelations: result?.externalRelations || 'Relações externas',
      internalConflicts: result?.internalConflicts || 'Conflitos internos',
      policies: result?.policies || 'Políticas principais',
      factions: result?.factions || 'Facções políticas',
      alliances: result?.alliances || 'Alianças e tratados',
      intrigues: result?.intrigues || 'Intrigas políticas',
      figures: result?.figures || 'Figuras importantes',
      movements: result?.movements || 'Movimentos políticos',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackEconomy(result) {
    return {
      name: result?.name || 'Sistema Econômico',
      type: result?.type || 'Tipo de economia',
      currency: result?.currency || 'Sistema monetário',
      sectors: result?.sectors || 'Setores econômicos',
      tradeRoutes: result?.tradeRoutes || 'Rotas comerciais',
      socialClasses: result?.socialClasses || 'Classes sociais',
      taxes: result?.taxes || 'Sistema tributário',
      organizations: result?.organizations || 'Organizações comerciais',
      problems: result?.problems || 'Problemas econômicos',
      opportunities: result?.opportunities || 'Oportunidades',
      resources: result?.resources || 'Recursos principais',
      markets: result?.markets || 'Mercados importantes',
      guilds: result?.guilds || 'Guildas comerciais',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackCharacter(context = {}) {
    const role = context.role || 'protagonist';
    const region = context.region || 'Região Central';
    
    return {
      name: 'Personagem Gerado',
      role: role,
      age: 18,
      gender: 'Não especificado',
      appearance: 'Aparência única e memorável',
      personality: 'Personalidade complexa e interessante',
      background: 'Histórico rico e detalhado',
      motivation: 'Motivação clara e forte',
      goals: 'Objetivos bem definidos',
      fears: 'Medos e fraquezas',
      strengths: 'Forças e habilidades',
      weaknesses: 'Fraquezas e limitações',
      relationships: 'Relacionamentos importantes',
      development: 'Arco de desenvolvimento',
      region: region,
      occupation: 'Ocupação ou função',
      skills: 'Habilidades especiais',
      equipment: 'Equipamentos e itens',
      secrets: 'Segredos e mistérios',
      quotes: 'Frases memoráveis',
      notes: 'Notas adicionais'
    };
  }

  createFallbackLoreItem(type, context = {}) {
    const baseLore = {
      name: `Item de Lore - ${type}`,
      type: type,
      description: 'Descrição detalhada do item de lore',
      origin: 'Origem misteriosa',
      significance: 'Significado importante',
      connections: 'Conexões com outros elementos',
      secrets: 'Segredos ocultos',
      impact: 'Impacto no mundo',
      variations: 'Variações e interpretações',
      sources: 'Fontes de informação',
      notes: 'Notas adicionais'
    };

    // Adiciona campos específicos baseados no tipo
    switch (type) {
      case 'legend':
        return {
          ...baseLore,
          characters: 'Personagens da lenda',
          moral: 'Moral da história',
          locations: 'Locais mencionados'
        };
      case 'artifact':
        return {
          ...baseLore,
          power: 'Poderes especiais',
          history: 'História do artefato',
          location: 'Localização atual'
        };
      case 'ritual':
        return {
          ...baseLore,
          steps: 'Passos do ritual',
          requirements: 'Requisitos para execução',
          effects: 'Efeitos do ritual'
        };
      default:
        return baseLore;
    }
  }

  logJSONDebugInfo(jsonString, error) {
    console.group('🔍 Debug JSON Parsing Error');
    console.log('Erro:', error.message);
    console.log('Posição do erro:', error.message.match(/position (\d+)/)?.[1] || 'desconhecida');
    
    if (error.message.includes('position')) {
      const position = parseInt(error.message.match(/position (\d+)/)?.[1] || '0');
      console.log('Caractere na posição do erro:', jsonString[position]);
      console.log('Contexto ao redor do erro:');
      const start = Math.max(0, position - 50);
      const end = Math.min(jsonString.length, position + 50);
      console.log('...' + jsonString.substring(start, end) + '...');
      console.log(' '.repeat(Math.min(50, position - start)) + '^');
    }
    
    // Verifica problemas comuns
    const issues = [];
    if ((jsonString.match(/"/g) || []).length % 2 !== 0) {
      issues.push('Número ímpar de aspas');
    }
    if (jsonString.includes(',,') || jsonString.includes(', ,')) {
      issues.push('Vírgulas duplas encontradas');
    }
    if (jsonString.includes(',}') || jsonString.includes(',]')) {
      issues.push('Vírgulas trailing encontradas');
    }
    if (jsonString.includes('undefined') || jsonString.includes('null,')) {
      issues.push('Valores undefined/null problemáticos');
    }
    
    if (issues.length > 0) {
      console.log('Problemas identificados:', issues);
    }
    
    console.groupEnd();
  }

  performUltraAggressiveCleaning(jsonString) {
    console.log('🔧 Iniciando limpeza ultra-agressiva...');
    
    let cleaned = jsonString;
    
    // 1. Remove todos os caracteres não-ASCII exceto aspas, chaves, colchetes, vírgulas, dois pontos
    cleaned = cleaned.replace(/[^\x20-\x7E]/g, '');
    
    // 2. Corrige aspas malformadas
    cleaned = cleaned.replace(/[""]/g, '"'); // Aspas tipográficas para aspas normais
    cleaned = cleaned.replace(/['']/g, "'"); // Aspas simples tipográficas
    
    // 3. Remove espaços extras entre propriedades
    cleaned = cleaned.replace(/"\s*:\s*/g, '":');
    cleaned = cleaned.replace(/:\s*"/g, ':"');
    
    // 4. Corrige problemas com vírgulas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1'); // Remove vírgulas trailing
    cleaned = cleaned.replace(/,\s*,/g, ','); // Remove vírgulas duplas
    cleaned = cleaned.replace(/,\s*}/g, '}'); // Remove vírgulas antes de }
    cleaned = cleaned.replace(/,\s*]/g, ']'); // Remove vírgulas antes de ]
    
    // 5. Corrige valores vazios
    cleaned = cleaned.replace(/:\s*,/g, ': null,');
    cleaned = cleaned.replace(/:\s*}/g, ': null}');
    cleaned = cleaned.replace(/:\s*]/g, ': null]');
    
    // 6. Corrige aspas não escapadas em strings
    cleaned = cleaned.replace(/([^\\])"/g, '$1\\"');
    
    // 6.5. Corrige parênteses não escapados em strings (problema específico com pronúncias)
    cleaned = cleaned.replace(/"([^"]*?)\(([^)]*?)"([^"]*?)"/g, '"$1\\($2\\)$3"');
    cleaned = cleaned.replace(/\(([^)]+)\)/g, '\\($1\\)');
    
    // 6.6. Corrige caracteres escapados malformados
    // Remove escapes desnecessários de aspas dentro de strings
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\\\/g, '\\');
    
    // Corrige parênteses escapados malformados
    cleaned = cleaned.replace(/\\\(/g, '(');
    cleaned = cleaned.replace(/\\\)/g, ')');
    
    // Remove escapes de caracteres que não precisam ser escapados
    cleaned = cleaned.replace(/\\([^"\\\/bfnrt])/g, '$1');
    
    // 6.7. Corrige chaves de fechamento mal posicionadas dentro de strings
    // Exemplo: "Focus": "texto }" -> "Focus": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*}\s*"/g, '"$1": "$2"');
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)\s*]\s*"/g, '"$1": "$2"');
    
    // Corrige aspas de fechamento mal posicionadas
    // Exemplo: "Focus": "texto" } -> "Focus": "texto"
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*}/g, '"$1": "$2"');
    cleaned = cleaned.replace(/"([^"]+)":\s*"([^"]*)"\s*]/g, '"$1": "$2"');
    
    // 6.8. Corrige JSON incompleto que termina abruptamente
    // Verifica se o JSON termina com aspas duplas sem chave de fechamento
    if (cleaned.endsWith('"') && !cleaned.endsWith('"}')) {
      cleaned += '}';
      console.log('🔧 Adicionada chave de fechamento para JSON incompleto (ultra-agressivo)');
    }
    
    // Corrige JSON que termina com espaço após a última propriedade
    if (cleaned.endsWith('" ') && !cleaned.endsWith('" }')) {
      cleaned = cleaned.trim() + '}';
      console.log('🔧 Corrigido JSON que terminava com espaço (ultra-agressivo)');
    }
    
    // Corrige JSON que termina abruptamente sem chave de fechamento
    if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
      // Conta chaves abertas e fechadas
      const openBraces = (cleaned.match(/\{/g) || []).length;
      const closeBraces = (cleaned.match(/\}/g) || []).length;
      const openBrackets = (cleaned.match(/\[/g) || []).length;
      const closeBrackets = (cleaned.match(/\]/g) || []).length;
      
      // Adiciona chaves de fechamento necessárias
      const missingBraces = openBraces - closeBraces;
      const missingBrackets = openBrackets - closeBrackets;
      
      if (missingBraces > 0) {
        cleaned += '}'.repeat(missingBraces);
        console.log(`🔧 Adicionadas ${missingBraces} chaves de fechamento para JSON incompleto (ultra-agressivo)`);
      }
      
      if (missingBrackets > 0) {
        cleaned += ']'.repeat(missingBrackets);
        console.log(`🔧 Adicionados ${missingBrackets} colchetes de fechamento para JSON incompleto (ultra-agressivo)`);
      }
    }
    
    // Remove caracteres problemáticos como bullet points (•) e quebras de linha dentro de strings
    cleaned = cleaned.replace(/•/g, '-'); // Substitui bullet points por hífens
    cleaned = cleaned.replace(/\n/g, ' '); // Remove quebras de linha
    cleaned = cleaned.replace(/\r/g, ' '); // Remove retornos de carro
    cleaned = cleaned.replace(/\t/g, ' '); // Remove tabs
    
    // Corrige strings que contêm caracteres problemáticos
    cleaned = cleaned.replace(/"([^"]*?)(\n|\r|\t|•)([^"]*?)"/g, '"$1 $3"');
      
      // 6.9. Corrige JSON aninhado malformado (problema específico com rules e limitations)
      // Procura por padrões como "rules": "{key: "value","key2": "value2}"
      cleaned = cleaned.replace(/"([^"]+)":\s*"\{([^}]+)\}"/g, (match, key, content) => {
        // Escapa as aspas dentro do conteúdo JSON aninhado
        const escapedContent = content.replace(/"/g, '\\"');
        return `"${key}": "${escapedContent}"`;
      });
      
      // Corrige JSON aninhado que não tem aspas nas chaves
      // Exemplo: "rules": "{mana: "value","key2": "value2}" -> "rules": "{\"mana\": \"value\",\"key2\": \"value2\"}"
      cleaned = cleaned.replace(/"([^"]+)":\s*"\{([^}]+)\}"/g, (match, key, content) => {
        // Adiciona aspas nas chaves que não têm
        const fixedContent = content.replace(/([a-zA-Z_][a-zA-Z0-9_]*):\s*"/g, '"$1": "');
        return `"${key}": "{${fixedContent}}"`;
      });
     
     // 7. Remove quebras de linha e tabs dentro de strings
    cleaned = cleaned.replace(/\\n/g, ' ');
    cleaned = cleaned.replace(/\\t/g, ' ');
    cleaned = cleaned.replace(/\\r/g, ' ');
    
    // 8. Corrige arrays vazios
    cleaned = cleaned.replace(/\[\s*\]/g, '[]');
    
    // 9. Corrige objetos vazios
    cleaned = cleaned.replace(/\{\s*\}/g, '{}');
    
    // 10. Remove espaços extras
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // 11. Verifica se ainda tem estrutura JSON válida
    if (!cleaned.startsWith('{') || !cleaned.endsWith('}')) {
      console.log('❌ Estrutura JSON inválida após limpeza ultra-agressiva');
      return null;
    }
    
    // 12. Tenta corrigir problemas específicos baseados no erro
    try {
      // Testa se já está válido
      JSON.parse(cleaned);
      console.log('✅ Limpeza ultra-agressiva bem-sucedida');
      return cleaned;
    } catch (testError) {
      console.log('⚠️ Ainda há problemas, tentando correções específicas...');
      
      // 13. Correções específicas baseadas no tipo de erro
      if (testError.message.includes('Expected \',\' or \'}\'')) {
        // Problema com vírgulas ou chaves
        cleaned = cleaned.replace(/([^,}])\s*}/g, '$1}');
        cleaned = cleaned.replace(/([^,])\s*]/g, '$1]');
      }
      
      if (testError.message.includes('Unexpected token')) {
        // Remove caracteres problemáticos
        cleaned = cleaned.replace(/[^\x20-\x7E]/g, '');
      }
      
      // 14. Última tentativa: reconstrói o JSON manualmente
      try {
        const reconstructed = this.reconstructJSON(cleaned);
        if (reconstructed) {
          console.log('✅ Reconstrução JSON bem-sucedida');
          return JSON.stringify(reconstructed);
        }
      } catch (reconstructError) {
        console.log('❌ Reconstrução JSON falhou:', reconstructError.message);
      }
    }
    
    console.log('❌ Limpeza ultra-agressiva falhou');
    return null;
  }

  reconstructJSON(jsonString) {
    try {
      // Tenta extrair apenas as propriedades válidas
      const propertyMatches = jsonString.match(/"([^"]+)"\s*:\s*([^,}]+)/g);
      if (!propertyMatches) return null;
      
      const properties = {};
      propertyMatches.forEach(match => {
        const [key, value] = match.split(':').map(s => s.trim());
        if (key && value) {
          const cleanKey = key.replace(/"/g, '');
          let cleanValue = value.replace(/"/g, '').replace(/,/g, '');
          
          // Tenta converter para tipos apropriados
          if (cleanValue === 'true' || cleanValue === 'false') {
            cleanValue = cleanValue === 'true';
          } else if (!isNaN(cleanValue)) {
            cleanValue = Number(cleanValue);
          } else if (cleanValue === 'null') {
            cleanValue = null;
          }
          
          properties[cleanKey] = cleanValue;
        }
      });
      
      // Se não conseguiu extrair propriedades, tenta uma abordagem mais simples
      if (Object.keys(properties).length === 0) {
        // Tenta extrair pelo menos o nome se estiver presente
        const nameMatch = jsonString.match(/"name"\s*:\s*"([^"]+)"/);
        if (nameMatch) {
          properties.name = nameMatch[1];
        }
        
        // Se ainda não tem propriedades, cria um objeto básico
        if (Object.keys(properties).length === 0) {
          properties.name = 'Item Gerado';
          properties.description = 'Item gerado automaticamente';
        }
      }
      
      return properties;
    } catch (error) {
      console.log('Erro na reconstrução:', error.message);
      // Retorna um objeto básico como fallback
      return {
        name: 'Item Gerado',
        description: 'Item gerado automaticamente devido a erro de parsing'
      };
    }
  }

  extractContentFromAPIResponse(response) {
    try {
      // Tenta fazer parse da resposta como JSON
      const parsed = JSON.parse(response);
      
      // Verifica se é uma resposta de API com choices
      if (parsed.choices && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
        const firstChoice = parsed.choices[0];
        if (firstChoice.message && firstChoice.message.content) {
          console.log('📦 Extraindo conteúdo de resposta de API');
          console.log('📄 Conteúdo extraído:', firstChoice.message.content.substring(0, 100) + '...');
          return firstChoice.message.content;
        }
      }
      
      // Se não for uma resposta de API, retorna a resposta original
      console.log('📄 Usando resposta original (não é resposta de API)');
      return response;
    } catch (error) {
      // Se não conseguir fazer parse como JSON, retorna a resposta original
      console.log('📄 Usando resposta original (erro no parse JSON)');
      return response;
    }
  }

  // Métodos para interdependências
  async analyzeInterdependencies() {
    const promptName = 'analysis_interdependencyAnalysis';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'interdependencies');
  }

  async validateRelationships() {
    const promptName = 'interdependencies_relationshipValidation';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'relationships');
  }

  async generateIntelligentSuggestions(elementType, elementData, context = {}) {
    const promptName = 'interdependencies_intelligentSuggestions';
    const worldContext = this.buildWorldContext();
    const fullContext = { ...worldContext, elementType, elementData, ...context };
    const result = await this.promptManager.executePrompt(promptName, fullContext, this.aiService);
    return await this.cleanAIResponse(result, 'suggestions');
  }

  async resolveConflicts() {
    const promptName = 'interdependencies_conflictResolution';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'conflicts');
  }
}

// Função factory para criar instância
export const createUnifiedPromptIntegration = (worldData, aiService) => {
  return new UnifiedPromptIntegration(worldData, aiService);
};

// Exporta também como default
export default UnifiedPromptIntegration;
