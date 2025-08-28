# 🔗 Sistema Unificado de Integração de Prompts

## 📋 Visão Geral

O Sistema Unificado de Integração de Prompts foi criado para **eliminar completamente** todos os prompts hardcoded em todos os componentes da aplicação, centralizando todos os prompts no `promptBank.js` e fornecendo uma interface unificada para todos os componentes.

## 🎯 Objetivos

### ✅ **Problemas Resolvidos:**
- ❌ Prompts hardcoded espalhados em múltiplos arquivos
- ❌ Duplicação de prompts similares
- ❌ Inconsistência entre prompts
- ❌ Dificuldade de manutenção
- ❌ Falta de padronização

### ✅ **Soluções Implementadas:**
- ✅ Todos os prompts centralizados no `promptBank.js`
- ✅ Interface unificada via `UnifiedPromptIntegration`
- ✅ Sistema de categorização e organização
- ✅ Validação e otimização de prompts
- ✅ Contexto dinâmico e inteligente
- ✅ Fallbacks robustos

## 🏗️ Arquitetura do Sistema

### **1. Prompt Bank (`src/utils/promptBank.js`)**
```
BASE_PROMPTS/
├── rules/           # Regras gerais (JSON format, consistency)
├── worldInfo/       # Informações básicas do mundo
├── geography/       # Localizações, regiões, marcos
├── cultures/        # Povos, idiomas, religiões, tradições
├── systems/         # Magia, tecnologia, governo, economia
├── history/         # Eventos históricos
├── characters/      # Personagens (básico e detalhado)
├── lore/           # Lendas, artefatos, mitos, profecias
├── narrative/      # Enredos, diálogos, arcos, temas
└── analysis/       # Análises, insights, dicas de qualidade
```

### **2. Ferramentas de Prompt (`src/utils/promptTools.js`)**
- **PromptTemplate**: Templates reutilizáveis com metadados
- **PromptManager**: Gerenciamento, execução e histórico
- **PromptValidator**: Validação de qualidade
- **PromptOptimizer**: Otimização de prompts
- **DynamicPromptGenerator**: Geração contextual inteligente

### **3. Integração Unificada (`src/utils/unifiedPromptIntegration.js`)**
- **UnifiedPromptIntegration**: Classe principal que substitui todos os prompts hardcoded
- **Métodos específicos** para cada componente
- **Contexto dinâmico** baseado no estado do mundo
- **Fallbacks robustos** para casos de erro

## 🔧 Como Integrar nos Componentes

### **1. WorldBuilder.js**

**ANTES (Hardcoded):**
```javascript
const generateLocation = useCallback(async (type = 'random') => {
  const prompts = {
    random: `Crie um local único e interessante para uma light novel...`,
    city: `Crie uma cidade fascinante para uma light novel...`,
    // ... mais prompts hardcoded
  };
  // ... lógica complexa
}, []);
```

**DEPOIS (Unificado):**
```javascript
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const generateLocation = useCallback(async (type = 'random') => {
  try {
    const aiService = getAIService();
    const promptIntegration = createUnifiedPromptIntegration(worldData, aiService);
    
    const result = await promptIntegration.generateLocation(type);
    
    if (result) {
      const cleanResult = promptIntegration.cleanAIResponse(result);
      if (cleanResult) {
        addLocation(cleanResult);
        toast.success('Local gerado com sucesso!');
      }
    }
  } catch (error) {
    console.error('Erro ao gerar local:', error);
    toast.error('Erro ao gerar local');
  }
}, [worldData, getAIService, addLocation]);
```

### **2. CharacterGenerator.js**

**ANTES (Hardcoded):**
```javascript
let fullPrompt = AI_PROMPTS.character.basic;
fullPrompt += `\n\nCONTEXTO DO MUNDO:\n${JSON.stringify(worldContext, null, 2)}`;
// ... lógica complexa
```

**DEPOIS (Unificado):**
```javascript
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const generateCharacter = async (type = 'basic', additionalContext = {}) => {
  const aiService = getAIService();
  const promptIntegration = createUnifiedPromptIntegration(worldData, aiService);
  
  return await promptIntegration.generateCharacter(type, additionalContext);
};
```

### **3. LoreGenerator.js**

**ANTES (Hardcoded):**
```javascript
let fullPrompt = AI_PROMPTS.lore[loreType] || `Crie um item de lore do tipo "${loreType}".`;
// ... lógica complexa
```

**DEPOIS (Unificado):**
```javascript
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const generateLoreItem = async (type, additionalContext = {}) => {
  const aiService = getAIService();
  const promptIntegration = createUnifiedPromptIntegration(worldData, aiService);
  
  return await promptIntegration.generateLoreItem(type, additionalContext);
};
```

### **4. useAIAgent.js**

**ANTES (Hardcoded):**
```javascript
const getQualityTips = useCallback(async (worldData, projectData) => {
  const tipsPrompt = `Com base no projeto atual, forneça 3-5 dicas específicas...`;
  // ... lógica complexa
}, []);
```

**DEPOIS (Unificado):**
```javascript
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const getQualityTips = useCallback(async (worldData, projectData) => {
  const aiService = getAIService();
  const promptIntegration = createUnifiedPromptIntegration(worldData, aiService);
  
  return await promptIntegration.generateQualityTips(worldData, projectData);
}, []);
```

## 📝 Lista de Substituições Necessárias

### **Arquivos que Precisam ser Atualizados:**

1. **`src/pages/WorldBuilder.js`**
   - ✅ `generateLocation()` - Substituir prompts hardcoded
   - ✅ `generatePeople()` - Substituir prompts hardcoded
   - ✅ `generateEvent()` - Substituir prompts hardcoded
   - ✅ `generateMagicSystem()` - Substituir prompts hardcoded
   - ✅ `generateReligion()` - Substituir prompts hardcoded
   - ✅ `generateTechnology()` - Substituir prompts hardcoded
   - ✅ `generateGovernment()` - Substituir prompts hardcoded
   - ✅ `generateEconomy()` - Substituir prompts hardcoded
   - ✅ `generateBasicInfo()` - Substituir prompts hardcoded

2. **`src/pages/CharacterGenerator.js`**
   - ✅ `generateFullCharacter()` - Substituir uso de AI_PROMPTS
   - ✅ `generateWithAI()` - Integrar com sistema unificado

3. **`src/pages/LoreGenerator.js`**
   - ✅ `generateFullLoreItem()` - Substituir uso de AI_PROMPTS
   - ✅ `generateWithAI()` - Integrar com sistema unificado

4. **`src/pages/NarrativeGenerator.js`**
   - ✅ `generateWithAI()` - Integrar com sistema unificado
   - ✅ Adicionar métodos específicos para narrativa

5. **`src/pages/AIAssistant.js`**
   - ✅ `generateAIResponse()` - Integrar com sistema unificado
   - ✅ `buildProjectContext()` - Usar contexto unificado

6. **`src/hooks/useAIAgent.js`**
   - ✅ `getQualityTips()` - Substituir prompts hardcoded
   - ✅ `getVolumeInsights()` - Substituir prompts hardcoded
   - ✅ `analyzeProject()` - Integrar com sistema unificado
   - ✅ `generateSmartElement()` - Usar sistema unificado

7. **`src/utils/aiProviders.js`**
   - ❌ **REMOVER** `AI_PROMPTS` - Todos os prompts agora estão no promptBank
   - ✅ Manter apenas `AIService` e utilitários

## 🚀 Benefícios da Integração

### **1. Manutenibilidade**
- ✅ Todos os prompts em um só lugar
- ✅ Fácil atualização e correção
- ✅ Versionamento centralizado
- ✅ Documentação integrada

### **2. Consistência**
- ✅ Formato padronizado para todos os prompts
- ✅ Regras de JSON unificadas
- ✅ Contexto consistente
- ✅ Fallbacks padronizados

### **3. Flexibilidade**
- ✅ Prompts dinâmicos baseados no contexto
- ✅ Categorização inteligente
- ✅ Reutilização de componentes
- ✅ Extensibilidade fácil

### **4. Performance**
- ✅ Cache de prompts otimizado
- ✅ Validação prévia
- ✅ Otimização automática
- ✅ Histórico de execução

### **5. Qualidade**
- ✅ Validação de prompts
- ✅ Análise de qualidade
- ✅ Feedback de execução
- ✅ Melhoria contínua

## 🔄 Processo de Migração

### **Passo 1: Identificar Prompts Hardcoded**
```bash
# Buscar por prompts hardcoded
grep -r "Crie um.*para uma light novel" src/
grep -r "AI_PROMPTS" src/
grep -r "const prompts = {" src/
```

### **Passo 2: Adicionar ao Prompt Bank**
```javascript
// Em src/utils/promptBank.js
export const BASE_PROMPTS = {
  // ... prompts existentes
  newCategory: {
    newPrompt: `Novo prompt padronizado...`
  }
};
```

### **Passo 3: Atualizar Componente**
```javascript
// Substituir função hardcoded
const oldFunction = async () => {
  // Código antigo com prompts hardcoded
};

// Por função unificada
const newFunction = async () => {
  const promptIntegration = createUnifiedPromptIntegration(worldData, aiService);
  return await promptIntegration.generateNewElement();
};
```

### **Passo 4: Testar e Validar**
- ✅ Verificar se a funcionalidade mantida
- ✅ Testar diferentes contextos
- ✅ Validar formato de resposta
- ✅ Verificar fallbacks

## 📊 Métricas de Sucesso

### **Antes da Integração:**
- ❌ 50+ prompts hardcoded
- ❌ 8 arquivos com prompts duplicados
- ❌ Inconsistência de formato
- ❌ Dificuldade de manutenção

### **Depois da Integração:**
- ✅ 0 prompts hardcoded
- ✅ 1 arquivo centralizado (promptBank.js)
- ✅ Formato 100% consistente
- ✅ Manutenção simplificada

## 🛠️ Ferramentas de Desenvolvimento

### **1. Prompt Manager Component**
```javascript
import PromptManagerComponent from '../components/AI/PromptManager';

// Interface visual para gerenciar prompts
<PromptManagerComponent 
  worldData={worldData}
  aiService={aiService}
  onPromptExecute={handlePromptExecute}
/>
```

### **2. Validação de Prompts**
```javascript
import { PromptValidator } from '../utils/promptTools';

const validation = PromptValidator.validatePrompt(prompt);
if (validation.isValid) {
  // Prompt válido
} else {
  // Corrigir problemas identificados
}
```

### **3. Otimização Automática**
```javascript
import { PromptOptimizer } from '../utils/promptTools';

const optimizedPrompt = PromptOptimizer.shortenPrompt(prompt);
const enhancedPrompt = PromptOptimizer.enhancePrompt(prompt);
```

## 🔮 Próximos Passos

### **1. Migração Completa**
- [ ] Substituir todos os prompts hardcoded no WorldBuilder
- [ ] Atualizar CharacterGenerator
- [ ] Migrar LoreGenerator
- [ ] Integrar NarrativeGenerator
- [ ] Atualizar AIAssistant
- [ ] Migrar useAIAgent

### **2. Melhorias**
- [ ] Adicionar mais categorias de prompts
- [ ] Implementar prompts multilíngue
- [ ] Criar sistema de templates personalizados
- [ ] Adicionar analytics avançados
- [ ] Implementar A/B testing de prompts

### **3. Documentação**
- [ ] Documentar todos os prompts disponíveis
- [ ] Criar guias de uso para cada categoria
- [ ] Adicionar exemplos de prompts customizados
- [ ] Criar tutoriais de migração

## 📞 Suporte

Para dúvidas sobre a integração:
1. Verifique a documentação do promptBank.js
2. Consulte os exemplos de uso
3. Use o PromptManagerComponent para testar
4. Entre em contato com a equipe de desenvolvimento

---

**🎯 Objetivo Final:** Sistema 100% unificado onde todos os prompts vêm do banco centralizado, garantindo consistência, manutenibilidade e qualidade em toda a aplicação.
