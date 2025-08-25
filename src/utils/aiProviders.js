// Configurações dos provedores de IA
export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      'gpt-4o': { name: 'GPT-4o', maxTokens: 128000, cost: 'Alto' },
      'gpt-4o-mini': { name: 'GPT-4o Mini', maxTokens: 128000, cost: 'Médio' },
      'gpt-4-turbo': { name: 'GPT-4 Turbo', maxTokens: 128000, cost: 'Alto' },
      'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', maxTokens: 16385, cost: 'Baixo' }
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
      'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', maxTokens: 200000, cost: 'Médio' },
      'claude-3-opus-20240229': { name: 'Claude 3 Opus', maxTokens: 200000, cost: 'Alto' },
      'claude-3-sonnet-20240229': { name: 'Claude 3 Sonnet', maxTokens: 200000, cost: 'Médio' },
      'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', maxTokens: 200000, cost: 'Baixo' }
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
      'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', maxTokens: 2000000, cost: 'Médio' },
      'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', maxTokens: 1000000, cost: 'Baixo' }
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
    models: {
      'llama3-70b-8192': { name: 'Llama 3 70B', id: 'llama3-70b-8192', maxTokens: 8192, cost: 'Gratuito' },
      'llama3-8b-8192': { name: 'Llama 3 8B', id: 'llama3-8b-8192', maxTokens: 8192, cost: 'Gratuito' },
      'mixtral-8x7b-32768': { name: 'Mixtral 8x7B', id: 'mixtral-8x7b-32768', maxTokens: 32768, cost: 'Gratuito' },
      'gemma-7b-it': { name: 'Gemma 7B', id: 'gemma-7b-it', maxTokens: 8192, cost: 'Gratuito' }
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

// Prompts pré-definidos para diferentes tipos de geração
export const AI_PROMPTS = {
  character: {
    basic: `Crie um personagem para uma light novel usando o CONTEXTO DO MUNDO fornecido. O personagem deve ser coeso com o universo descrito.

Considere as seguintes características:
- Nome único e interessante, apropriado para a cultura local (se aplicável).
- Idade e aparência física detalhada, influenciada pela etnia ou povo da região de origem.
- Personalidade complexa com virtudes e defeitos.
- Histórico pessoal interessante, conectado à história ou eventos do mundo.
- Objetivos e motivações claras.
- Habilidades ou talentos especiais, consistentes com os sistemas de magia ou tecnologia do mundo.

Formato da resposta em JSON:
{
  "name": "",
  "age": "",
  "appearance": "",
  "personality": "",
  "background": "",
  "goals": "",
  "abilities": ""
}`,
    
    detailed: `Crie um personagem profundamente desenvolvido para uma light novel, usando o CONTEXTO DO MUNDO fornecido:

INFORMAÇÕES BÁSICAS:
- Nome completo (com significado)
- Idade, gênero, altura, peso
- Aparência detalhada (cabelos, olhos, estilo)

PERSONALIDADE:
- Traços principais de personalidade
- Virtudes e defeitos
- Medos e inseguranças
- Forma de falar e maneirismos

HISTÓRIA:
- Origem e família
- Eventos importantes do passado
- Relacionamentos significativos
- Traumas ou experiências marcantes

HABILIDADES E PAPEL:
- Talentos naturais
- Habilidades aprendidas
- Papel na história (protagonista, antagonista, etc.)
- Arco de desenvolvimento

Formate como JSON estruturado.`
  },

  world: {
    location: `Crie um local interessante para uma light novel:
- Nome único e evocativo
- Tipo de local (cidade, floresta, castelo, etc.)
- Descrição visual detalhada
- História e significado cultural
- Habitantes típicos
- Pontos de interesse importantes
- Atmosfera e sensações

Formate como JSON estruturado.`,
    
    culture: `Desenvolva uma cultura/civilização para uma light novel:
- Nome da cultura/povo
- Origem e história
- Valores e crenças principais
- Estrutura social e política
- Tradições e costumes únicos
- Arquitetura e arte típica
- Relação com outras culturas
- Conflitos internos ou externos

Formate como JSON estruturado.`
  },

  story: {
    plot: `Gere um ponto de enredo interessante:
- Evento ou situação principal
- Personagens envolvidos
- Conflito ou tensão
- Possíveis consequências
- Como se conecta com a história maior

Formate como JSON estruturado.`,
    
    dialogue: `Crie um diálogo natural entre personagens:
- Considere as personalidades dos personagens
- Inclua subtext e emoções
- Mantenha o tom apropriado
- Avance a história ou desenvolva personagens

Formate como roteiro com nomes dos personagens.`
  },

  lore: {
    legend: `Crie uma lenda para uma light novel baseado no CONTEXTO DO MUNDO fornecido. A lenda deve ser coesa com o universo.

Responda APENAS com o código JSON, seguindo esta estrutura exata:
{
  "name": "Título da Lenda",
  "description": "A história completa da lenda.",
  "origin": "Onde ou como a lenda surgiu.",
  "significance": "Qual a importância ou lição moral da lenda.",
  "characters": "Personagens míticos envolvidos.",
  "locations": "Locais onde a lenda acontece."
}`,
    
    artifact: `Desenvolva um artefato para uma light novel, baseado no CONTEXTO DO MUNDO.

Responda APENAS com o código JSON, seguindo esta estrutura exata:
{
  "name": "Nome do Artefato",
  "description": "Aparência e história do artefato.",
  "origin": "Quem o criou e como.",
  "significance": "Qual sua importância para a história.",
  "effects": "Quais seus poderes, habilidades e custos/limitações."
}`
  }
};

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
      if (provider === 'groq') return 'mixtral-8x7b-32768';
      return 'gpt-4-turbo';
    default:
      break;
  }
  
  // Retornar o primeiro modelo disponível como fallback
  return models[0];
};

export default AIService;
