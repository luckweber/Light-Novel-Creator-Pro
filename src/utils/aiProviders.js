// Configurações dos provedores de IA
export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      'gpt-4o': { 
        name: 'GPT-4o', 
        maxTokens: 128000, 
        cost: 'Alto',
        rateLimits: {
          tpm: 500000,
          rpm: 500,
          defaultMaxTokens: 4000,
          fallbackModels: ['gpt-4o-mini', 'gpt-3.5-turbo']
        }
      },
      'gpt-4o-mini': { 
        name: 'GPT-4o Mini', 
        maxTokens: 128000, 
        cost: 'Médio',
        rateLimits: {
          tpm: 150000,
          rpm: 3000,
          defaultMaxTokens: 4000,
          fallbackModels: ['gpt-3.5-turbo']
        }
      },
      'gpt-4-turbo': { 
        name: 'GPT-4 Turbo', 
        maxTokens: 128000, 
        cost: 'Alto',
        rateLimits: {
          tpm: 300000,
          rpm: 500,
          defaultMaxTokens: 4000,
          fallbackModels: ['gpt-4o-mini', 'gpt-3.5-turbo']
        }
      },
      'gpt-3.5-turbo': { 
        name: 'GPT-3.5 Turbo', 
        maxTokens: 16385, 
        cost: 'Baixo',
        rateLimits: {
          tpm: 90000,
          rpm: 3500,
          defaultMaxTokens: 2000,
          fallbackModels: []
        }
      }
    },
    keyFormat: 'sk-...',
    website: 'https://platform.openai.com',
    description: 'Modelos GPT mais populares e versáteis',
    setupInstructions: [
      'Acesse https://platform.openai.com',
      'Faça login ou crie uma conta',
      'Vá para API Keys no menu',
      'Clique em "Create new secret key"',
      'Cole a chave aqui'
    ]
  },
  
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    models: {
      'claude-3-5-sonnet-20241022': { 
        name: 'Claude 3.5 Sonnet', 
        maxTokens: 200000, 
        cost: 'Médio',
        rateLimits: {
          tpm: 200000,
          rpm: 100,
          defaultMaxTokens: 4000,
          fallbackModels: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
        }
      },
      'claude-3-opus-20240229': { 
        name: 'Claude 3 Opus', 
        maxTokens: 200000, 
        cost: 'Alto',
        rateLimits: {
          tpm: 100000,
          rpm: 50,
          defaultMaxTokens: 4000,
          fallbackModels: ['claude-3-5-sonnet-20241022', 'claude-3-sonnet-20240229']
        }
      },
      'claude-3-sonnet-20240229': { 
        name: 'Claude 3 Sonnet', 
        maxTokens: 200000, 
        cost: 'Médio',
        rateLimits: {
          tpm: 150000,
          rpm: 80,
          defaultMaxTokens: 4000,
          fallbackModels: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']
        }
      },
      'claude-3-haiku-20240307': { 
        name: 'Claude 3 Haiku', 
        maxTokens: 200000, 
        cost: 'Baixo',
        rateLimits: {
          tpm: 300000,
          rpm: 200,
          defaultMaxTokens: 4000,
          fallbackModels: []
        }
      }
    },
    keyFormat: 'sk-ant-...',
    website: 'https://console.anthropic.com',
    description: 'Excelente para textos longos e análise detalhada',
    setupInstructions: [
      'Acesse https://console.anthropic.com',
      'Faça login ou crie uma conta',
      'Vá para API Keys',
      'Clique em "Create Key"',
      'Cole a chave aqui'
    ]
  },
  
  google: {
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: {
      'gemini-1.5-pro': { 
        name: 'Gemini 1.5 Pro', 
        maxTokens: 2000000, 
        cost: 'Médio',
        rateLimits: {
          tpm: 1000000,
          rpm: 100,
          defaultMaxTokens: 4000,
          fallbackModels: ['gemini-1.5-flash']
        }
      },
      'gemini-1.5-flash': { 
        name: 'Gemini 1.5 Flash', 
        maxTokens: 1000000, 
        cost: 'Baixo',
        rateLimits: {
          tpm: 500000,
          rpm: 200,
          defaultMaxTokens: 4000,
          fallbackModels: []
        }
      }
    },
    keyFormat: 'AI...',
    website: 'https://ai.google.dev',
    description: 'Modelos Gemini com capacidades multimodais',
    setupInstructions: [
      'Acesse https://ai.google.dev',
      'Clique em "Get API key in Google AI Studio"',
      'Faça login com sua conta Google',
      'Clique em "Create API Key"',
      'Cole a chave aqui'
    ]
  },
  
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    disabled: false, // Provedor habilitado
    models: {
      'qwen/qwen3-32b': { 
        name: 'Qwen 3 32B', 
        id: 'qwen/qwen3-32b', 
        maxTokens: 32768, 
        cost: 'Gratuito',
        rateLimits: {
          tpm: 6000, // Tokens Per Minute
          rpm: 100,  // Requests Per Minute
          defaultMaxTokens: 1500,
          fallbackModels: ['llama3-8b-8192', 'gemma-7b-it']
        }
      },
      'llama3-70b-8192': { 
        name: 'Llama 3 70B', 
        id: 'llama3-70b-8192', 
        maxTokens: 8192, 
        cost: 'Gratuito',
        rateLimits: {
          tpm: 8000,
          rpm: 150,
          defaultMaxTokens: 2000,
          fallbackModels: ['llama3-8b-8192', 'gemma-7b-it']
        }
      },
      'llama3-8b-8192': { 
        name: 'Llama 3 8B', 
        id: 'llama3-8b-8192', 
        maxTokens: 8192, 
        cost: 'Gratuito',
        rateLimits: {
          tpm: 10000,
          rpm: 200,
          defaultMaxTokens: 1500,
          fallbackModels: ['gemma-7b-it']
        }
      },
      'mixtral-8x7b-32768': { 
        name: 'Mixtral 8x7B', 
        id: 'mixtral-8x7b-32768', 
        maxTokens: 32768, 
        cost: 'Gratuito',
        rateLimits: {
          tpm: 8000,
          rpm: 120,
          defaultMaxTokens: 1800,
          fallbackModels: ['llama3-8b-8192', 'gemma-7b-it']
        }
      },
      'gemma-7b-it': { 
        name: 'Gemma 7B', 
        id: 'gemma-7b-it', 
        maxTokens: 8192, 
        cost: 'Gratuito',
        rateLimits: {
          tpm: 12000,
          rpm: 250,
          defaultMaxTokens: 1200,
          fallbackModels: ['llama3-8b-8192']
        }
      },
      
     },
     keyFormat: 'gsk_...',
     website: 'https://console.groq.com',
     description: 'Velocidade ultra-rápida com modelos gratuitos',
     setupInstructions: [
       'Acesse https://console.groq.com',
       'Faça login ou crie uma conta',
       'Vá para API Keys',
       'Clique em "Create API Key"',
       'Cole a chave aqui'
     ]
   },
   
   // Exemplo de provedor desabilitado
   cohere: {
     name: 'Cohere',
     baseUrl: 'https://api.cohere.ai/v1',
     disabled: true, // Provedor desabilitado temporariamente
     models: {
       'command': { 
         name: 'Command', 
         maxTokens: 4096, 
         cost: 'Médio',
         rateLimits: {
           tpm: 50000,
           rpm: 100,
           defaultMaxTokens: 2000,
           fallbackModels: []
         }
       },
       'command-light': { 
         name: 'Command Light', 
         maxTokens: 4096, 
         cost: 'Baixo',
         rateLimits: {
           tpm: 100000,
           rpm: 200,
           defaultMaxTokens: 1500,
           fallbackModels: []
         }
       }
     },
     keyFormat: 'cohere_...',
     website: 'https://cohere.ai',
     description: 'Modelos especializados em geração de texto',
     setupInstructions: [
       'Acesse https://cohere.ai',
       'Faça login ou crie uma conta',
       'Vá para API Keys',
       'Clique em "Create API Key"',
       'Cole a chave aqui'
     ]
   }
};

// Classe para gerenciar chamadas às APIs
export class AIService {
  constructor(provider, apiKey, settings = {}) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.settings = {
      temperature: 0.7,
      maxTokens: 2000,
      ...settings
    };
    this.baseUrl = AI_PROVIDERS[provider]?.baseUrl;
  }

  async generateText(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    const finalOptions = { ...this.settings, ...options };
    
    try {
      let response;
      
      switch (this.provider) {
        case 'openai':
        case 'groq':
          response = await this.callOpenAICompatible(prompt, finalOptions);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt, finalOptions);
          break;
        case 'google':
          response = await this.callGoogle(prompt, finalOptions);
          break;
        default:
          throw new Error(`Provedor ${this.provider} não suportado`);
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao chamar ${this.provider}:`, error);
      throw error;
    }
  }

  async callOpenAICompatible(prompt, options) {
    const modelId = this.provider === 'groq' 
      ? AI_PROVIDERS.groq.models[options.model]?.id || options.model
      : options.model;

    console.log(`🔧 AI Request - Provider: ${this.provider}, Model: ${modelId}, MaxTokens: ${options.maxTokens}, Temperature: ${options.temperature}`);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(prompt, options) {
    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async callGoogle(prompt, options) {
    const response = await fetch(`${this.baseUrl}/models/${options.model || 'gemini-1.5-flash'}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  static async testConnection(provider, apiKey, model) {
    try {
      const service = new AIService(provider, apiKey);
      const testPrompt = 'Responda apenas "OK" se você conseguir me ouvir.';
      
      const response = await service.generateText(testPrompt, {
        model,
        maxTokens: 10,
        temperature: 0
      });
      
      return {
        success: true,
        response: response.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}



// Utilitários para validação de API Keys
export const validateApiKey = (provider, apiKey) => {
  if (!apiKey || apiKey.trim().length === 0) {
    return { valid: false, message: 'API Key não pode estar vazia' };
  }

  const providerConfig = AI_PROVIDERS[provider];
  if (!providerConfig) {
    return { valid: false, message: 'Provedor não suportado' };
  }

  // const keyFormat = providerConfig.keyFormat;
  
  // Validações básicas baseadas no formato esperado
  switch (provider) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        return { valid: false, message: 'API Key da OpenAI deve começar com "sk-"' };
      }
      if (apiKey.length < 20) {
        return { valid: false, message: 'API Key da OpenAI muito curta' };
      }
      break;
      
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        return { valid: false, message: 'API Key da Anthropic deve começar com "sk-ant-"' };
      }
      break;
      
    case 'google':
      if (!apiKey.startsWith('AI')) {
        return { valid: false, message: 'API Key do Google AI deve começar com "AI"' };
      }
      break;
      
    case 'groq':
      if (!apiKey.startsWith('gsk_')) {
        return { valid: false, message: 'API Key da Groq deve começar com "gsk_"' };
      }
      break;
    default:
      break;
  }

  return { valid: true, message: 'Formato da API Key válido' };
};

// Função para obter o melhor modelo para uma tarefa específica
export const getBestModelForTask = (provider, task) => {
  const providerModels = AI_PROVIDERS[provider]?.models;
  if (!providerModels) return null;

  const models = Object.keys(providerModels);
  
  switch (task) {
    case 'creative_writing':
      // Priorizar modelos mais criativos
      if (provider === 'openai') return 'gpt-4o';
      if (provider === 'anthropic') return 'claude-3-5-sonnet-20241022';
      if (provider === 'google') return 'gemini-1.5-pro';
      return 'llama3-70b-8192';
      
    case 'fast_generation':
      // Priorizar velocidade
      if (provider === 'openai') return 'gpt-3.5-turbo';
      if (provider === 'anthropic') return 'claude-3-haiku-20240307';
      if (provider === 'google') return 'gemini-1.5-flash';
      return 'llama3-8b-8192';
      
    case 'long_context':
      // Priorizar contexto longo
      if (provider === 'anthropic') return 'claude-3-5-sonnet-20241022';
      if (provider === 'google') return 'gemini-1.5-pro';
      if (provider === 'groq') return 'qwen/qwen3-32b';
      return 'gpt-4-turbo';
    default:
      break;
  }
  
  // Retornar o primeiro modelo disponível como fallback
  return models[0];
};

// Função para obter o modelo padrão de cada provedor
export const getDefaultModel = (provider) => {
  switch (provider) {
    case 'openai':
      return 'gpt-4o';
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022';
    case 'google':
      return 'gemini-1.5-pro';
    case 'groq':
      return 'qwen/qwen3-32b'; // Novo modelo Qwen como padrão
    default:
      return null;
  }
};

// Função para obter configurações de rate limit de um modelo
export const getModelRateLimits = (provider, modelId) => {
  const providerConfig = AI_PROVIDERS[provider];
  if (!providerConfig || !providerConfig.models[modelId]) {
    return null;
  }
  
  return providerConfig.models[modelId].rateLimits || null;
};

// Função para obter modelos fallback de um modelo específico
export const getModelFallbacks = (provider, modelId) => {
  const rateLimits = getModelRateLimits(provider, modelId);
  return rateLimits?.fallbackModels || [];
};

// Função para obter configurações otimizadas baseadas no rate limit
export const getOptimizedModelSettings = (provider, modelId) => {
  const rateLimits = getModelRateLimits(provider, modelId);
  if (!rateLimits) {
    return {
      temperature: 0.7,
      maxTokens: 2000
    };
  }
  
  return {
    temperature: 0.7,
    maxTokens: rateLimits.defaultMaxTokens || 2000,
    rateLimits: rateLimits
  };
};

// Função para verificar se um modelo está próximo do rate limit
export const checkRateLimitStatus = (provider, modelId, currentUsage) => {
  const rateLimits = getModelRateLimits(provider, modelId);
  if (!rateLimits) {
    return { status: 'unknown', percentage: 0 };
  }
  
  const tpmPercentage = (currentUsage.tokens || 0) / rateLimits.tpm * 100;
  const rpmPercentage = (currentUsage.requests || 0) / rateLimits.rpm * 100;
  
  const maxPercentage = Math.max(tpmPercentage, rpmPercentage);
  
  let status = 'safe';
  if (maxPercentage > 90) status = 'critical';
  else if (maxPercentage > 80) status = 'warning';
  else if (maxPercentage > 60) status = 'moderate';
  
  return {
    status,
    percentage: maxPercentage,
    tpmPercentage,
    rpmPercentage,
    limits: rateLimits
  };
};

export default AIService;
