# Sistema de Interdependências para World-Building

## Visão Geral

O Sistema de Interdependências é uma solução robusta e avançada para criar e gerenciar relacionamentos entre elementos do world-building. Ele combina validação automática, sugestões inteligentes de AI, e visualização interativa para garantir consistência e riqueza narrativa.

## Arquitetura

### 1. Sistema de Validação
- **Validação Obrigatória**: Relacionamentos críticos que devem existir
- **Validação Opcional**: Sugestões de relacionamentos que enriquecem o mundo
- **Validação Contextual**: Relacionamentos baseados em regras do mundo

### 2. Grafo de Relacionamentos
- Representação visual das conexões entre elementos
- Navegação bidirecional entre elementos relacionados
- Análise de impacto de mudanças

### 3. Integração com AI
- Sugestões inteligentes baseadas no contexto do mundo
- Análise de consistência e oportunidades narrativas
- Resolução automática de conflitos

## Tipos de Relacionamentos

### Relacionamentos Obrigatórios
```javascript
REQUIRED: {
  CHARACTER_PEOPLE: 'character_people',      // Personagem deve pertencer a um povo
  CHARACTER_LANGUAGE: 'character_language',  // Personagem deve falar idioma
  PEOPLE_LANGUAGE: 'people_language',        // Povo deve ter idioma nativo
  EVENT_ERA: 'event_era',                    // Evento deve estar em uma era
  RELIGION_TRADITION: 'religion_tradition',  // Religião deve ter tradições
  REGION_LOCATION: 'region_location'         // Região deve conter locais
}
```

### Relacionamentos Opcionais
```javascript
OPTIONAL: {
  CHARACTER_LOCATION: 'character_location',  // Personagem pode viver em local
  CHARACTER_UNKNOWN: 'character_unknown',    // Personagem pode ser desconhecido
  LOCATION_RESOURCES: 'location_resources',  // Local pode ter recursos
  PEOPLE_REGION: 'people_region',            // Povo pode habitar região
  MAGIC_TECHNOLOGY: 'magic_technology',      // Magia pode afetar tecnologia
  GOVERNMENT_ECONOMY: 'government_economy'   // Governo pode afetar economia
}
```

### Relacionamentos Contextuais
```javascript
CONTEXTUAL: {
  LOCATION_CLIMATE: 'location_climate',      // Local afeta clima
  PEOPLE_CULTURE: 'people_culture',          // Povo define cultura
  TECHNOLOGY_ERA: 'technology_era',          // Tecnologia define era
  RELIGION_CULTURE: 'religion_culture'       // Religião influencia cultura
}
```

## Componentes Principais

### 1. InterdependencySystem
Classe principal que gerencia todo o sistema de interdependências.

```javascript
const system = new InterdependencySystem(worldData, aiService);

// Valida um elemento específico
const validation = await system.validateElement('character', characterData);

// Valida todo o mundo
const worldValidation = await system.validateWorld();

// Gera sugestões inteligentes
const suggestions = await system.generateIntelligentSuggestions('character', characterData);
```

### 2. InterdependencyManager
Componente React para visualização e gerenciamento das interdependências.

**Funcionalidades:**
- Visualização de status de validação
- Lista de elementos com relacionamentos
- Filtros por tipo e busca
- Geração de sugestões inteligentes
- Expansão/colapso de detalhes

### 3. Hook useInterdependencySystem
Hook React para facilitar o uso do sistema.

```javascript
const {
  validateElement,
  validateWorld,
  generateSuggestions,
  getRelationships,
  getRelatedElements,
  areRelated,
  updateWorldData
} = useInterdependencySystem(worldData, aiService);
```

## Prompts de AI

### 1. Análise de Interdependências
```javascript
// Analisa todas as interdependências do mundo
const analysis = await unifiedPromptIntegration.analyzeInterdependencies();
```

### 2. Validação de Relacionamentos
```javascript
// Valida relacionamentos específicos
const validation = await unifiedPromptIntegration.validateRelationships();
```

### 3. Sugestões Inteligentes
```javascript
// Gera sugestões para um elemento
const suggestions = await unifiedPromptIntegration.generateIntelligentSuggestions(
  'character', 
  characterData
);
```

### 4. Resolução de Conflitos
```javascript
// Resolve conflitos entre relacionamentos
const resolution = await unifiedPromptIntegration.resolveConflicts();
```

## Estrutura de Dados

### Elemento com Relacionamentos
```javascript
{
  id: "character_123",
  name: "Aragorn",
  type: "character",
  data: {
    name: "Aragorn",
    peopleId: "people_1",        // Relacionamento obrigatório
    languageIds: ["lang_1"],     // Relacionamento obrigatório
    locationId: "location_1"     // Relacionamento opcional
  },
  relationships: [
    {
      type: "belongs_to",
      targetElement: { id: "people_1", name: "Dúnedain" },
      targetType: "people"
    },
    {
      type: "speaks",
      targetElement: { id: "lang_1", name: "Sindarin" },
      targetType: "language"
    }
  ]
}
```

### Resultado de Validação
```javascript
{
  valid: true,
  issues: [
    {
      type: "missing_required_relationship",
      elementType: "character",
      elementName: "Frodo",
      requiredRelationship: "people",
      message: "Personagem deve pertencer a um povo"
    }
  ],
  suggestions: [
    {
      type: "relationship_suggestion",
      sourceType: "character",
      sourceName: "Frodo",
      targetType: "people",
      targetName: "Hobbits",
      relationshipType: "belongs_to",
      reasoning: "Frodo é claramente um hobbit"
    }
  ],
  score: 85
}
```

## Uso no WorldBuilder

### 1. Acesso via Analytics
Navegue para `Analytics > Interdependências` para acessar o gerenciador.

### 2. Validação Automática
O sistema valida automaticamente todos os elementos quando:
- Um novo elemento é criado
- Um elemento é editado
- O mundo é carregado

### 3. Sugestões Inteligentes
Clique no botão "Gerar Sugestões" em qualquer elemento para receber sugestões de relacionamentos baseadas em AI.

### 4. Visualização de Status
O painel de status mostra:
- Score geral de interdependências
- Número de elementos válidos/inválidos
- Status de saúde do mundo (excellent/good/fair/poor)

## Exemplos de Uso

### 1. Criando um Personagem com Relacionamentos
```javascript
// Ao criar um personagem, o sistema automaticamente sugere:
const character = {
  name: "Legolas",
  peopleId: "people_2",        // Deve pertencer a um povo
  languageIds: ["lang_2"],     // Deve falar idiomas
  locationId: "location_2"     // Pode viver em um local
};

// O sistema valida e sugere relacionamentos
const validation = await interdependencySystem.validateElement('character', character);
```

### 2. Analisando Impacto de Mudanças
```javascript
// Ao remover um povo, o sistema identifica personagens afetados
const affectedCharacters = interdependencySystem.getRelatedElements(
  "people_1", 
  "people", 
  "belongs_to"
);
```

### 3. Gerando Sugestões Narrativas
```javascript
// O sistema sugere oportunidades narrativas
const suggestions = await interdependencySystem.generateIntelligentSuggestions(
  'event',
  eventData
);
```

## Benefícios

### 1. Consistência
- Validação automática de relacionamentos obrigatórios
- Detecção de inconsistências
- Sugestões de correção

### 2. Riqueza Narrativa
- Sugestões de relacionamentos opcionais
- Oportunidades narrativas identificadas
- Desenvolvimento de história facilitado

### 3. Eficiência
- Interface visual intuitiva
- Filtros e busca avançados
- Integração com AI para sugestões

### 4. Flexibilidade
- Sistema extensível para novos tipos de relacionamentos
- Configuração de regras personalizadas
- Adaptação a diferentes gêneros

## Configuração Avançada

### 1. Adicionando Novos Tipos de Relacionamento
```javascript
// Em RELATIONSHIP_TYPES
CUSTOM: {
  CHARACTER_WEAPON: 'character_weapon',
  LOCATION_WEATHER: 'location_weather'
}

// Em VALIDATION_RULES
[RELATIONSHIP_TYPES.CUSTOM.CHARACTER_WEAPON]: {
  description: 'Personagem deve ter uma arma preferida',
  validation: (character, worldData) => {
    // Lógica de validação personalizada
  }
}
```

### 2. Personalizando Prompts de AI
```javascript
// Em promptBank.js
interdependencies: {
  customValidation: `Validação personalizada para seu mundo...`
}
```

### 3. Configurando Regras de Negócio
```javascript
// Regras específicas do seu mundo
const customRules = {
  maxLanguagesPerCharacter: 3,
  requireReligionForPeoples: true,
  allowUnknownOrigins: true
};
```

## Troubleshooting

### 1. Elementos Não Aparecem
- Verifique se os elementos têm IDs únicos
- Confirme que os dados estão no formato correto
- Verifique se o sistema foi inicializado corretamente

### 2. Validações Não Funcionam
- Verifique se as regras de validação estão definidas
- Confirme que os dados de entrada estão completos
- Verifique os logs de erro no console

### 3. Sugestões de AI Não Geram
- Verifique se o serviço de AI está configurado
- Confirme se as chaves de API estão válidas
- Verifique se os prompts estão formatados corretamente

## Próximos Passos

### 1. Melhorias Planejadas
- Visualização de grafo interativo
- Análise de impacto em tempo real
- Sugestões baseadas em machine learning
- Integração com sistemas externos

### 2. Expansões Futuras
- Relacionamentos temporais
- Relacionamentos probabilísticos
- Análise de sentimentos entre elementos
- Geração automática de histórias

### 3. Integrações
- Exportação para ferramentas externas
- Importação de dados de outras fontes
- APIs para integração com outros sistemas
- Plugins para extensibilidade

## Conclusão

O Sistema de Interdependências representa uma evolução significativa no world-building, combinando validação automática, inteligência artificial e interface intuitiva para criar mundos mais ricos, consistentes e narrativamente envolventes.

A arquitetura modular e extensível permite adaptação a diferentes necessidades e gêneros, enquanto a integração com AI fornece sugestões inteligentes que enriquecem o processo criativo.
