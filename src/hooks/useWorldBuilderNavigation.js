import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Mapeamento de rotas para tabs e subTabs
const routeMapping = {
  '/world-builder/overview': { tab: 'overview', subTab: '' },
  '/world-builder/geography': { tab: 'geography', subTab: '' },
  '/world-builder/geography/locations': { tab: 'geography', subTab: 'locations' },
  '/world-builder/geography/regions': { tab: 'geography', subTab: 'regions' },
  '/world-builder/geography/landmarks': { tab: 'geography', subTab: 'landmarks' },
  '/world-builder/geography/resources': { tab: 'geography', subTab: 'resources' },
  '/world-builder/cultures': { tab: 'cultures', subTab: '' },
  '/world-builder/cultures/peoples': { tab: 'cultures', subTab: 'peoples' },
  '/world-builder/cultures/languages': { tab: 'cultures', subTab: 'languages' },
  '/world-builder/cultures/religions': { tab: 'cultures', subTab: 'religions' },
  '/world-builder/cultures/traditions': { tab: 'cultures', subTab: 'traditions' },
  '/world-builder/systems': { tab: 'systems', subTab: '' },
  '/world-builder/systems/magic': { tab: 'systems', subTab: 'magicSystems' },
  '/world-builder/systems/technology': { tab: 'systems', subTab: 'technologies' },
  '/world-builder/systems/government': { tab: 'systems', subTab: 'governments' },
  '/world-builder/systems/economy': { tab: 'systems', subTab: 'economies' },
  '/world-builder/history': { tab: 'history', subTab: '' },
  '/world-builder/history/events': { tab: 'history', subTab: 'events' },
  '/world-builder/history/eras': { tab: 'history', subTab: 'eras' },
  '/world-builder/analytics': { tab: 'analytics', subTab: '' },
  '/world-builder/analytics/statistics': { tab: 'analytics', subTab: 'statistics' },
  '/world-builder/analytics/relationships': { tab: 'analytics', subTab: 'relationships' }
};

// Mapeamento reverso de tabs/subTabs para rotas
const reverseRouteMapping = {
  overview: '/world-builder/overview',
  geography: {
    '': '/world-builder/geography',
    locations: '/world-builder/geography/locations',
    regions: '/world-builder/geography/regions',
    landmarks: '/world-builder/geography/landmarks',
    resources: '/world-builder/geography/resources'
  },
  cultures: {
    '': '/world-builder/cultures',
    peoples: '/world-builder/cultures/peoples',
    languages: '/world-builder/cultures/languages',
    religions: '/world-builder/cultures/religions',
    traditions: '/world-builder/cultures/traditions'
  },
  systems: {
    '': '/world-builder/systems',
    magicSystems: '/world-builder/systems/magic',
    technologies: '/world-builder/systems/technology',
    governments: '/world-builder/systems/government',
    economies: '/world-builder/systems/economy'
  },
  history: {
    '': '/world-builder/history',
    events: '/world-builder/history/events',
    eras: '/world-builder/history/eras'
  },
  analytics: {
    '': '/world-builder/analytics',
    statistics: '/world-builder/analytics/statistics',
    relationships: '/world-builder/analytics/relationships'
  }
};

export const useWorldBuilderNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extrair tab e subTab da URL atual
  const getCurrentRouteState = useCallback(() => {
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // Se estamos em uma rota aninhada, extrair tab/subTab do mapeamento
    if (routeMapping[pathname]) {
      const { tab, subTab } = routeMapping[pathname];
      return {
        tab,
        subTab,
        viewMode: searchParams.get('viewMode') || 'grid',
        search: searchParams.get('search') || '',
        filterType: searchParams.get('filterType') || 'all',
        sortBy: searchParams.get('sortBy') || 'name',
        sortOrder: searchParams.get('sortOrder') || 'asc'
      };
    }
    
    // Fallback para query strings (compatibilidade)
    return {
      tab: searchParams.get('tab') || 'overview',
      subTab: searchParams.get('subTab') || '',
      viewMode: searchParams.get('viewMode') || 'grid',
      search: searchParams.get('search') || '',
      filterType: searchParams.get('filterType') || 'all',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc'
    };
  }, [location.pathname, location.search]);

  // Navegar para uma seção específica
  const navigateToSection = useCallback((tab, subTab = '') => {
    let targetPath;
    
    if (reverseRouteMapping[tab]) {
      if (typeof reverseRouteMapping[tab] === 'string') {
        targetPath = reverseRouteMapping[tab];
      } else {
        targetPath = reverseRouteMapping[tab][subTab] || reverseRouteMapping[tab][''] || '/world-builder';
      }
    } else {
      // Fallback para query strings
      targetPath = `/world-builder?tab=${tab}${subTab ? `&subTab=${subTab}` : ''}`;
    }
    
    navigate(targetPath);
  }, [navigate]);

  // Navegar com parâmetros adicionais (filtros, busca, etc.)
  const navigateWithParams = useCallback((tab, subTab = '', params = {}) => {
    let targetPath;
    
    if (reverseRouteMapping[tab]) {
      if (typeof reverseRouteMapping[tab] === 'string') {
        targetPath = reverseRouteMapping[tab];
      } else {
        targetPath = reverseRouteMapping[tab][subTab] || reverseRouteMapping[tab][''] || '/world-builder';
      }
    } else {
      // Fallback para query strings
      targetPath = `/world-builder?tab=${tab}${subTab ? `&subTab=${subTab}` : ''}`;
    }
    
    // Adicionar parâmetros como query strings
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.set(key, value);
      }
    });
    
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${targetPath}?${queryString}` : targetPath;
    
    navigate(fullPath);
  }, [navigate]);

  // Atualizar apenas parâmetros (manter rota atual)
  const updateParams = useCallback((params) => {
    const searchParams = new URLSearchParams(location.search);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${location.pathname}?${queryString}` : location.pathname;
    
    navigate(fullPath, { replace: true });
  }, [location.pathname, location.search, navigate]);

  // Verificar se estamos em uma rota específica
  const isCurrentRoute = useCallback((tab, subTab = '') => {
    const currentState = getCurrentRouteState();
    return currentState.tab === tab && currentState.subTab === subTab;
  }, [getCurrentRouteState]);

  return {
    getCurrentRouteState,
    navigateToSection,
    navigateWithParams,
    updateParams,
    isCurrentRoute,
    currentPath: location.pathname,
    currentSearch: location.search
  };
};
