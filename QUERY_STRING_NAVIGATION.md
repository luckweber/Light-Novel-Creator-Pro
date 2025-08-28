# Navegação por Query Strings no WorldBuilder

O WorldBuilder agora suporta navegação direta através de query strings na URL, permitindo compartilhar links específicos e navegar programaticamente para abas e configurações específicas.

## Parâmetros Suportados

### Abas Principais
- `tab`: Define a aba principal ativa
  - `overview` - Visão Geral
  - `geography` - Geografia
  - `cultures` - Culturas
  - `systems` - Sistemas
  - `history` - História
  - `characters` - Personagens
  - `analytics` - Analytics

### Subabas
- `subTab`: Define a subaba ativa (depende da aba principal)
  - Para `geography`: `locations`, `regions`, `landmarks`, `resources`
  - Para `cultures`: `peoples`, `languages`, `religions`, `traditions`
  - Para `systems`: `magic`, `technology`, `government`, `economy`
  - Para `history`: `events`, `eras`, `conflicts`
  - Para `characters`: `protagonists`, `antagonists`, `supporting`
  - Para `analytics`: `statistics`, `insights`, `reports`

### Configurações de Visualização
- `viewMode`: Modo de visualização
  - `grid` - Visualização em grade
  - `list` - Visualização em lista

### Filtros e Busca
- `search`: Termo de busca
- `filterType`: Tipo de filtro
  - `all` - Todos os tipos
  - `city` - Cidades
  - `village` - Vilas
  - `castle` - Castelos
  - `forest` - Florestas
  - etc.

### Ordenação
- `sortBy`: Campo para ordenação
  - `name` - Por nome
  - `type` - Por tipo
  - `createdAt` - Por data de criação
- `sortOrder`: Ordem da ordenação
  - `asc` - Crescente (A-Z, mais antigos primeiro)
  - `desc` - Decrescente (Z-A, mais recentes primeiro)

## Exemplos de URLs

### Navegar para Geografia > Locais
```
/world-builder?tab=geography&subTab=locations
```

### Navegar para Culturas > Idiomas com busca
```
/world-builder?tab=cultures&subTab=languages&search=elf&viewMode=list
```

### Navegar para Sistemas > Magia com filtros
```
/world-builder?tab=systems&subTab=magic&filterType=elemental&sortBy=name&sortOrder=asc
```

### Navegar para Personagens > Protagonistas
```
/world-builder?tab=characters&subTab=protagonists&viewMode=grid
```

### Navegar para Analytics > Estatísticas
```
/world-builder?tab=analytics&subTab=statistics
```

## Uso Programático

### JavaScript/React
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegar para uma aba específica
const goToGeography = () => {
  navigate('/world-builder?tab=geography&subTab=locations');
};

// Navegar com busca
const searchLocations = (searchTerm) => {
  navigate(`/world-builder?tab=geography&subTab=locations&search=${encodeURIComponent(searchTerm)}`);
};

// Navegar com filtros e ordenação
const filterAndSort = () => {
  navigate('/world-builder?tab=geography&subTab=locations&filterType=city&sortBy=name&sortOrder=asc&viewMode=grid');
};
```

### Links HTML
```html
<!-- Link direto para locais -->
<a href="/world-builder?tab=geography&subTab=locations">Ver Locais</a>

<!-- Link para busca específica -->
<a href="/world-builder?tab=cultures&subTab=languages&search=ancient">Idiomas Antigos</a>

<!-- Link para sistema mágico -->
<a href="/world-builder?tab=systems&subTab=magic&viewMode=list">Sistemas de Magia</a>
```

## Funcionalidades

### Sincronização Automática
- A URL é automaticamente atualizada quando o usuário navega pela interface
- O estado da aplicação é sincronizado com os parâmetros da URL
- Navegação pelo histórico do navegador funciona corretamente

### Compartilhamento de Links
- Links podem ser compartilhados com configurações específicas
- Bookmarks salvam o estado exato da aplicação
- URLs são limpas e organizadas

### Navegação Responsiva
- Funciona em todos os dispositivos
- Mantém a experiência do usuário consistente
- Suporta navegação por teclado e acessibilidade

## Implementação Técnica

### Hooks Utilizados
- `useLocation`: Para ler os parâmetros da URL
- `useNavigate`: Para atualizar a URL programaticamente
- `useEffect`: Para sincronizar estado com URL

### Funções Principais
- `getUrlParams()`: Extrai parâmetros da URL
- `updateUrlParams()`: Atualiza parâmetros da URL
- `setActiveTabWithSubTab()`: Define aba com atualização de URL
- `setActiveSubTabWithUrl()`: Define subaba com atualização de URL
- `setViewModeWithUrl()`: Define modo de visualização com atualização de URL
- `setSearchTermWithUrl()`: Define termo de busca com atualização de URL
- `setFilterTypeWithUrl()`: Define filtro com atualização de URL
- `setSortWithUrl()`: Define ordenação com atualização de URL

### Sincronização de Estado
```javascript
useEffect(() => {
  const urlParams = getUrlParams();
  
  // Atualiza estado baseado nos parâmetros da URL
  if (urlParams.tab !== activeTab) {
    setActiveTab(urlParams.tab);
  }
  if (urlParams.subTab !== activeSubTab) {
    setActiveSubTab(urlParams.subTab);
  }
  // ... outros parâmetros
}, [location.search]);
```

## Benefícios

1. **Navegação Direta**: Acesso rápido a seções específicas
2. **Compartilhamento**: Links diretos para configurações específicas
3. **Bookmarks**: Salvamento de estados favoritos
4. **Histórico**: Navegação pelo histórico do navegador
5. **Integração**: Fácil integração com outros sistemas
6. **SEO**: URLs mais amigáveis e descritivas
7. **UX**: Melhor experiência do usuário
8. **Acessibilidade**: Navegação por teclado e leitores de tela
