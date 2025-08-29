// Sistema Unificado de Integração de Prompts
// Substitui todos os prompts hardcoded em todos os componentes

import { BASE_PROMPTS, PromptUtils } from './promptBank';
import { PromptManager, DynamicPromptGenerator, PromptTemplate } from './promptTools';
import { createAIChainOfThought } from './aiChainOfThought';
import { SchemaUtils } from '../data/worldBuilderSchemas';

export class UnifiedPromptIntegration {
  constructor(worldData, aiService, projectData = {}) {
    this.worldData = worldData;
    this.aiService = aiService;
    this.projectData = projectData;
    this.promptManager = new PromptManager();
    this.dynamicGenerator = new DynamicPromptGenerator(worldData);
    this.chainOfThought = createAIChainOfThought(aiService, worldData, projectData);
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

  // Método para processar conteúdo usando cadeia de pensamento
  async processContentWithChainOfThought(response, contentType, context = {}) {
    return await this.chainOfThought.processContent(response, contentType, context);
  }

  // Método de compatibilidade (mantém interface antiga)
  async cleanAIResponse(response, fieldType = 'magicSystem') {
    return await this.processContentWithChainOfThought(response, fieldType);
  }

  // Método síncrono para compatibilidade (usa versão assíncrona)
  cleanAIResponseSync(response, fieldType = 'magicSystem') {
    // Como o sistema de cadeia de pensamento é assíncrono, 
    // retornamos uma Promise que será resolvida
    return this.processContentWithChainOfThought(response, fieldType);
  }

  



  // Métodos de fallback usando esquemas centralizados
  createFallbackLocation(result) {
    return this.createFallbackFromSchema('location', result);
  }

  createFallbackRegion(result) {
    return this.createFallbackFromSchema('region', result);
  }

  // Método genérico para criar fallbacks usando esquemas
  createFallbackFromSchema(itemType, result) {
    const emptyItem = SchemaUtils.createEmptyItem(itemType);
    if (!emptyItem) return this.createBasicFallback(itemType, result);
    
    // Preenche com dados do resultado ou valores padrão
    const filledItem = { ...emptyItem };
    
    // Mapeia campos comuns
    const commonFields = ['name', 'type', 'description'];
    commonFields.forEach(field => {
      if (result?.[field]) {
        filledItem[field] = result[field];
      }
    });
    
    // Adiciona campos específicos do resultado
    if (result) {
      Object.keys(result).forEach(key => {
        if (key in emptyItem) {
          filledItem[key] = result[key];
        }
      });
    }
    
    return filledItem;
  }

  // Método de fallback básico quando o esquema não é encontrado
  createBasicFallback(itemType, result) {
    return {
      name: result?.name || `${itemType} Gerado`,
      description: result?.description || `Um ${itemType} interessante gerado pela IA.`,
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }

  createFallbackLandmark(result) {
    return this.createFallbackFromSchema('landmark', result);
  }

  createFallbackResource(result) {
    return this.createFallbackFromSchema('resource', result);
  }

  createFallbackLanguage(result) {
    return this.createFallbackFromSchema('language', result);
  }

  createFallbackPeople(result) {
    return this.createFallbackFromSchema('people', result);
  }

  createFallbackEvent(result) {
    return this.createFallbackFromSchema('event', result);
  }

  createFallbackEra(result) {
    return this.createFallbackFromSchema('era', result);
  }

  createFallbackMagicSystem(result) {
    return this.createFallbackFromSchema('magicSystem', result);
  }

  createFallbackTradition(result) {
    return this.createFallbackFromSchema('tradition', result);
  }

  createFallbackReligion(result) {
    return this.createFallbackFromSchema('religion', result);
  }

  createFallbackTechnology(result) {
    return this.createFallbackFromSchema('technology', result);
  }

  createFallbackGovernment(result) {
    return this.createFallbackFromSchema('government', result);
  }

  createFallbackEconomy(result) {
    return this.createFallbackFromSchema('economy', result);
  }

  createFallbackCharacter(context = {}) {
    return this.createFallbackFromSchema('character', context);
  }

  createFallbackLoreItem(type, context = {}) {
    // Cria o item base usando o esquema
    const baseItem = this.createFallbackFromSchema('loreItem', context);
    
    // Adiciona o tipo específico
    baseItem.type = type;
    baseItem.name = `Item de Lore - ${type}`;
    
    // Adiciona campos específicos baseados no tipo
    switch (type) {
      case 'legend':
        baseItem.characters = 'Personagens da lenda';
        baseItem.moral = 'Moral da história';
        baseItem.locations = 'Locais mencionados';
        break;
      case 'artifact':
        baseItem.power = 'Poderes especiais';
        baseItem.history = 'História do artefato';
        baseItem.location = 'Localização atual';
        break;
      case 'ritual':
        baseItem.steps = 'Passos do ritual';
        baseItem.requirements = 'Requisitos para execução';
        baseItem.effects = 'Efeitos do ritual';
        break;
      default:
        // Mantém os valores padrão do esquema
        break;
    }
    
    return baseItem;
  }



  // Métodos para interdependências
  async analyzeInterdependencies() {
    const promptName = 'analysis_interdependencyAnalysis';
    const context = this.buildWorldContext();
    const result = await this.promptManager.executePrompt(promptName, context, this.aiService);
    return await this.cleanAIResponse(result, 'interdependencies');
  }

  // Método para obter estatísticas da cadeia de pensamento
  getChainOfThoughtStatistics() {
    return this.chainOfThought.getChainStatistics();
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
export const createUnifiedPromptIntegration = (worldData, aiService, projectData = {}) => {
  return new UnifiedPromptIntegration(worldData, aiService, projectData);
};

// Exporta também como default
export default UnifiedPromptIntegration;
