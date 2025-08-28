# Sistema de Prompts Organizado - WorldBuilder

## Visão Geral

Este sistema implementa uma arquitetura organizada e escalável para gerenciamento de prompts de IA no WorldBuilder. Os prompts foram separados em arquivos estruturados com ferramentas avançadas para validação, otimização e execução.

## Estrutura de Arquivos

```
src/utils/
├── promptBank.js          # Banco de prompts organizados por categoria
├── promptTools.js         # Ferramentas avançadas para gerenciamento
└── aiProviders.js         # Provedores de IA (existente)

src/components/AI/
└── PromptManager.js       # Componente React para gerenciar prompts
```

## Arquivos Principais

### 1. `promptBank.js` - Banco de Prompts

**Organização por Categorias:**
- **Geografia**: Locais, regiões, marcos, recursos
- **Culturas**: Povos, idiomas, religiões, tradições
- **Sistemas**: Magia, tecnologia, governo, economia
- **História**: Eventos históricos
- **Informações do Mundo**: Dados básicos do mundo

**Características:**
- Prompts estruturados com regras consistentes
- Formato JSON padronizado
- Instruções claras para a IA
- Categorização por dificuldade e tipo

### 2. `promptTools.js` - Ferramentas Avançadas

**Classes Principais:**

#### `PromptTemplate`
- Template de prompt com variáveis
- Metadados (categoria, dificuldade, tags)
- Validação automática

#### `PromptManager`
- Gerenciamento centralizado de templates
- Histórico de execuções
- Analytics de performance
- Execução de prompts

#### `PromptValidator`
- Validação de prompts
- Verificação de formato
- Sugestões de melhoria

#### `PromptOptimizer`
- Otimização de prompts
- Redução de tamanho
- Melhoria de clareza

#### `DynamicPromptGenerator`
- Geração contextual de prompts
- Análise do estado do mundo
- Prompts inteligentes

### 3. `PromptManager.js` - Interface de Usuário

**Funcionalidades:**
- Visualização de prompts em grid/lista
- Filtros por categoria e busca
- Editor de prompts customizados
- Analytics e histórico
- Validação em tempo real

## Como Usar

### 1. Importação Básica

```javascript
import { BASE_PROMPTS, PromptUtils } from './utils/promptBank';
import { PromptManager, DynamicPromptGenerator } from './utils/promptTools';
```

### 2. Uso Simples de Prompts

```javascript
// Obter prompt básico
const locationPrompt = BASE_PROMPTS.geography.location.random;

// Combinar com contexto
const contextualPrompt = PromptUtils.combineWithContext(locationPrompt, {
  worldName: "Meu Mundo",
  existingElements: [...],
  characters: [...]
});
```

### 3. Uso Avançado com Gerenciador

```javascript
// Criar gerenciador
const promptManager = new PromptManager();

// Registrar template customizado
const customTemplate = new PromptTemplate(
  'meu_prompt',
  'Crie um local único...',
  { worldName: '{worldName}' }
).withMetadata({
  category: 'geography',
  difficulty: 'medium',
  tags: ['custom', 'local']
});

promptManager.registerTemplate(customTemplate);

// Executar prompt
const result = await promptManager.executePrompt('meu_prompt', {
  worldName: 'Mundo Fantástico'
}, aiService);
```

### 4. Gerador Dinâmico

```javascript
const generator = new DynamicPromptGenerator(worldData);

// Gerar prompt contextualizado
const prompt = generator.generateElementPrompt('geography', 'location');

// Gerar prompt inteligente
const smartPrompt = generator.generateSmartPrompt('location');
```

### 5. Componente React

```javascript
import PromptManagerComponent from './components/AI/PromptManager';

<PromptManagerComponent
  worldData={worldData}
  aiService={aiService}
  onPromptExecute={(result, templateName) => {
    console.log('Prompt executado:', templateName, result);
  }}
/>
```

## Vantagens do Sistema

### 1. **Organização**
- Prompts separados por categoria
- Estrutura clara e navegável
- Fácil manutenção e atualização

### 2. **Reutilização**
- Templates reutilizáveis
- Variáveis dinâmicas
- Contexto compartilhado

### 3. **Validação**
- Verificação automática de prompts
- Sugestões de melhoria
- Prevenção de erros

### 4. **Analytics**
- Histórico de execuções
- Métricas de performance
- Taxa de sucesso

### 5. **Flexibilidade**
- Prompts customizados
- Edição em tempo real
- Múltiplos formatos

### 6. **Escalabilidade**
- Fácil adição de novos prompts
- Categorização automática
- Sistema modular

## Migração do Código Existente

### Antes (WorldBuilder.js)
```javascript
const prompt = `Crie um local único e interessante para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome criativo e evocativo
- Tipo de local (cidade, floresta, castelo, etc.)
- Descrição visual detalhada
- História e significado cultural
- Habitantes típicos
- Pontos de interesse importantes
- Atmosfera e sensações únicas

Formato exato:
{
  "name": "Nome do Local",
  "type": "tipo",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`;
```

### Depois (promptBank.js)
```javascript
export const BASE_PROMPTS = {
  geography: {
    location: {
      random: `Crie um local único e interessante para uma light novel.

${BASE_PROMPTS.rules.jsonFormat}

Inclua:
- Nome criativo e evocativo
- Tipo de local (cidade, floresta, castelo, etc.)
- Descrição visual detalhada
- História e significado cultural
- Habitantes típicos
- Pontos de interesse importantes
- Atmosfera e sensações únicas

Formato exato:
{
  "name": "Nome do Local",
  "type": "tipo",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`
    }
  }
};
```

## Próximos Passos

### 1. **Integração com WorldBuilder**
- Substituir prompts hardcoded pelos do banco
- Implementar gerenciador de prompts na interface
- Adicionar analytics de uso

### 2. **Expansão do Banco**
- Mais categorias de prompts
- Prompts específicos por gênero
- Templates para diferentes estilos

### 3. **Melhorias de IA**
- Prompts adaptativos
- Aprendizado com histórico
- Otimização automática

### 4. **Interface Avançada**
- Editor visual de prompts
- Preview de resultados
- Comparação de prompts

## Benefícios para o Desenvolvimento

1. **Manutenibilidade**: Prompts organizados e fáceis de encontrar
2. **Consistência**: Formato padronizado em todo o sistema
3. **Testabilidade**: Prompts isolados e testáveis
4. **Performance**: Cache e otimização automática
5. **Usabilidade**: Interface intuitiva para gerenciamento
6. **Escalabilidade**: Sistema preparado para crescimento

Este sistema transforma o gerenciamento de prompts de uma tarefa manual e propensa a erros em um processo organizado, automatizado e eficiente.
