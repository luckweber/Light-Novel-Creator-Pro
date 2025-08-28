# Sistema de Navegação Híbrida - WorldBuilder

## Visão Geral

O sistema de navegação híbrida combina **rotas aninhadas** com **query strings** para oferecer o melhor dos dois mundos: URLs limpas e semânticas para navegação estrutural, e flexibilidade para estados temporários como filtros, busca e ordenação.

## Estrutura de URLs

### Rotas Aninhadas (Navegação Estrutural)
```
/world-builder/overview
/world-builder/geography/locations
/world-builder/geography/regions
/world-builder/cultures/peoples
/world-builder/systems/magic
/world-builder/history/events
/world-builder/analytics/statistics
```

### Query Strings (Estados Temporários)
```
/world-builder/geography/locations?viewMode=grid&search=fire&filterType=city
/world-builder/systems/magic?sortBy=name&sortOrder=desc
/world-builder/cultures/peoples?viewMode=list&search=ancient
```

## Implementação

### 1. Configuração de Rotas (App.js)

```javascript
{/* WorldBuilder com rotas aninhadas */}
<Route path="/world-builder" element={<WorldBuilder />} />
<Route path="/world-builder/overview" element={<WorldBuilder />} />
<Route path="/world-builder/geography" element={<WorldBuilder />} />
<Route path="/world-builder/geography/locations" element={<WorldBuilder />} />
<Route path="/world-builder/geography/regions" element={<WorldBuilder />} />
<Route path="/world-builder/cultures/peoples" element={<WorldBuilder />} />
<Route path="/world-builder/systems/magic" element={<WorldBuilder />} />
// ... outras rotas
```

### 2. Hook de Navegação (useWorldBuilderNavigation.js)

O hook `useWorldBuilderNavigation` fornece funções para:

- **`getCurrentRouteState()`**: Extrai tab/subTab da URL atual
- **`navigateToSection(tab, subTab)`**: Navega para uma seção específica
- **`navigateWithParams(tab, subTab, params)`**: Navega com parâmetros adicionais
- **`updateParams(params)`**: Atualiza apenas parâmetros (mantém rota)
- **`isCurrentRoute(tab, subTab)`**: Verifica se está em uma rota específica

### 3. Mapeamento de Rotas

```javascript
const routeMapping = {
  '/world-builder/geography/locations': { tab: 'geography', subTab: 'locations' },
  '/world-builder/systems/magic': { tab: 'systems', subTab: 'magicSystems' },
  // ...
};

const reverseRouteMapping = {
  geography: {
    locations: '/world-builder/geography/locations',
    regions: '/world-builder/geography/regions',
    // ...
  },
  systems: {
    magicSystems: '/world-builder/systems/magic',
    technologies: '/world-builder/systems/technology',
    // ...
  }
};
```

## Uso Prático

### Navegação Básica
```javascript
const { navigateToSection } = useWorldBuilderNavigation();

// Navegar para locais
navigateToSection('geography', 'locations');

// Navegar para sistemas mágicos
navigateToSection('systems', 'magicSystems');
```

### Navegação com Parâmetros
```javascript
const { navigateWithParams } = useWorldBuilderNavigation();

// Navegar para locais com filtros
navigateWithParams('geography', 'locations', {
  viewMode: 'grid',
  search: 'cidade',
  filterType: 'city'
});
```

### Atualização de Parâmetros
```javascript
const { updateParams } = useWorldBuilderNavigation();

// Adicionar busca à rota atual
updateParams({ search: 'magia' });

// Mudar modo de visualização
updateParams({ viewMode: 'list' });

// Aplicar filtro e ordenação
updateParams({ 
  filterType: 'ancient', 
  sortBy: 'name', 
  sortOrder: 'desc' 
});
```

### Verificação de Rotas Ativas
```javascript
const { isCurrentRoute } = useWorldBuilderNavigation();

// Verificar se está na seção de locais
if (isCurrentRoute('geography', 'locations')) {
  // Renderizar conteúdo específico
}
```

## Benefícios

### ✅ Rotas Aninhadas
- **URLs mais limpas**: `/world-builder/geography/locations` vs `/world-builder?tab=geography&subTab=locations`
- **Melhor SEO**: URLs descritivas para motores de busca
- **Navegação intuitiva**: Estrutura hierárquica clara
- **Compartilhamento claro**: Links mais profissionais
- **Histórico organizado**: Cada seção tem sua própria entrada

### ✅ Query Strings
- **Flexibilidade**: Múltiplos parâmetros simultâneos
- **Estados temporários**: Filtros, busca, ordenação
- **Compatibilidade**: Funciona com sistema existente
- **Fácil atualização**: Parâmetros podem ser modificados independentemente

### ✅ Sistema Híbrido
- **Melhor UX**: Combina clareza estrutural com flexibilidade
- **Manutenibilidade**: Código mais organizado e reutilizável
- **Escalabilidade**: Fácil adicionar novas seções
- **Performance**: Navegação otimizada

## Migração do Sistema Atual

### Compatibilidade
O sistema mantém compatibilidade total com URLs existentes:
- URLs com query strings continuam funcionando
- Navegação existente não é afetada
- Migração gradual é possível

### Estratégia de Migração
1. **Fase 1**: Implementar rotas aninhadas (concluído)
2. **Fase 2**: Atualizar links internos para usar novas rotas
3. **Fase 3**: Migrar bookmarks e links externos
4. **Fase 4**: Remover suporte a query strings (opcional)

## Exemplos de URLs

### Navegação Estrutural
```
/world-builder/overview                    # Visão geral
/world-builder/geography/locations         # Locais
/world-builder/cultures/peoples            # Povos
/world-builder/systems/magic               # Sistemas mágicos
/world-builder/history/events              # Eventos históricos
```

### Estados Temporários
```
/world-builder/geography/locations?viewMode=grid&search=cidade
/world-builder/systems/magic?sortBy=name&sortOrder=desc
/world-builder/cultures/peoples?filterType=ancient&viewMode=list
```

### Combinação Completa
```
/world-builder/geography/locations?viewMode=grid&search=ancient&filterType=city&sortBy=name&sortOrder=asc
```

## Considerações Técnicas

### Performance
- Rotas aninhadas são mais eficientes para navegação
- Query strings são otimizadas para atualizações frequentes
- Hook memoizado para evitar re-renders desnecessários

### Acessibilidade
- URLs descritivas melhoram a experiência para leitores de tela
- Navegação por teclado mais intuitiva
- Histórico do navegador mais organizado

### SEO
- URLs semânticas melhoram o ranking
- Estrutura hierárquica clara para crawlers
- Meta tags podem ser otimizadas por seção

## Conclusão

O sistema de navegação híbrida oferece uma solução elegante que combina a clareza das rotas aninhadas com a flexibilidade das query strings. Esta abordagem proporciona uma melhor experiência do usuário, URLs mais profissionais e uma base sólida para futuras expansões do WorldBuilder.
