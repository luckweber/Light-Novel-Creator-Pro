// Esquemas centralizados para World Builder
// Este arquivo define a estrutura de dados para todos os tipos de itens
// e é usado tanto pelo UniversalFormModal quanto pelo unifiedPromptIntegration

export const WORLD_BUILDER_SCHEMAS = {
  // Esquema para Marco (Landmark)
  landmark: {
    title: 'Marco',
    icon: '🏛️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      significance: { type: 'textarea', label: 'Significado', required: false },
      location: { type: 'text', label: 'Localização', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      features: { type: 'textarea', label: 'Características', required: false },
      accessibility: { type: 'text', label: 'Acessibilidade', required: false },
      legends: { type: 'textarea', label: 'Lendas', required: false },
      visitors: { type: 'text', label: 'Visitantes', required: false }
    }
  },

  // Esquema para Local (Location)
  location: {
    title: 'Local',
    icon: '📍',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      climate: { type: 'text', label: 'Clima', required: false },
      population: { type: 'text', label: 'População', required: false },
      culture: { type: 'text', label: 'Cultura', required: false },
      government: { type: 'text', label: 'Governo', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      pointsOfInterest: { type: 'array', label: 'Pontos de Interesse', required: false },
      atmosphere: { type: 'text', label: 'Atmosfera', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false }
    }
  },

  // Esquema para Sistema Mágico (Magic System)
  magicSystem: {
    title: 'Sistema Mágico',
    icon: '✨',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      rules: { type: 'textarea', label: 'Regras', required: false },
      source: { type: 'text', label: 'Fonte de Poder', required: false },
      limitations: { type: 'textarea', label: 'Limitações', required: false }
    }
  },

  // Esquema para Idioma (Language)
  language: {
    title: 'Idioma',
    icon: '🗣️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      family: { type: 'text', label: 'Família Linguística', required: false },
      speakers: { type: 'text', label: 'Falantes', required: false },
      script: { type: 'text', label: 'Sistema de Escrita', required: false },
      examples: { type: 'object', label: 'Exemplos', required: false },
      dialects: { type: 'object', label: 'Dialetos', required: false },
      culturalInfluence: { type: 'textarea', label: 'Influência Cultural', required: false },
      socialStatus: { type: 'text', label: 'Status Social', required: false },
      evolution: { type: 'textarea', label: 'Evolução', required: false }
    }
  },

  // Esquema para Povo (People)
  people: {
    title: 'Povo',
    icon: '👥',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      physicalTraits: { type: 'textarea', label: 'Traços Físicos', required: false },
      culture: { type: 'textarea', label: 'Cultura', required: false },
      socialStructure: { type: 'textarea', label: 'Estrutura Social', required: false },
      specialAbilities: { type: 'textarea', label: 'Habilidades Especiais', required: false },
      relationships: { type: 'textarea', label: 'Relacionamentos', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      values: { type: 'textarea', label: 'Valores', required: false },
      territory: { type: 'text', label: 'Território', required: false },
      population: { type: 'text', label: 'População', required: false },
      language: { type: 'text', label: 'Idioma', required: false },
      religion: { type: 'text', label: 'Religião', required: false },
      technology: { type: 'text', label: 'Tecnologia', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },

  // Esquema para Religião (Religion)
  religion: {
    title: 'Religião',
    icon: '⛪',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: false },
      deities: { type: 'textarea', label: 'Divindades', required: false },
      dogmas: { type: 'textarea', label: 'Dogmas', required: false },
      rituals: { type: 'textarea', label: 'Rituais', required: false },
      hierarchy: { type: 'textarea', label: 'Hierarquia', required: false },
      sacredPlaces: { type: 'textarea', label: 'Locais Sagrados', required: false },
      sacredTexts: { type: 'textarea', label: 'Textos Sagrados', required: false },
      festivals: { type: 'textarea', label: 'Festivais', required: false },
      relationships: { type: 'textarea', label: 'Relações', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false }
    }
  },

  // Esquema para Tradição (Tradition)
  tradition: {
    title: 'Tradição',
    icon: '🎭',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: false },
      origin: { type: 'textarea', label: 'Origem', required: false },
      practice: { type: 'textarea', label: 'Prática', required: false },
      meaning: { type: 'textarea', label: 'Significado', required: false },
      participants: { type: 'text', label: 'Participantes', required: false },
      frequency: { type: 'text', label: 'Frequência', required: false },
      symbols: { type: 'textarea', label: 'Símbolos', required: false },
      variations: { type: 'textarea', label: 'Variações', required: false },
      importance: { type: 'textarea', label: 'Importância', required: false },
      evolution: { type: 'textarea', label: 'Evolução', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },

  // Esquema para Evento (Event)
  event: {
    title: 'Evento',
    icon: '📅',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      date: { type: 'text', label: 'Data', required: false },
      location: { type: 'text', label: 'Local', required: false },
      characters: { type: 'textarea', label: 'Personagens', required: false },
      description: { type: 'textarea', label: 'Descrição', required: true },
      causes: { type: 'textarea', label: 'Causas', required: false },
      consequences: { type: 'textarea', label: 'Consequências', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      legacy: { type: 'textarea', label: 'Legado', required: false },
      sources: { type: 'textarea', label: 'Fontes', required: false },
      controversies: { type: 'textarea', label: 'Controvérsias', required: false },
      lessons: { type: 'textarea', label: 'Lições', required: false }
    }
  },

  // Esquema para Era (Era)
  era: {
    title: 'Era',
    icon: '⏰',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      startYear: { type: 'text', label: 'Ano de Início', required: false },
      endYear: { type: 'text', label: 'Ano de Fim', required: false },
      description: { type: 'textarea', label: 'Descrição', required: true },
      characteristics: { type: 'textarea', label: 'Características', required: false },
      majorEvents: { type: 'textarea', label: 'Eventos Principais', required: false },
      keyFigures: { type: 'textarea', label: 'Figuras Importantes', required: false },
      culturalChanges: { type: 'textarea', label: 'Mudanças Culturais', required: false },
      technologicalAdvances: { type: 'textarea', label: 'Avanços Tecnológicos', required: false },
      socialStructures: { type: 'textarea', label: 'Estruturas Sociais', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false },
      achievements: { type: 'textarea', label: 'Conquistas', required: false },
      legacy: { type: 'textarea', label: 'Legado', required: false },
      transition: { type: 'textarea', label: 'Transição', required: false }
    }
  },

  // Esquema para Região (Region)
  region: {
    title: 'Região',
    icon: '🗺️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      geography: { type: 'textarea', label: 'Geografia', required: false },
      climate: { type: 'text', label: 'Clima', required: false },
      population: { type: 'text', label: 'População', required: false },
      government: { type: 'text', label: 'Governo', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      culture: { type: 'textarea', label: 'Cultura', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      borders: { type: 'textarea', label: 'Fronteiras', required: false },
      resources: { type: 'textarea', label: 'Recursos', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },

  // Esquema para Recurso (Resource)
  resource: {
    title: 'Recurso',
    icon: '💎',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      location: { type: 'text', label: 'Localização', required: false },
      rarity: { type: 'select', label: 'Raridade', options: ['Comum', 'Incomum', 'Raro', 'Muito Raro', 'Lendário'], required: false },
      value: { type: 'text', label: 'Valor', required: false },
      uses: { type: 'textarea', label: 'Usos', required: false },
      extraction: { type: 'textarea', label: 'Extração', required: false },
      trade: { type: 'textarea', label: 'Comércio', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      regulations: { type: 'textarea', label: 'Regulamentações', required: false }
    }
  },

  // Esquema para Tecnologia (Technology)
  technology: {
    title: 'Tecnologia',
    icon: '⚙️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      inventor: { type: 'text', label: 'Inventor', required: false },
      year: { type: 'text', label: 'Ano', required: false },
      materials: { type: 'textarea', label: 'Materiais', required: false },
      process: { type: 'textarea', label: 'Processo', required: false },
      applications: { type: 'textarea', label: 'Aplicações', required: false },
      limitations: { type: 'textarea', label: 'Limitações', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      distribution: { type: 'textarea', label: 'Distribuição', required: false },
      maintenance: { type: 'textarea', label: 'Manutenção', required: false }
    }
  },

  // Esquema para Governo (Government)
  government: {
    title: 'Governo',
    icon: '🏛️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      leader: { type: 'text', label: 'Líder', required: false },
      structure: { type: 'textarea', label: 'Estrutura', required: false },
      laws: { type: 'textarea', label: 'Leis', required: false },
      military: { type: 'textarea', label: 'Militar', required: false },
      economy: { type: 'textarea', label: 'Economia', required: false },
      foreignPolicy: { type: 'textarea', label: 'Política Externa', required: false },
      stability: { type: 'text', label: 'Estabilidade', required: false },
      corruption: { type: 'textarea', label: 'Corrupção', required: false },
      challenges: { type: 'textarea', label: 'Desafios', required: false }
    }
  },

  // Esquema para Economia (Economy)
  economy: {
    title: 'Economia',
    icon: '💰',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      currency: { type: 'text', label: 'Moeda', required: false },
      trade: { type: 'textarea', label: 'Comércio', required: false },
      resources: { type: 'textarea', label: 'Recursos', required: false },
      industries: { type: 'textarea', label: 'Indústrias', required: false },
      wealth: { type: 'text', label: 'Riqueza', required: false },
      inequality: { type: 'textarea', label: 'Desigualdade', required: false },
      regulations: { type: 'textarea', label: 'Regulamentações', required: false },
      challenges: { type: 'textarea', label: 'Desafios', required: false },
      opportunities: { type: 'textarea', label: 'Oportunidades', required: false }
    }
  },

  // Esquema para Personagem (Character)
  character: {
    title: 'Personagem',
    icon: '👤',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      role: { type: 'text', label: 'Papel', required: false },
      age: { type: 'text', label: 'Idade', required: false },
      gender: { type: 'text', label: 'Gênero', required: false },
      appearance: { type: 'textarea', label: 'Aparência', required: false },
      personality: { type: 'textarea', label: 'Personalidade', required: false },
      background: { type: 'textarea', label: 'Histórico', required: false },
      motivation: { type: 'textarea', label: 'Motivação', required: false },
      goals: { type: 'textarea', label: 'Objetivos', required: false },
      fears: { type: 'textarea', label: 'Medos', required: false },
      strengths: { type: 'textarea', label: 'Forças', required: false },
      weaknesses: { type: 'textarea', label: 'Fraquezas', required: false },
      relationships: { type: 'textarea', label: 'Relacionamentos', required: false },
      development: { type: 'textarea', label: 'Desenvolvimento', required: false },
      region: { type: 'text', label: 'Região', required: false },
      occupation: { type: 'text', label: 'Ocupação', required: false },
      skills: { type: 'textarea', label: 'Habilidades', required: false },
      equipment: { type: 'textarea', label: 'Equipamentos', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false },
      quotes: { type: 'textarea', label: 'Frases', required: false },
      notes: { type: 'textarea', label: 'Notas', required: false }
    }
  },

  // Esquema para Item de Lore (Lore Item)
  loreItem: {
    title: 'Item de Lore',
    icon: '📚',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      origin: { type: 'textarea', label: 'Origem', required: false },
      significance: { type: 'textarea', label: 'Significado', required: false },
      connections: { type: 'textarea', label: 'Conexões', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      variations: { type: 'textarea', label: 'Variações', required: false },
      sources: { type: 'textarea', label: 'Fontes', required: false },
      notes: { type: 'textarea', label: 'Notas', required: false },
      // Campos específicos para diferentes tipos de lore
      characters: { type: 'textarea', label: 'Personagens', required: false },
      moral: { type: 'textarea', label: 'Moral', required: false },
      locations: { type: 'textarea', label: 'Locais', required: false },
      power: { type: 'textarea', label: 'Poderes', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      location: { type: 'text', label: 'Localização', required: false },
      steps: { type: 'textarea', label: 'Passos', required: false },
      requirements: { type: 'textarea', label: 'Requisitos', required: false },
      effects: { type: 'textarea', label: 'Efeitos', required: false }
    }
  }
};

// Funções utilitárias para trabalhar com os esquemas
export const SchemaUtils = {
  // Obtém o esquema para um tipo específico
  getSchema(itemType) {
    return WORLD_BUILDER_SCHEMAS[itemType] || null;
  },

  // Obtém todos os tipos disponíveis
  getAvailableTypes() {
    return Object.keys(WORLD_BUILDER_SCHEMAS);
  },

  // Obtém os campos obrigatórios para um tipo
  getRequiredFields(itemType) {
    const schema = this.getSchema(itemType);
    if (!schema) return [];
    
    return Object.entries(schema.fields)
      .filter(([_, config]) => config.required)
      .map(([field, _]) => field);
  },

  // Obtém os campos opcionais para um tipo
  getOptionalFields(itemType) {
    const schema = this.getSchema(itemType);
    if (!schema) return [];
    
    return Object.entries(schema.fields)
      .filter(([_, config]) => !config.required)
      .map(([field, _]) => field);
  },

  // Cria um objeto vazio com a estrutura correta para um tipo
  createEmptyItem(itemType) {
    const schema = this.getSchema(itemType);
    if (!schema) return null;

    const emptyItem = {
      name: '',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };

    // Adiciona campos baseados no esquema
    Object.entries(schema.fields).forEach(([field, config]) => {
      switch (config.type) {
        case 'array':
          emptyItem[field] = [];
          break;
        case 'object':
          emptyItem[field] = {};
          break;
        default:
          emptyItem[field] = '';
      }
    });

    return emptyItem;
  },

  // Valida se um item tem a estrutura correta
  validateItem(item, itemType) {
    const schema = this.getSchema(itemType);
    if (!schema) return { valid: false, errors: ['Tipo de item inválido'] };

    const errors = [];
    const requiredFields = this.getRequiredFields(itemType);

    // Verifica campos obrigatórios
    requiredFields.forEach(field => {
      if (!item[field] || item[field].toString().trim() === '') {
        errors.push(`Campo "${schema.fields[field].label}" é obrigatório`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Normaliza um item para garantir que tenha todos os campos necessários
  normalizeItem(item, itemType) {
    const schema = this.getSchema(itemType);
    if (!schema) return item;

    const normalized = { ...item };

    // Garante que todos os campos do esquema existam
    Object.entries(schema.fields).forEach(([field, config]) => {
      if (!(field in normalized)) {
        switch (config.type) {
          case 'array':
            normalized[field] = [];
            break;
          case 'object':
            normalized[field] = {};
            break;
          default:
            normalized[field] = '';
        }
      }
    });

    // Garante campos padrão
    if (!normalized.generatedBy) {
      normalized.generatedBy = 'AI';
    }
    if (!normalized.createdAt) {
      normalized.createdAt = new Date().toISOString();
    }

    return normalized;
  }
};

// Exporta também como default para compatibilidade
export default WORLD_BUILDER_SCHEMAS;
