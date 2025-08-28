// Ferramentas Avançadas para Gerenciamento de Prompts
// Sistema de templates, validação e otimização de prompts

import { BASE_PROMPTS, PromptUtils } from './promptBank.js';

// Configurações de templates
const TEMPLATE_CONFIG = {
  maxTokens: 4000,
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0.1,
  presencePenalty: 0.1
};

// Sistema de templates de prompts
export class PromptTemplate {
  constructor(name, basePrompt, variables = {}) {
    this.name = name;
    this.basePrompt = basePrompt;
    this.variables = variables;
    this.metadata = {
      category: '',
      difficulty: 'medium',
      estimatedTokens: 0,
      tags: []
    };
  }

  // Renderiza o template com variáveis
  render(context = {}) {
    let prompt = this.basePrompt;
    
    // Substitui variáveis do template
    Object.entries(this.variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    // Substitui variáveis do contexto
    Object.entries(context).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    return prompt;
  }

  // Adiciona metadados ao template
  withMetadata(metadata) {
    this.metadata = { ...this.metadata, ...metadata };
    return this;
  }

  // Valida o template
  validate() {
    const issues = [];
    
    if (!this.name) issues.push('Nome do template é obrigatório');
    if (!this.basePrompt) issues.push('Prompt base é obrigatório');
    if (this.basePrompt.length > TEMPLATE_CONFIG.maxTokens * 4) {
      issues.push('Prompt muito longo');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// Gerenciador de prompts
export class PromptManager {
  constructor() {
    this.templates = new Map();
    this.history = [];
    this.analytics = {
      totalPrompts: 0,
      successfulPrompts: 0,
      failedPrompts: 0,
      averageResponseTime: 0
    };
  }

  // Registra um template
  registerTemplate(template) {
    const validation = template.validate();
    if (!validation.isValid) {
      throw new Error(`Template inválido: ${validation.issues.join(', ')}`);
    }
    
    this.templates.set(template.name, template);
    return this;
  }

  // Obtém um template
  getTemplate(name) {
    return this.templates.get(name);
  }

  // Lista todos os templates
  listTemplates(category = null) {
    const templates = Array.from(this.templates.values());
    if (category) {
      return templates.filter(t => t.metadata.category === category);
    }
    return templates;
  }

  // Executa um prompt
  async executePrompt(templateName, context = {}, aiService) {
    const template = this.getTemplate(templateName);
    if (!template) {
      throw new Error(`Template não encontrado: ${templateName}`);
    }

    const startTime = Date.now();
    const prompt = template.render(context);
    
    try {
      const result = await aiService.generateText(prompt, {
        temperature: TEMPLATE_CONFIG.temperature,
        maxTokens: TEMPLATE_CONFIG.maxTokens,
        topP: TEMPLATE_CONFIG.topP,
        frequencyPenalty: TEMPLATE_CONFIG.frequencyPenalty,
        presencePenalty: TEMPLATE_CONFIG.presencePenalty
      });

      const responseTime = Date.now() - startTime;
      
      // Registra na história
      this.history.push({
        template: templateName,
        context,
        prompt,
        result,
        responseTime,
        timestamp: new Date(),
        success: true
      });

      // Atualiza analytics
      this.analytics.totalPrompts++;
      this.analytics.successfulPrompts++;
      this.analytics.averageResponseTime = 
        (this.analytics.averageResponseTime * (this.analytics.totalPrompts - 1) + responseTime) / 
        this.analytics.totalPrompts;

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Registra erro na história
      this.history.push({
        template: templateName,
        context,
        prompt,
        error: error.message,
        responseTime,
        timestamp: new Date(),
        success: false
      });

      // Atualiza analytics
      this.analytics.totalPrompts++;
      this.analytics.failedPrompts++;

      throw error;
    }
  }

  // Obtém estatísticas
  getAnalytics() {
    return {
      ...this.analytics,
      successRate: this.analytics.totalPrompts > 0 
        ? (this.analytics.successfulPrompts / this.analytics.totalPrompts * 100).toFixed(2)
        : 0
    };
  }

  // Obtém histórico
  getHistory(limit = 50) {
    return this.history.slice(-limit);
  }
}

// Validador de prompts
export class PromptValidator {
  static validatePrompt(prompt) {
    const issues = [];
    
    // Verifica se o prompt não está vazio
    if (!prompt || prompt.trim().length === 0) {
      issues.push('Prompt não pode estar vazio');
    }
    
    // Verifica se o prompt não é muito longo
    if (prompt.length > TEMPLATE_CONFIG.maxTokens * 4) {
      issues.push('Prompt muito longo');
    }
    
    // Verifica se contém instruções de formato JSON
    if (!prompt.includes('JSON') && !prompt.includes('json')) {
      issues.push('Prompt deve especificar formato de resposta');
    }
    
    // Verifica se contém regras importantes
    if (!prompt.includes('REGRAS') && !prompt.includes('regras')) {
      issues.push('Prompt deve incluir regras de formatação');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions: this.generateSuggestions(issues)
    };
  }

  static generateSuggestions(issues) {
    const suggestions = [];
    
    if (issues.includes('Prompt deve especificar formato de resposta')) {
      suggestions.push('Adicione instruções claras sobre o formato de resposta esperado');
    }
    
    if (issues.includes('Prompt deve incluir regras de formatação')) {
      suggestions.push('Inclua regras específicas sobre como a IA deve responder');
    }
    
    if (issues.includes('Prompt muito longo')) {
      suggestions.push('Considere dividir o prompt em partes menores ou ser mais conciso');
    }
    
    return suggestions;
  }
}

// Otimizador de prompts
export class PromptOptimizer {
  static optimizePrompt(prompt, targetLength = 2000) {
    let optimized = prompt;
    
    // Remove linhas em branco desnecessárias
    optimized = optimized.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove espaços extras
    optimized = optimized.replace(/\s+/g, ' ');
    
    // Se ainda estiver muito longo, tenta encurtar
    if (optimized.length > targetLength) {
      optimized = this.shortenPrompt(optimized, targetLength);
    }
    
    return optimized;
  }

  static shortenPrompt(prompt, targetLength) {
    const lines = prompt.split('\n');
    const importantLines = [];
    const optionalLines = [];
    
    // Separa linhas importantes das opcionais
    lines.forEach(line => {
      if (line.includes('REGRAS') || line.includes('Formato') || line.includes('JSON')) {
        importantLines.push(line);
      } else {
        optionalLines.push(line);
      }
    });
    
    // Mantém linhas importantes e adiciona opcionais até o limite
    let result = importantLines.join('\n');
    
    for (const line of optionalLines) {
      if ((result + '\n' + line).length <= targetLength) {
        result += '\n' + line;
      } else {
        break;
      }
    }
    
    return result;
  }

  static enhancePrompt(prompt, enhancements = {}) {
    let enhanced = prompt;
    
    // Adiciona instruções de contexto se não existirem
    if (!enhanced.includes('CONTEXTO') && enhancements.context) {
      enhanced = `CONTEXTO DO MUNDO:\n${enhancements.context}\n\n${enhanced}`;
    }
    
    // Adiciona instruções de estilo se não existirem
    if (!enhanced.includes('ESTILO') && enhancements.style) {
      enhanced = `${enhanced}\n\nESTILO: ${enhancements.style}`;
    }
    
    // Adiciona exemplos se fornecidos
    if (enhancements.examples && !enhanced.includes('EXEMPLO')) {
      enhanced = `${enhanced}\n\nEXEMPLOS:\n${enhancements.examples}`;
    }
    
    return enhanced;
  }
}

// Gerador de prompts dinâmicos
export class DynamicPromptGenerator {
  constructor(worldData) {
    this.worldData = worldData;
    this.contextCache = new Map();
  }

  // Gera contexto baseado nos dados do mundo
  generateContext() {
    const cacheKey = JSON.stringify(this.worldData);
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }

    const context = {
      worldName: this.worldData?.name || 'Mundo da Light Novel',
      genre: this.worldData?.genre || 'fantasy',
      techLevel: this.worldData?.techLevel || 'medieval',
      description: this.worldData?.description || 'Um mundo de fantasia',
      existingElements: [],
      characters: [],
      locations: this.worldData?.locations || [],
      peoples: this.worldData?.peoples || [],
      religions: this.worldData?.religions || [],
      magicSystems: this.worldData?.magicSystems || [],
      events: this.worldData?.events || []
    };

    // Adiciona elementos existentes para referência
    if (context.locations.length > 0) {
      context.existingElements.push(...context.locations.slice(0, 3));
    }
    if (context.peoples.length > 0) {
      context.existingElements.push(...context.peoples.slice(0, 2));
    }
    if (context.religions.length > 0) {
      context.existingElements.push(...context.religions.slice(0, 2));
    }

    this.contextCache.set(cacheKey, context);
    return context;
  }

  // Gera prompt para um tipo específico de elemento
  generateElementPrompt(elementType, elementSubType = null) {
    const context = this.generateContext();
    const basePrompt = BASE_PROMPTS[elementType];
    
    if (!basePrompt) {
      throw new Error(`Tipo de elemento não suportado: ${elementType}`);
    }

    let prompt;
    if (elementSubType && basePrompt[elementSubType]) {
      prompt = basePrompt[elementSubType];
    } else if (typeof basePrompt === 'string') {
      prompt = basePrompt;
    } else {
      // Pega o primeiro prompt disponível
      const firstKey = Object.keys(basePrompt)[0];
      prompt = basePrompt[firstKey];
    }

    // Aplica contexto
    return PromptUtils.combineWithContext(prompt, context);
  }

  // Gera prompt inteligente baseado na análise do mundo
  generateSmartPrompt(elementType) {
    const context = this.generateContext();
    const analysis = this.analyzeWorldState();
    
    let smartPrompt = `Crie um ${elementType} ÚNICO e ORIGINAL para o mundo "${context.worldName}".

${BASE_PROMPTS.rules.jsonFormat}

ANÁLISE DO MUNDO ATUAL:
- Gênero: ${context.genre}
- Nível Tecnológico: ${context.techLevel}
- Elementos Existentes: ${context.existingElements.length}
- Locais: ${context.locations.length}
- Povos: ${context.peoples.length}
- Religiões: ${context.religions.length}

REQUISITOS ESPECÍFICOS:
- Deve ser coerente com o ${context.genre} e nível ${context.techLevel}
- Deve complementar os elementos existentes sem repetir
- Deve ser único e memorável
- Deve ter potencial narrativo interessante

${BASE_PROMPTS.rules.consistency}

`;

    // Adiciona instruções específicas baseadas na análise
    if (analysis.needsMoreLocations) {
      smartPrompt += '\n- Foque em criar um local que preencha lacunas geográficas\n';
    }
    if (analysis.needsMoreCultures) {
      smartPrompt += '\n- Foque em criar elementos culturais que enriqueçam a diversidade\n';
    }
    if (analysis.needsMoreSystems) {
      smartPrompt += '\n- Foque em criar sistemas que afetem múltiplos aspectos do mundo\n';
    }

    return smartPrompt;
  }

  // Analisa o estado atual do mundo
  analyzeWorldState() {
    const context = this.generateContext();
    
    return {
      needsMoreLocations: context.locations.length < 5,
      needsMoreCultures: context.peoples.length < 3,
      needsMoreSystems: context.magicSystems.length < 2,
      isBalanced: context.locations.length >= 3 && context.peoples.length >= 2,
      hasGoodDiversity: context.religions.length >= 2 && context.magicSystems.length >= 1
    };
  }
}

// Exporta as classes principais
export default {
  PromptTemplate,
  PromptManager,
  PromptValidator,
  PromptOptimizer,
  DynamicPromptGenerator
};
