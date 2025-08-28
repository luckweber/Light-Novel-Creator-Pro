// Sistema de Interdependências para World-Building
// Arquitetura robusta e flexível para relacionamentos entre elementos

import { PromptTemplate } from './promptTools';

// Definição dos tipos de relacionamentos
export const RELATIONSHIP_TYPES = {
  // Relacionamentos obrigatórios (validação crítica)
  REQUIRED: {
    CHARACTER_PEOPLE: 'character_people',
    CHARACTER_LANGUAGE: 'character_language',
    PEOPLE_LANGUAGE: 'people_language',
    EVENT_ERA: 'event_era',
    RELIGION_TRADITION: 'religion_tradition',
    REGION_LOCATION: 'region_location'
  },
  
  // Relacionamentos opcionais (sugestões)
  OPTIONAL: {
    CHARACTER_LOCATION: 'character_location',
    CHARACTER_UNKNOWN: 'character_unknown',
    LOCATION_RESOURCES: 'location_resources',
    PEOPLE_REGION: 'people_region',
    MAGIC_TECHNOLOGY: 'magic_technology',
    GOVERNMENT_ECONOMY: 'government_economy'
  },
  
  // Relacionamentos contextuais (baseados em regras)
  CONTEXTUAL: {
    LOCATION_CLIMATE: 'location_climate',
    PEOPLE_CULTURE: 'people_culture',
    TECHNOLOGY_ERA: 'technology_era',
    RELIGION_CULTURE: 'religion_culture'
  }
};

// Regras de validação para cada tipo de relacionamento
export const VALIDATION_RULES = {
  [RELATIONSHIP_TYPES.REQUIRED.CHARACTER_PEOPLE]: {
    description: 'Personagem deve pertencer a um povo',
    validation: (character, worldData) => {
      if (!character.peopleId && character.peopleId !== 'unknown') {
        return {
          valid: false,
          message: 'Personagem deve estar associado a um povo ou marcado como "desconhecido"',
          suggestions: worldData.peoples?.map(p => ({ id: p.id, name: p.name })) || []
        };
      }
      return { valid: true };
    }
  },
  
  [RELATIONSHIP_TYPES.REQUIRED.CHARACTER_LANGUAGE]: {
    description: 'Personagem deve falar pelo menos um idioma',
    validation: (character, worldData) => {
      if (!character.languageIds || character.languageIds.length === 0) {
        return {
          valid: false,
          message: 'Personagem deve falar pelo menos um idioma',
          suggestions: worldData.languages?.map(l => ({ id: l.id, name: l.name })) || []
        };
      }
      return { valid: true };
    }
  },
  
  [RELATIONSHIP_TYPES.REQUIRED.PEOPLE_LANGUAGE]: {
    description: 'Povo deve ter pelo menos um idioma nativo',
    validation: (people, worldData) => {
      if (!people.nativeLanguageIds || people.nativeLanguageIds.length === 0) {
        return {
          valid: false,
          message: 'Povo deve ter pelo menos um idioma nativo',
          suggestions: worldData.languages?.map(l => ({ id: l.id, name: l.name })) || []
        };
      }
      return { valid: true };
    }
  },
  
  [RELATIONSHIP_TYPES.REQUIRED.EVENT_ERA]: {
    description: 'Evento deve estar associado a uma era',
    validation: (event, worldData) => {
      if (!event.eraId) {
        return {
          valid: false,
          message: 'Evento deve estar associado a uma era',
          suggestions: worldData.eras?.map(e => ({ id: e.id, name: e.name })) || []
        };
      }
      return { valid: true };
    }
  },
  
  [RELATIONSHIP_TYPES.REQUIRED.RELIGION_TRADITION]: {
    description: 'Religião deve estar relacionada a tradições',
    validation: (religion, worldData) => {
      if (!religion.traditionIds || religion.traditionIds.length === 0) {
        return {
          valid: false,
          message: 'Religião deve estar relacionada a pelo menos uma tradição',
          suggestions: worldData.traditions?.map(t => ({ id: t.id, name: t.name })) || []
        };
      }
      return { valid: true };
    }
  },
  
  [RELATIONSHIP_TYPES.REQUIRED.REGION_LOCATION]: {
    description: 'Região deve conter pelo menos um local',
    validation: (region, worldData) => {
      if (!region.locationIds || region.locationIds.length === 0) {
        return {
          valid: false,
          message: 'Região deve conter pelo menos um local',
          suggestions: worldData.locations?.map(l => ({ id: l.id, name: l.name })) || []
        };
      }
      return { valid: true };
    }
  }
};

// Classe principal do sistema de interdependências
export class InterdependencySystem {
  constructor(worldData, aiService) {
    this.worldData = worldData;
    this.aiService = aiService;
    this.validationCache = new Map();
    this.relationshipGraph = new Map();
    this.initializeGraph();
  }

  // Inicializa o grafo de relacionamentos
  initializeGraph() {
    this.buildRelationshipGraph();
  }

  // Constrói o grafo de relacionamentos baseado nos dados atuais
  buildRelationshipGraph() {
    this.relationshipGraph.clear();
    
    // Adiciona todos os elementos ao grafo
    this.addElementsToGraph();
    
    // Estabelece relacionamentos existentes
    this.establishExistingRelationships();
  }

  // Adiciona elementos ao grafo
  addElementsToGraph() {
    // Personagens
    this.worldData.characters?.forEach(char => {
      this.relationshipGraph.set(`character_${char.id}`, {
        type: 'character',
        data: char,
        relationships: new Set()
      });
    });

    // Povos
    this.worldData.peoples?.forEach(people => {
      this.relationshipGraph.set(`people_${people.id}`, {
        type: 'people',
        data: people,
        relationships: new Set()
      });
    });

    // Idiomas
    this.worldData.languages?.forEach(lang => {
      this.relationshipGraph.set(`language_${lang.id}`, {
        type: 'language',
        data: lang,
        relationships: new Set()
      });
    });

    // Locais
    this.worldData.locations?.forEach(location => {
      this.relationshipGraph.set(`location_${location.id}`, {
        type: 'location',
        data: location,
        relationships: new Set()
      });
    });

    // Regiões
    this.worldData.regions?.forEach(region => {
      this.relationshipGraph.set(`region_${region.id}`, {
        type: 'region',
        data: region,
        relationships: new Set()
      });
    });

    // Eventos
    this.worldData.events?.forEach(event => {
      this.relationshipGraph.set(`event_${event.id}`, {
        type: 'event',
        data: event,
        relationships: new Set()
      });
    });

    // Eras
    this.worldData.eras?.forEach(era => {
      this.relationshipGraph.set(`era_${era.id}`, {
        type: 'era',
        data: era,
        relationships: new Set()
      });
    });

    // Religiões
    this.worldData.religions?.forEach(religion => {
      this.relationshipGraph.set(`religion_${religion.id}`, {
        type: 'religion',
        data: religion,
        relationships: new Set()
      });
    });

    // Tradições
    this.worldData.traditions?.forEach(tradition => {
      this.relationshipGraph.set(`tradition_${tradition.id}`, {
        type: 'tradition',
        data: tradition,
        relationships: new Set()
      });
    });
  }

  // Estabelece relacionamentos existentes
  establishExistingRelationships() {
    // Relacionamentos de personagens
    this.worldData.characters?.forEach(char => {
      if (char.peopleId) {
        this.addRelationship(`character_${char.id}`, `people_${char.peopleId}`, 'belongs_to');
      }
      if (char.languageIds) {
        char.languageIds.forEach(langId => {
          this.addRelationship(`character_${char.id}`, `language_${langId}`, 'speaks');
        });
      }
      if (char.locationId) {
        this.addRelationship(`character_${char.id}`, `location_${char.locationId}`, 'lives_in');
      }
    });

    // Relacionamentos de povos
    this.worldData.peoples?.forEach(people => {
      if (people.nativeLanguageIds) {
        people.nativeLanguageIds.forEach(langId => {
          this.addRelationship(`people_${people.id}`, `language_${langId}`, 'native_speaks');
        });
      }
      if (people.regionId) {
        this.addRelationship(`people_${people.id}`, `region_${people.regionId}`, 'inhabits');
      }
    });

    // Relacionamentos de eventos
    this.worldData.events?.forEach(event => {
      if (event.eraId) {
        this.addRelationship(`event_${event.id}`, `era_${event.eraId}`, 'happened_in');
      }
    });

    // Relacionamentos de religiões
    this.worldData.religions?.forEach(religion => {
      if (religion.traditionIds) {
        religion.traditionIds.forEach(tradId => {
          this.addRelationship(`religion_${religion.id}`, `tradition_${tradId}`, 'practices');
        });
      }
    });

    // Relacionamentos de regiões
    this.worldData.regions?.forEach(region => {
      if (region.locationIds) {
        region.locationIds.forEach(locId => {
          this.addRelationship(`region_${region.id}`, `location_${locId}`, 'contains');
        });
      }
    });
  }

  // Adiciona um relacionamento ao grafo
  addRelationship(sourceId, targetId, relationshipType) {
    const source = this.relationshipGraph.get(sourceId);
    const target = this.relationshipGraph.get(targetId);
    
    if (source && target) {
      source.relationships.add({
        target: targetId,
        type: relationshipType,
        bidirectional: true
      });
      
      target.relationships.add({
        target: sourceId,
        type: relationshipType,
        bidirectional: true
      });
    }
  }

  // Valida um elemento específico
  async validateElement(elementType, elementData) {
    const validations = [];
    
    // Aplica regras de validação baseadas no tipo
    switch (elementType) {
      case 'character':
        validations.push(
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.CHARACTER_PEOPLE, elementData),
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.CHARACTER_LANGUAGE, elementData)
        );
        break;
        
      case 'people':
        validations.push(
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.PEOPLE_LANGUAGE, elementData)
        );
        break;
        
      case 'event':
        validations.push(
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.EVENT_ERA, elementData)
        );
        break;
        
      case 'religion':
        validations.push(
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.RELIGION_TRADITION, elementData)
        );
        break;
        
      case 'region':
        validations.push(
          this.validateRelationship(RELATIONSHIP_TYPES.REQUIRED.REGION_LOCATION, elementData)
        );
        break;
    }

    // Executa validações
    const results = await Promise.all(validations);
    return this.aggregateValidationResults(results);
  }

  // Valida um relacionamento específico
  validateRelationship(relationshipType, elementData) {
    const rule = VALIDATION_RULES[relationshipType];
    if (!rule) return Promise.resolve({ valid: true });

    return Promise.resolve(rule.validation(elementData, this.worldData));
  }

  // Agrega resultados de validação
  aggregateValidationResults(results) {
    const allValid = results.every(r => r.valid);
    const suggestions = results
      .filter(r => !r.valid && r.suggestions)
      .flatMap(r => r.suggestions);

    return {
      valid: allValid,
      issues: results.filter(r => !r.valid),
      suggestions: this.deduplicateSuggestions(suggestions),
      score: this.calculateValidationScore(results)
    };
  }

  // Remove sugestões duplicadas
  deduplicateSuggestions(suggestions) {
    const seen = new Set();
    return suggestions.filter(s => {
      const key = `${s.id}_${s.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Calcula score de validação
  calculateValidationScore(results) {
    const total = results.length;
    const valid = results.filter(r => r.valid).length;
    return total > 0 ? (valid / total) * 100 : 100;
  }

  // Gera sugestões inteligentes usando AI
  async generateIntelligentSuggestions(elementType, elementData, context = {}) {
    const prompt = this.buildSuggestionPrompt(elementType, elementData, context);
    
    try {
      const response = await this.aiService.generateText(prompt);
      const suggestions = this.parseSuggestions(response);
      return suggestions;
    } catch (error) {
      console.error('Erro ao gerar sugestões inteligentes:', error);
      return this.generateFallbackSuggestions(elementType, elementData);
    }
  }

  // Constrói prompt para sugestões
  buildSuggestionPrompt(elementType, elementData, context) {
    const worldContext = this.buildWorldContext();
    
    return `Como especialista em world-building, analise o seguinte elemento e sugira relacionamentos apropriados:

ELEMENTO:
Tipo: ${elementType}
Dados: ${JSON.stringify(elementData, null, 2)}

CONTEXTO DO MUNDO:
${worldContext}

CONTEXTO ADICIONAL:
${JSON.stringify(context, null, 2)}

REGRAS DE RELACIONAMENTO:
${this.getRelationshipRules(elementType)}

Sugira relacionamentos apropriados considerando:
1. Consistência com o mundo existente
2. Lógica narrativa
3. Riqueza cultural
4. Possibilidades de desenvolvimento de história

Responda em JSON:
{
  "suggestions": [
    {
      "type": "relationship_type",
      "targetType": "target_element_type",
      "reasoning": "explicação da sugestão",
      "priority": "high|medium|low"
    }
  ],
  "warnings": ["possíveis problemas"],
  "opportunities": ["oportunidades narrativas"]
}`;
  }

  // Constrói contexto do mundo
  buildWorldContext() {
    return {
      name: this.worldData.name,
      genre: this.worldData.genre,
      techLevel: this.worldData.techLevel,
      description: this.worldData.description,
      existingElements: {
        characters: this.worldData.characters?.length || 0,
        peoples: this.worldData.peoples?.length || 0,
        languages: this.worldData.languages?.length || 0,
        locations: this.worldData.locations?.length || 0,
        regions: this.worldData.regions?.length || 0,
        events: this.worldData.events?.length || 0,
        eras: this.worldData.eras?.length || 0,
        religions: this.worldData.religions?.length || 0,
        traditions: this.worldData.traditions?.length || 0
      }
    };
  }

  // Obtém regras de relacionamento para um tipo
  getRelationshipRules(elementType) {
    const rules = {
      character: [
        'Deve pertencer a um povo (obrigatório)',
        'Deve falar pelo menos um idioma (obrigatório)',
        'Pode viver em um local específico (opcional)',
        'Pode ter relacionamentos com outros personagens (opcional)'
      ],
      people: [
        'Deve ter pelo menos um idioma nativo (obrigatório)',
        'Pode habitar uma região específica (opcional)',
        'Pode ter tradições culturais (opcional)'
      ],
      event: [
        'Deve estar associado a uma era (obrigatório)',
        'Pode envolver personagens específicos (opcional)',
        'Pode ocorrer em locais específicos (opcional)'
      ],
      religion: [
        'Deve estar relacionada a tradições (obrigatório)',
        'Pode ser praticada por povos específicos (opcional)',
        'Pode ter locais sagrados (opcional)'
      ],
      region: [
        'Deve conter pelo menos um local (obrigatório)',
        'Pode ser habitada por povos específicos (opcional)',
        'Pode ter recursos naturais (opcional)'
      ]
    };

    return rules[elementType] || [];
  }

  // Analisa sugestões da resposta da AI
  parseSuggestions(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        suggestions: parsed.suggestions || [],
        warnings: parsed.warnings || [],
        opportunities: parsed.opportunities || []
      };
    } catch (error) {
      console.error('Erro ao analisar sugestões:', error);
      return { suggestions: [], warnings: [], opportunities: [] };
    }
  }

  // Gera sugestões de fallback
  generateFallbackSuggestions(elementType, elementData) {
    const suggestions = [];
    
    switch (elementType) {
      case 'character':
        if (this.worldData.peoples?.length > 0) {
          suggestions.push({
            type: 'belongs_to',
            targetType: 'people',
            reasoning: 'Personagem deve pertencer a um povo',
            priority: 'high',
            options: this.worldData.peoples.map(p => ({ id: p.id, name: p.name }))
          });
        }
        if (this.worldData.languages?.length > 0) {
          suggestions.push({
            type: 'speaks',
            targetType: 'language',
            reasoning: 'Personagem deve falar pelo menos um idioma',
            priority: 'high',
            options: this.worldData.languages.map(l => ({ id: l.id, name: l.name }))
          });
        }
        break;
        
      case 'people':
        if (this.worldData.languages?.length > 0) {
          suggestions.push({
            type: 'native_speaks',
            targetType: 'language',
            reasoning: 'Povo deve ter pelo menos um idioma nativo',
            priority: 'high',
            options: this.worldData.languages.map(l => ({ id: l.id, name: l.name }))
          });
        }
        break;
        
      case 'event':
        if (this.worldData.eras?.length > 0) {
          suggestions.push({
            type: 'happened_in',
            targetType: 'era',
            reasoning: 'Evento deve estar associado a uma era',
            priority: 'high',
            options: this.worldData.eras.map(e => ({ id: e.id, name: e.name }))
          });
        }
        break;
        
      case 'religion':
        if (this.worldData.traditions?.length > 0) {
          suggestions.push({
            type: 'practices',
            targetType: 'tradition',
            reasoning: 'Religião deve estar relacionada a tradições',
            priority: 'high',
            options: this.worldData.traditions.map(t => ({ id: t.id, name: t.name }))
          });
        }
        break;
        
      case 'region':
        if (this.worldData.locations?.length > 0) {
          suggestions.push({
            type: 'contains',
            targetType: 'location',
            reasoning: 'Região deve conter pelo menos um local',
            priority: 'high',
            options: this.worldData.locations.map(l => ({ id: l.id, name: l.name }))
          });
        }
        break;
    }

    return { suggestions, warnings: [], opportunities: [] };
  }

  // Valida todo o mundo
  async validateWorld() {
    const validations = [];
    
    // Valida personagens
    this.worldData.characters?.forEach(char => {
      validations.push(this.validateElement('character', char));
    });

    // Valida povos
    this.worldData.peoples?.forEach(people => {
      validations.push(this.validateElement('people', people));
    });

    // Valida eventos
    this.worldData.events?.forEach(event => {
      validations.push(this.validateElement('event', event));
    });

    // Valida religiões
    this.worldData.religions?.forEach(religion => {
      validations.push(this.validateElement('religion', religion));
    });

    // Valida regiões
    this.worldData.regions?.forEach(region => {
      validations.push(this.validateElement('region', region));
    });

    const results = await Promise.all(validations);
    return this.aggregateWorldValidationResults(results);
  }

  // Agrega resultados de validação do mundo
  aggregateWorldValidationResults(results) {
    const totalElements = results.length;
    const validElements = results.filter(r => r.valid).length;
    const allIssues = results.flatMap(r => r.issues || []);
    const allSuggestions = results.flatMap(r => r.suggestions || []);

    return {
      overallScore: totalElements > 0 ? (validElements / totalElements) * 100 : 100,
      totalElements,
      validElements,
      invalidElements: totalElements - validElements,
      issues: allIssues,
      suggestions: this.deduplicateSuggestions(allSuggestions),
      healthStatus: this.calculateHealthStatus(validElements, totalElements)
    };
  }

  // Calcula status de saúde do mundo
  calculateHealthStatus(validElements, totalElements) {
    const percentage = totalElements > 0 ? (validElements / totalElements) * 100 : 100;
    
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 50) return 'fair';
    return 'poor';
  }

  // Atualiza dados do mundo
  updateWorldData(newWorldData) {
    this.worldData = newWorldData;
    this.initializeGraph();
  }

  // Obtém relacionamentos de um elemento
  getElementRelationships(elementId, elementType) {
    const nodeId = `${elementType}_${elementId}`;
    const node = this.relationshipGraph.get(nodeId);
    
    if (!node) return [];

    return Array.from(node.relationships).map(rel => {
      const targetNode = this.relationshipGraph.get(rel.target);
      return {
        type: rel.type,
        targetElement: targetNode?.data,
        targetType: targetNode?.type
      };
    });
  }

  // Obtém elementos relacionados
  getRelatedElements(elementId, elementType, relationshipType = null) {
    const relationships = this.getElementRelationships(elementId, elementType);
    
    if (relationshipType) {
      return relationships.filter(rel => rel.type === relationshipType);
    }
    
    return relationships;
  }

  // Verifica se dois elementos estão relacionados
  areElementsRelated(element1Id, element1Type, element2Id, element2Type) {
    const relationships = this.getElementRelationships(element1Id, element1Type);
    return relationships.some(rel => 
      rel.targetElement?.id === element2Id && rel.targetType === element2Type
    );
  }
}

// Hook React para usar o sistema de interdependências
export const useInterdependencySystem = (worldData, aiService) => {
  const system = new InterdependencySystem(worldData, aiService);
  
  return {
    validateElement: (elementType, elementData) => system.validateElement(elementType, elementData),
    validateWorld: () => system.validateWorld(),
    generateSuggestions: (elementType, elementData, context) => 
      system.generateIntelligentSuggestions(elementType, elementData, context),
    getRelationships: (elementId, elementType) => 
      system.getElementRelationships(elementId, elementType),
    getRelatedElements: (elementId, elementType, relationshipType) => 
      system.getRelatedElements(elementId, elementType, relationshipType),
    areRelated: (element1Id, element1Type, element2Id, element2Type) => 
      system.areElementsRelated(element1Id, element1Type, element2Id, element2Type),
    updateWorldData: (newWorldData) => system.updateWorldData(newWorldData)
  };
};
