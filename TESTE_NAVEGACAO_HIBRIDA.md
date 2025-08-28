# Teste do Sistema de Navegação Híbrida

## Como Testar

### 1. Acesse as URLs Diretamente

Teste estas URLs no navegador:

```
http://localhost:3000/world-builder/overview
http://localhost:3000/world-builder/geography/locations
http://localhost:3000/world-builder/systems/magic
http://localhost:3000/world-builder/cultures/peoples
http://localhost:3000/world-builder/analytics/statistics
```

### 2. Use o Componente de Teste

O componente `NavigationTest` foi adicionado temporariamente ao WorldBuilder. Ele mostra:

- **Estado atual da rota**
- **Botões para navegar** entre seções
- **Botões para atualizar parâmetros** (modo de visualização, busca)
- **Status das rotas** (ativo/inativo)

### 3. Verifique o Comportamento

#### ✅ O que deve funcionar:

1. **Navegação por rotas aninhadas**:
   - URLs limpas como `/world-builder/systems/magic`
   - Navegação pelo histórico do navegador
   - Botões voltar/avançar funcionando

2. **Parâmetros como query strings**:
   - `/world-builder/systems/magic?viewMode=grid&search=fire`
   - Atualização de filtros sem mudar a rota
   - Compartilhamento de URLs com filtros

3. **Compatibilidade com sistema antigo**:
   - URLs com query strings ainda funcionam
   - `/world-builder?tab=systems&subTab=magicSystems`

#### ❌ O que pode dar problema:

1. **URL duplicada**: `http://localhost:3000/world-builder/world-builder/systems/magic`
   - **Solução**: Use apenas `http://localhost:3000/world-builder/systems/magic`

2. **Página em branco**: Se a rota não estiver mapeada
   - **Solução**: Verifique se a rota está definida no `App.js`

3. **Erro de console**: Se houver problemas no hook
   - **Solução**: Verifique o console do navegador para erros

## URLs de Teste

### Rotas Aninhadas (Navegação Estrutural)
```
/world-builder/overview
/world-builder/geography/locations
/world-builder/geography/regions
/world-builder/geography/landmarks
/world-builder/geography/resources
/world-builder/cultures/peoples
/world-builder/cultures/languages
/world-builder/cultures/religions
/world-builder/cultures/traditions
/world-builder/systems/magic
/world-builder/systems/technology
/world-builder/systems/government
/world-builder/systems/economy
/world-builder/history/events
/world-builder/analytics/statistics
/world-builder/analytics/relationships
```

### Combinações com Query Strings
```
/world-builder/systems/magic?viewMode=grid
/world-builder/geography/locations?search=cidade&filterType=city
/world-builder/cultures/peoples?sortBy=name&sortOrder=asc
/world-builder/systems/magic?viewMode=list&search=fire&filterType=elemental
```

## Debugging

### 1. Verifique o Console do Navegador
Abra as ferramentas de desenvolvedor (F12) e verifique:
- Erros JavaScript
- Warnings do React
- Logs de navegação

### 2. Verifique o Hook de Navegação
O hook `useWorldBuilderNavigation` deve retornar:
```javascript
{
  getCurrentRouteState: function,
  navigateToSection: function,
  navigateWithParams: function,
  updateParams: function,
  isCurrentRoute: function,
  currentPath: string,
  currentSearch: string
}
```

### 3. Verifique o Mapeamento de Rotas
No arquivo `src/hooks/useWorldBuilderNavigation.js`, verifique se:
- `routeMapping` contém todas as rotas
- `reverseRouteMapping` está correto
- Os IDs das subTabs correspondem aos do `worldBuilderConstants.js`

## Problemas Comuns

### 1. Página em Branco
**Causa**: Rota não mapeada ou erro no componente
**Solução**: 
- Verifique se a rota está no `App.js`
- Verifique o console para erros
- Teste com uma rota conhecida como `/world-builder/overview`

### 2. Navegação Não Funciona
**Causa**: Hook não está sendo usado corretamente
**Solução**:
- Verifique se o `useWorldBuilderNavigation` está importado
- Verifique se as funções estão sendo chamadas
- Teste com o componente `NavigationTest`

### 3. Estado Não Sincroniza
**Causa**: useEffect não está observando as mudanças corretas
**Solução**:
- Verifique as dependências do useEffect
- Verifique se `getCurrentRouteState` está sendo chamado
- Teste navegando manualmente na URL

## Remoção do Componente de Teste

Após confirmar que tudo está funcionando, remova o componente de teste:

1. Remova a importação:
```javascript
// Remover esta linha
import NavigationTest from '../components/examples/NavigationTest';
```

2. Remova o componente do JSX:
```javascript
// Remover estas linhas
{/* Componente de teste de navegação */}
<NavigationTest />
```

3. Delete o arquivo:
```bash
rm src/components/examples/NavigationTest.js
```

## Próximos Passos

1. **Teste todas as rotas** listadas acima
2. **Verifique a navegação** pelo menu lateral
3. **Teste os filtros e busca** em cada seção
4. **Verifique o histórico** do navegador
5. **Teste o compartilhamento** de URLs
6. **Remova o componente de teste** após confirmar funcionamento
