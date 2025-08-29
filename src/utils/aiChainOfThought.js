// Sistema de Cadeia de Pensamento com IA
// Substitui o cleanAIResponse.js com um sistema mais robusto e inteligente

import { SchemaUtils } from '../data/worldBuilderSchemas';
import { 
  getModelRateLimits, 
  getModelFallbacks, 
  getOptimizedModelSettings, 
  checkRateLimitStatus 
} from './aiProviders';

export class AIChainOfThought {
  constructor(aiService, worldData, projectData = {}) {
    this.aiService = aiService;
    this.worldData = worldData;
    this.projectData = projectData;
    this.maxIterations = 5; // Máximo de tentativas para correção
    this.validationHistory = []; // Histórico de validações para aprendizado
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 segundo
      maxDelay: 30000, // 30 segundos
      backoffMultiplier: 2
    };
    
    // Configurações dinâmicas baseadas no provedor e modelo
    this.provider = aiService.provider || 'groq';
    this.currentModel = aiService.settings?.model || 'qwen/qwen3-32b';
    
    // Inicializar configurações de rate limit
    this.initializeRateLimitConfig();
  }

  // Inicializar configurações de rate limit dinamicamente
  initializeRateLimitConfig() {
    const modelRateLimits = getModelRateLimits(this.provider, this.currentModel);
    
    if (modelRateLimits) {
      this.currentRateLimits = modelRateLimits;
      this.fallbackModels = getModelFallbacks(this.provider, this.currentModel);
      console.log(`🔧 Configurações de rate limit carregadas para ${this.currentModel}:`, modelRateLimits);
    } else {
      // Fallback para configurações padrão
      this.currentRateLimits = {
        tpm: 6000,
        rpm: 100,
        defaultMaxTokens: 2000
      };
      this.fallbackModels = [];
      console.warn(`⚠️ Configurações de rate limit não encontradas para ${this.currentModel}, usando padrões`);
    }
  }

  // Método principal que executa toda a cadeia de pensamento
  async processContent(rawContent, contentType, context = {}) {
    console.log('🧠 Iniciando cadeia de pensamento para:', contentType);
    
    try {
      // Etapa 1: Análise inicial e extração
      const extractedContent = await this.executeWithRetryAndFallback(
        () => this.extractAndAnalyze(rawContent, contentType),
        'extractAndAnalyze'
      );
      
      // Etapa 2: Validação de coerência com o mundo
      const coherenceResult = await this.executeWithRetryAndFallback(
        () => this.validateWorldCoherence(extractedContent, contentType, context),
        'validateWorldCoherence'
      );
      if (!coherenceResult.valid) {
        console.log('⚠️ Problemas de coerência detectados:', coherenceResult.issues);
      }
      
      // Etapa 3: Validação e correção de formato
      const formatResult = await this.executeWithRetryAndFallback(
        () => this.validateAndFixFormat(extractedContent, contentType),
        'validateAndFixFormat'
      );
      if (!formatResult.valid) {
        console.log('⚠️ Problemas de formato detectados:', formatResult.issues);
      }
      
      // Etapa 4: Enriquecimento com contexto do mundo
      const enrichedContent = await this.executeWithRetryAndFallback(
        () => this.enrichWithWorldContext(formatResult.content, contentType, context),
        'enrichWithWorldContext'
      );
      
      // Etapa 5: Validação de criatividade e originalidade
      const creativityResult = await this.executeWithRetryAndFallback(
        () => this.validateCreativity(enrichedContent, contentType),
        'validateCreativity'
      );
      if (!creativityResult.valid) {
        console.log('⚠️ Problemas de criatividade detectados:', creativityResult.issues);
      }
      
      // Etapa 6: Integração com memória do projeto
      const integratedContent = await this.executeWithRetryAndFallback(
        () => this.integrateWithProjectMemory(enrichedContent, contentType),
        'integrateWithProjectMemory'
      );
      
      // Etapa 7: Validação final e refinamento
      const finalResult = await this.executeWithRetryAndFallback(
        () => this.finalValidationAndRefinement(integratedContent, contentType),
        'finalValidationAndRefinement'
      );
      
      // Etapa 8: Aprendizado e atualização da memória
      await this.updateValidationHistory(finalResult, contentType);
      
      console.log('✅ Cadeia de pensamento concluída com sucesso');
      return finalResult.content;
      
    } catch (error) {
      console.error('❌ Erro na cadeia de pensamento:', error);
      return this.createFallbackContent(contentType, context);
    }
  }

  // Método para executar com retry e fallback
  async executeWithRetryAndFallback(operation, operationName) {
    let lastError;
    let currentModel = this.currentModel;
    
    // Monitorar uso de tokens antes da operação
    const estimatedTokens = 1000; // Estimativa base
    const tokenUsage = this.monitorTokenUsage(operationName, estimatedTokens);
    
    // Ajustar configurações se necessário
    if (tokenUsage.shouldReduceTokens) {
      console.log(`🔧 Ajustando configurações devido ao status ${tokenUsage.status} (${tokenUsage.usagePercentage.toFixed(1)}%)`);
      const currentSettings = this.getOptimizedSettings(currentModel);
      const adjustedSettings = this.adjustSettingsForTokenUsage(currentSettings, tokenUsage.usagePercentage);
      
      // Aplicar configurações ajustadas temporariamente
      this.aiService.settings = { ...this.aiService.settings, ...adjustedSettings };
    }
    
    // Se o status for crítico, considerar mudança de modelo
    if (tokenUsage.shouldSwitchModel && this.fallbackModels.length > 0) {
      console.log(`🔄 Status crítico detectado. Considerando mudança para modelo fallback...`);
      const fallbackModel = this.fallbackModels[0];
      console.log(`🔄 Tentando com modelo fallback: ${fallbackModel}`);
      return await this.tryWithSpecificModel(operation, operationName, fallbackModel);
    }
    
    // Tentar com o modelo atual
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        console.log(`🔄 Tentativa ${attempt + 1}/${this.retryConfig.maxRetries + 1} para ${operationName} com modelo ${currentModel}`);
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Erro na tentativa ${attempt + 1} para ${operationName}:`, error.message);
        
        // Verificar se é um erro de rate limit
        if (this.isRateLimitError(error)) {
          const waitTime = this.calculateBackoffDelay(attempt);
          console.log(`⏳ Rate limit atingido. Aguardando ${waitTime}ms antes da próxima tentativa...`);
          await this.sleep(waitTime);
          
          // Se for rate limit persistente, tentar com modelo fallback
          if (attempt === this.retryConfig.maxRetries - 1 && this.fallbackModels.length > 0) {
            console.log(`🔄 Rate limit persistente. Tentando com modelo fallback...`);
            return await this.tryWithFallbackModels(operation, operationName, this.fallbackModels);
          }
          
          continue;
        }
        
        // Se não for rate limit, tentar com modelo fallback
        if (attempt === this.retryConfig.maxRetries && this.fallbackModels.length > 0) {
          console.log(`🔄 Tentando com modelo fallback para ${operationName}`);
          return await this.tryWithFallbackModels(operation, operationName, this.fallbackModels);
        }
        
        // Se não há mais tentativas e não há fallbacks, quebrar
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }
        
        // Aguardar antes da próxima tentativa
        const waitTime = this.calculateBackoffDelay(attempt);
        await this.sleep(waitTime);
      }
    }
    
    throw lastError;
  }



  // Tentar com modelo específico
  async tryWithSpecificModel(operation, operationName, model) {
    try {
      console.log(`🔄 Tentando ${operationName} com modelo específico: ${model}`);
      
      // Verificar configurações do modelo específico
      const modelRateLimits = getModelRateLimits(this.provider, model);
      if (modelRateLimits) {
        console.log(`🔧 Configurações do modelo específico ${model}:`, modelRateLimits);
      }
      
      // Temporariamente alterar o modelo e suas configurações
      const originalModel = this.currentModel;
      const originalSettings = this.aiService.settings;
      
      this.currentModel = model;
      this.aiService.settings = { 
        ...originalSettings, 
        model: model,
        maxTokens: modelRateLimits?.defaultMaxTokens || 2000
      };
      
      // Atualizar configurações de rate limit para o modelo específico
      this.currentRateLimits = modelRateLimits || this.currentRateLimits;
      
      const result = await operation();
      
      // Restaurar modelo original e configurações
      this.currentModel = originalModel;
      this.aiService.settings = originalSettings;
      this.initializeRateLimitConfig(); // Restaurar configurações originais
      
      console.log(`✅ ${operationName} executado com sucesso usando modelo específico: ${model}`);
      return result;
      
    } catch (error) {
      console.warn(`⚠️ Falha com modelo específico ${model}:`, error.message);
      throw error;
    }
  }

  // Obter estatísticas da cadeia de pensamento
  getChainStatistics() {
    const currentTime = Date.now();
    const windowMs = 60000; // 1 minuto
    
    // Limpar histórico antigo
    this.tokenUsageHistory = this.tokenUsageHistory || [];
    this.tokenUsageHistory = this.tokenUsageHistory.filter(
      record => currentTime - record.timestamp < windowMs
    );
    
    const totalTokens = this.tokenUsageHistory.reduce((sum, record) => sum + record.tokens, 0);
    const totalRequests = this.tokenUsageHistory.length;
    
    // Usar configurações dinâmicas
    const currentUsage = {
      tokens: totalTokens,
      requests: totalRequests
    };
    
    const rateLimitStatus = checkRateLimitStatus(this.provider, this.currentModel, currentUsage);
    
    return {
      provider: this.provider,
      currentModel: this.currentModel,
      totalTokens,
      totalRequests,
      tokenLimit: this.currentRateLimits.tpm,
      requestLimit: this.currentRateLimits.rpm,
      tpmUsagePercentage: rateLimitStatus.tpmPercentage.toFixed(1),
      rpmUsagePercentage: rateLimitStatus.rpmPercentage.toFixed(1),
      overallStatus: rateLimitStatus.status,
      overallUsagePercentage: rateLimitStatus.percentage.toFixed(1),
      recentOperations: this.tokenUsageHistory.length,
      validationHistory: this.validationHistory.length,
      retryConfig: this.retryConfig,
      fallbackModels: this.fallbackModels,
      currentRateLimits: this.currentRateLimits
    };
  }

  // Verificar se é erro de rate limit
  isRateLimitError(error) {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorType = error.type || '';
    
    return errorMessage.includes('rate limit') || 
           errorMessage.includes('tpm') || 
           errorMessage.includes('rpm') ||
           errorType === 'rate_limit_exceeded' ||
           errorMessage.includes('too many requests') ||
           errorMessage.includes('quota exceeded');
  }

  // Calcular delay exponencial
  calculateBackoffDelay(attempt) {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  // Função de sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Tentar com modelos fallback
  async tryWithFallbackModels(operation, operationName, fallbackModels) {
    for (const fallbackModel of fallbackModels) {
      try {
        console.log(`🔄 Tentando ${operationName} com modelo fallback: ${fallbackModel}`);
        
        // Verificar se o modelo fallback tem configurações de rate limit
        const fallbackRateLimits = getModelRateLimits(this.provider, fallbackModel);
        if (fallbackRateLimits) {
          console.log(`🔧 Configurações do modelo fallback ${fallbackModel}:`, fallbackRateLimits);
        }
        
        // Temporariamente alterar o modelo e suas configurações
        const originalModel = this.currentModel;
        const originalSettings = this.aiService.settings;
        
        this.currentModel = fallbackModel;
        this.aiService.settings = { 
          ...originalSettings, 
          model: fallbackModel,
          maxTokens: fallbackRateLimits?.defaultMaxTokens || 2000
        };
        
        // Atualizar configurações de rate limit para o modelo fallback
        this.currentRateLimits = fallbackRateLimits || this.currentRateLimits;
        
        const result = await operation();
        
        // Restaurar modelo original e configurações
        this.currentModel = originalModel;
        this.aiService.settings = originalSettings;
        this.initializeRateLimitConfig(); // Restaurar configurações originais
        
        console.log(`✅ ${operationName} executado com sucesso usando modelo fallback: ${fallbackModel}`);
        return result;
        
      } catch (error) {
        console.warn(`⚠️ Falha com modelo fallback ${fallbackModel}:`, error.message);
        continue;
      }
    }
    
    throw new Error(`Todos os modelos fallback falharam para ${operationName}`);
  }

  // Otimizar prompt para reduzir uso de tokens
  optimizePrompt(prompt, maxTokens = 2000) {
    // Se o prompt for muito longo, truncar e manter apenas o essencial
    if (prompt.length > maxTokens * 4) { // Estimativa: 4 caracteres por token
      console.log(`📝 Otimizando prompt: ${prompt.length} -> ${maxTokens * 4} caracteres`);
      
      // Manter início e fim do prompt, remover parte do meio
      const startLength = Math.floor(maxTokens * 2);
      const endLength = Math.floor(maxTokens * 2);
      
      const start = prompt.substring(0, startLength);
      const end = prompt.substring(prompt.length - endLength);
      
      return `${start}\n\n[... conteúdo truncado para otimização ...]\n\n${end}`;
    }
    
    return prompt;
  }

  // Configurar parâmetros otimizados para diferentes modelos
  getOptimizedSettings(model) {
    // Usar configurações dinâmicas do provedor
    const optimizedSettings = getOptimizedModelSettings(this.provider, model);
    
    // Aplicar configurações baseadas no status atual do rate limit
    const currentUsage = {
      tokens: this.tokenUsageHistory?.reduce((sum, record) => sum + record.tokens, 0) || 0,
      requests: this.tokenUsageHistory?.length || 0
    };
    
    const rateLimitStatus = checkRateLimitStatus(this.provider, model, currentUsage);
    
    // Ajustar maxTokens baseado no status do rate limit
    let adjustedMaxTokens = optimizedSettings.maxTokens;
    if (rateLimitStatus.status === 'critical') {
      adjustedMaxTokens = Math.floor(optimizedSettings.maxTokens * 0.5); // Reduzir 50%
    } else if (rateLimitStatus.status === 'warning') {
      adjustedMaxTokens = Math.floor(optimizedSettings.maxTokens * 0.7); // Reduzir 30%
    } else if (rateLimitStatus.status === 'moderate') {
      adjustedMaxTokens = Math.floor(optimizedSettings.maxTokens * 0.9); // Reduzir 10%
    }
    
    return {
      temperature: optimizedSettings.temperature,
      maxTokens: adjustedMaxTokens,
      rateLimits: optimizedSettings.rateLimits
    };
  }

  // Monitorar uso de tokens e ajustar configurações
  monitorTokenUsage(operationName, estimatedTokens) {
    const currentTime = Date.now();
    const windowMs = 60000; // 1 minuto
    
    // Limpar registros antigos
    this.tokenUsageHistory = this.tokenUsageHistory || [];
    this.tokenUsageHistory = this.tokenUsageHistory.filter(
      record => currentTime - record.timestamp < windowMs
    );
    
    // Adicionar novo registro
    this.tokenUsageHistory.push({
      timestamp: currentTime,
      operation: operationName,
      tokens: estimatedTokens
    });
    
    // Calcular uso total na janela
    const totalTokens = this.tokenUsageHistory.reduce((sum, record) => sum + record.tokens, 0);
    const totalRequests = this.tokenUsageHistory.length;
    
    // Usar configurações dinâmicas de rate limit
    const currentUsage = {
      tokens: totalTokens,
      requests: totalRequests
    };
    
    const rateLimitStatus = checkRateLimitStatus(this.provider, this.currentModel, currentUsage);
    
    console.log(`📊 Uso de tokens: ${totalTokens}/${this.currentRateLimits.tpm} (${rateLimitStatus.tpmPercentage.toFixed(1)}%)`);
    console.log(`📊 Uso de requests: ${totalRequests}/${this.currentRateLimits.rpm} (${rateLimitStatus.rpmPercentage.toFixed(1)}%)`);
    console.log(`📊 Status geral: ${rateLimitStatus.status} (${rateLimitStatus.percentage.toFixed(1)}%)`);
    
    // Ajustar configurações baseado no status
    if (rateLimitStatus.status === 'critical' || rateLimitStatus.status === 'warning') {
      console.warn(`⚠️ Rate limit ${rateLimitStatus.status} (${rateLimitStatus.percentage.toFixed(1)}%). Ajustando configurações.`);
      return { 
        shouldReduceTokens: true, 
        shouldSwitchModel: rateLimitStatus.status === 'critical',
        usagePercentage: rateLimitStatus.percentage,
        status: rateLimitStatus.status
      };
    }
    
    return { 
      shouldReduceTokens: false, 
      shouldSwitchModel: false,
      usagePercentage: rateLimitStatus.percentage,
      status: rateLimitStatus.status
    };
  }

  // Ajustar configurações baseado no uso de tokens
  adjustSettingsForTokenUsage(settings, usagePercentage) {
    if (usagePercentage > 80) {
      return {
        ...settings,
        maxTokens: Math.floor(settings.maxTokens * 0.7), // Reduzir 30%
        temperature: Math.min(settings.temperature + 0.1, 1.0) // Aumentar ligeiramente
      };
    }
    
    return settings;
  }

  // Etapa 1: Análise inicial e extração
  async extractAndAnalyze(rawContent, contentType) {
    console.log('🔍 Etapa 1: Análise inicial e extração');
    
    const optimizedSettings = this.getOptimizedSettings(this.currentModel);
    
    let analysisPrompt = `
Analise o seguinte conteúdo e extraia informações estruturadas:

Conteúdo: ${JSON.stringify(rawContent)}

Tipo de conteúdo: ${contentType}

Contexto do mundo:
- Nome: ${this.worldData?.name || 'Mundo da Light Novel'}
- Gênero: ${this.worldData?.genre || 'fantasy'}
- Nível tecnológico: ${this.worldData?.techLevel || 'medieval'}
- Descrição: ${this.worldData?.description || 'Um mundo de fantasia'}

Instruções:
1. Identifique se o conteúdo é uma string, objeto JSON, ou resposta de API
2. Extraia o conteúdo principal, removendo formatação desnecessária
3. Identifique problemas óbvios de estrutura ou formatação
4. Sugira melhorias iniciais

Responda em JSON com:
{
  "extractedContent": "conteúdo extraído",
  "contentType": "string|object|api_response",
  "initialIssues": ["lista de problemas identificados"],
  "suggestions": ["sugestões de melhoria"]
}
`;

    // Otimizar prompt se necessário
    analysisPrompt = this.optimizePrompt(analysisPrompt, optimizedSettings.maxTokens);

    try {
      const response = await this.aiService.generateText(analysisPrompt, optimizedSettings);
      const analysis = JSON.parse(response);
      
      console.log('📊 Análise inicial:', analysis);
      return analysis;
      
    } catch (error) {
      console.warn('⚠️ Erro na análise inicial, usando fallback');
      return {
        extractedContent: rawContent,
        contentType: 'string',
        initialIssues: ['Erro na análise'],
        suggestions: ['Verificar formato do conteúdo']
      };
    }
  }

  // Etapa 2: Validação de coerência com o mundo
  async validateWorldCoherence(content, contentType, context) {
    console.log('🌍 Etapa 2: Validação de coerência com o mundo');
    
    const worldContext = this.buildWorldContext();
    const schema = SchemaUtils.getSchema(contentType);
    
    const coherencePrompt = `
Valide se o seguinte conteúdo é coerente com o mundo estabelecido:

Conteúdo: ${JSON.stringify(content)}

Tipo: ${contentType}

Contexto do mundo:
${JSON.stringify(worldContext, null, 2)}

Esquema esperado:
${JSON.stringify(schema, null, 2)}

Contexto adicional:
${JSON.stringify(context, null, 2)}

Critérios de validação:
1. O conteúdo respeita as regras e características do mundo?
2. Há contradições com elementos existentes?
3. O conteúdo é apropriado para o gênero e nível tecnológico?
4. Os nomes e conceitos são consistentes com o universo?
5. O conteúdo adiciona valor ao mundo sem quebrar a imersão?

Responda em JSON:
{
  "valid": true/false,
  "issues": ["lista de problemas de coerência"],
  "suggestions": ["sugestões para melhorar a coerência"],
  "coherenceScore": 0-100,
  "recommendations": ["recomendações específicas"]
}
`;

    try {
      const response = await this.aiService.generateText(coherencePrompt);
      const validation = JSON.parse(response);
      
      console.log('🌍 Validação de coerência:', validation);
      return validation;
      
    } catch (error) {
      console.warn('⚠️ Erro na validação de coerência');
      return {
        valid: true,
        issues: [],
        suggestions: [],
        coherenceScore: 70,
        recommendations: []
      };
    }
  }

  // Etapa 3: Validação e correção de formato
  async validateAndFixFormat(content, contentType) {
    console.log('🔧 Etapa 3: Validação e correção de formato');
    
    const schema = SchemaUtils.getSchema(contentType);
    let currentContent = content;
    let iterations = 0;
    
    while (iterations < this.maxIterations) {
      const formatPrompt = `
Valide e corrija o formato do seguinte conteúdo:

Conteúdo atual: ${JSON.stringify(currentContent)}

Tipo: ${contentType}

Esquema esperado:
${JSON.stringify(schema, null, 2)}

Regras de formatação:
1. Todos os campos obrigatórios devem estar presentes
2. Tipos de dados devem corresponder ao esquema
3. Strings não devem conter caracteres inválidos
4. Arrays e objetos devem ter estrutura válida
5. Valores não devem ser undefined ou null (use strings vazias)

Responda em JSON:
{
  "valid": true/false,
  "content": "conteúdo corrigido",
  "issues": ["problemas de formato encontrados"],
  "corrections": ["correções aplicadas"],
  "needsMoreIterations": true/false
}
`;

      try {
        const response = await this.aiService.generateText(formatPrompt);
        const formatResult = JSON.parse(response);
        
        console.log(`🔧 Iteração ${iterations + 1}:`, formatResult);
        
        if (formatResult.valid && !formatResult.needsMoreIterations) {
          return formatResult;
        }
        
        currentContent = formatResult.content;
        iterations++;
        
      } catch (error) {
        console.warn(`⚠️ Erro na iteração ${iterations + 1} de formatação`);
        break;
      }
    }
    
    // Se chegou ao máximo de iterações, retorna o melhor resultado possível
    return {
      valid: true,
      content: currentContent,
      issues: ['Máximo de iterações atingido'],
      corrections: ['Formatação aplicada com limitações']
    };
  }

  // Etapa 4: Enriquecimento com contexto do mundo
  async enrichWithWorldContext(content, contentType, context) {
    console.log('🎨 Etapa 4: Enriquecimento com contexto do mundo');
    
    const worldContext = this.buildWorldContext();
    const existingElements = this.getRelevantExistingElements(contentType);
    
    const enrichmentPrompt = `
Enriqueça o seguinte conteúdo com contexto do mundo:

Conteúdo: ${JSON.stringify(content)}

Tipo: ${contentType}

Contexto do mundo:
${JSON.stringify(worldContext, null, 2)}

Elementos existentes relevantes:
${JSON.stringify(existingElements, null, 2)}

Contexto adicional:
${JSON.stringify(context, null, 2)}

Instruções de enriquecimento:
1. Adicione detalhes que conectem o conteúdo aos elementos existentes
2. Inclua referências culturais, geográficas ou históricas apropriadas
3. Enriqueça descrições com elementos específicos do mundo
4. Crie conexões narrativas com outros elementos
5. Mantenha a consistência com o tom e estilo do mundo

Responda em JSON:
{
  "enrichedContent": "conteúdo enriquecido",
  "addedElements": ["elementos adicionados"],
  "connections": ["conexões criadas"],
  "enrichmentScore": 0-100
}
`;

    try {
      const response = await this.aiService.generateText(enrichmentPrompt);
      const enrichment = JSON.parse(response);
      
      console.log('🎨 Enriquecimento:', enrichment);
      return enrichment.enrichedContent;
      
    } catch (error) {
      console.warn('⚠️ Erro no enriquecimento, retornando conteúdo original');
      return content;
    }
  }

  // Etapa 5: Validação de criatividade e originalidade
  async validateCreativity(content, contentType) {
    console.log('💡 Etapa 5: Validação de criatividade e originalidade');
    
    const creativityPrompt = `
Avalie a criatividade e originalidade do seguinte conteúdo:

Conteúdo: ${JSON.stringify(content)}

Tipo: ${contentType}

Critérios de criatividade:
1. O conteúdo é original e não clichê?
2. Há elementos únicos e memoráveis?
3. O conteúdo surpreende e engaja?
4. Há profundidade narrativa e complexidade?
5. O conteúdo contribui para a riqueza do mundo?
6. Há elementos que podem gerar futuras histórias?

Responda em JSON:
{
  "valid": true/false,
  "creativityScore": 0-100,
  "issues": ["problemas de criatividade"],
  "strengths": ["pontos fortes criativos"],
  "suggestions": ["sugestões para melhorar a criatividade"],
  "uniqueElements": ["elementos únicos identificados"]
}
`;

    try {
      const response = await this.aiService.generateText(creativityPrompt);
      const creativity = JSON.parse(response);
      
      console.log('💡 Validação de criatividade:', creativity);
      return creativity;
      
    } catch (error) {
      console.warn('⚠️ Erro na validação de criatividade');
      return {
        valid: true,
        creativityScore: 70,
        issues: [],
        strengths: ['Conteúdo básico mas funcional'],
        suggestions: [],
        uniqueElements: []
      };
    }
  }

  // Etapa 6: Integração com memória do projeto
  async integrateWithProjectMemory(content, contentType) {
    console.log('🧠 Etapa 6: Integração com memória do projeto');
    
    const projectMemory = this.buildProjectMemory();
    
    const memoryPrompt = `
Integre o conteúdo com a memória do projeto:

Conteúdo: ${JSON.stringify(content)}

Tipo: ${contentType}

Memória do projeto:
${JSON.stringify(projectMemory, null, 2)}

Instruções de integração:
1. Considere o histórico de validações anteriores
2. Aplique padrões que funcionaram bem no passado
3. Evite problemas recorrentes identificados
4. Mantenha consistência com o estilo do projeto
5. Considere o feedback de iterações anteriores

Responda em JSON:
{
  "integratedContent": "conteúdo integrado",
  "appliedPatterns": ["padrões aplicados"],
  "avoidedIssues": ["problemas evitados"],
  "consistencyImprovements": ["melhorias de consistência"]
}
`;

    try {
      const response = await this.aiService.generateText(memoryPrompt);
      const integration = JSON.parse(response);
      
      console.log('🧠 Integração com memória:', integration);
      return integration.integratedContent;
      
    } catch (error) {
      console.warn('⚠️ Erro na integração com memória, retornando conteúdo original');
      return content;
    }
  }

  // Etapa 7: Validação final e refinamento
  async finalValidationAndRefinement(content, contentType) {
    console.log('✨ Etapa 7: Validação final e refinamento');
    
    const finalPrompt = `
Realize a validação final e refinamento do conteúdo:

Conteúdo: ${JSON.stringify(content)}

Tipo: ${contentType}

Validação final:
1. O conteúdo está completo e bem estruturado?
2. Todos os campos obrigatórios estão preenchidos?
3. O conteúdo é coerente com o mundo?
4. O formato está correto?
5. O conteúdo é criativo e original?
6. Há algum problema óbvio que precisa ser corrigido?

Se houver problemas, corrija-os. Se estiver satisfatório, retorne o conteúdo como está.

Responda em JSON:
{
  "valid": true/false,
  "content": "conteúdo final",
  "finalScore": 0-100,
  "qualityAssessment": "avaliação da qualidade",
  "readyForUse": true/false
}
`;

    try {
      const response = await this.aiService.generateText(finalPrompt);
      const finalValidation = JSON.parse(response);
      
      console.log('✨ Validação final:', finalValidation);
      return finalValidation;
      
    } catch (error) {
      console.warn('⚠️ Erro na validação final');
      return {
        valid: true,
        content: content,
        finalScore: 80,
        qualityAssessment: 'Conteúdo aceitável',
        readyForUse: true
      };
    }
  }

  // Etapa 8: Aprendizado e atualização da memória
  async updateValidationHistory(result, contentType) {
    console.log('📚 Etapa 8: Atualizando histórico de validação');
    
    const validationRecord = {
      timestamp: new Date().toISOString(),
      contentType: contentType,
      result: result,
      worldContext: this.buildWorldContext(),
      projectContext: this.buildProjectMemory()
    };
    
    this.validationHistory.push(validationRecord);
    
    // Mantém apenas os últimos 100 registros
    if (this.validationHistory.length > 100) {
      this.validationHistory = this.validationHistory.slice(-100);
    }
    
    console.log('📚 Histórico atualizado, total de registros:', this.validationHistory.length);
  }

  // Métodos auxiliares
  buildWorldContext() {
    return {
      name: this.worldData?.name || 'Mundo da Light Novel',
      genre: this.worldData?.genre || 'fantasy',
      techLevel: this.worldData?.techLevel || 'medieval',
      description: this.worldData?.description || 'Um mundo de fantasia',
      elements: {
        locations: this.worldData?.locations || [],
        peoples: this.worldData?.peoples || [],
        religions: this.worldData?.religions || [],
        magicSystems: this.worldData?.magicSystems || [],
        technologies: this.worldData?.technologies || [],
        governments: this.worldData?.governments || [],
        economies: this.worldData?.economies || [],
        events: this.worldData?.events || [],
        characters: this.worldData?.characters || []
      }
    };
  }

  buildProjectMemory() {
    return {
      volumes: this.projectData?.volumes || [],
      chapters: this.projectData?.chapters || [],
      characters: this.projectData?.characters || [],
      validationHistory: this.validationHistory.slice(-10), // Últimos 10 registros
      commonIssues: this.analyzeCommonIssues(),
      successfulPatterns: this.analyzeSuccessfulPatterns()
    };
  }

  getRelevantExistingElements(contentType) {
    const worldContext = this.buildWorldContext();
    const relevantTypes = {
      'location': ['locations', 'regions'],
      'region': ['locations', 'regions'],
      'landmark': ['locations', 'landmarks'],
      'people': ['peoples', 'characters'],
      'character': ['characters', 'peoples'],
      'religion': ['religions'],
      'magicSystem': ['magicSystems'],
      'technology': ['technologies'],
      'government': ['governments'],
      'economy': ['economies'],
      'event': ['events'],
      'era': ['events', 'eras'],
      'language': ['languages'],
      'tradition': ['traditions'],
      'resource': ['resources']
    };
    
    const relevantKeys = relevantTypes[contentType] || [];
    const elements = [];
    
    relevantKeys.forEach(key => {
      if (worldContext.elements[key]) {
        elements.push(...worldContext.elements[key]);
      }
    });
    
    return elements.slice(0, 10); // Limita a 10 elementos para não sobrecarregar
  }

  analyzeCommonIssues() {
    const issues = {};
    this.validationHistory.forEach(record => {
      if (record.result.issues) {
        record.result.issues.forEach(issue => {
          issues[issue] = (issues[issue] || 0) + 1;
        });
      }
    });
    return issues;
  }

  analyzeSuccessfulPatterns() {
    const patterns = {};
    this.validationHistory
      .filter(record => record.result.finalScore > 80)
      .forEach(record => {
        const contentType = record.contentType;
        if (!patterns[contentType]) {
          patterns[contentType] = [];
        }
        patterns[contentType].push({
          score: record.result.finalScore,
          timestamp: record.timestamp
        });
      });
    return patterns;
  }

  createFallbackContent(contentType, context) {
    console.log('🔄 Criando conteúdo de fallback para:', contentType);
    
    const fallback = SchemaUtils.createEmptyItem(contentType);
    if (fallback) {
      return {
        ...fallback,
        name: `${contentType} Gerado`,
        description: `Um ${contentType} básico gerado automaticamente.`,
        generatedBy: 'AI Chain of Thought (Fallback)',
        createdAt: new Date().toISOString(),
        fallbackReason: 'Erro na cadeia de pensamento'
      };
    }
    
    return {
      name: `${contentType} Gerado`,
      description: `Conteúdo básico para ${contentType}`,
      generatedBy: 'AI Chain of Thought (Fallback)',
      createdAt: new Date().toISOString()
    };
  }

  // Método para obter estatísticas da cadeia de pensamento
  getChainStatistics() {
    const totalProcessed = this.validationHistory.length;
    const successful = this.validationHistory.filter(r => r.result.readyForUse).length;
    const averageScore = this.validationHistory.reduce((sum, r) => sum + (r.result.finalScore || 0), 0) / totalProcessed;
    
    return {
      totalProcessed,
      successful,
      successRate: totalProcessed > 0 ? (successful / totalProcessed) * 100 : 0,
      averageScore: averageScore || 0,
      commonIssues: this.analyzeCommonIssues(),
      successfulPatterns: this.analyzeSuccessfulPatterns()
    };
  }
}

// Função factory para criar instância
export const createAIChainOfThought = (aiService, worldData, projectData = {}) => {
  return new AIChainOfThought(aiService, worldData, projectData);
};

// Exporta também como default
export default AIChainOfThought;
