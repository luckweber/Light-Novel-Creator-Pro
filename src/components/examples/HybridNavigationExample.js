import React from 'react';
import { useWorldBuilderNavigation } from '../../hooks/useWorldBuilderNavigation';
import { MapPin, Users, Sparkles, BookOpen, Crown, BarChart3 } from 'lucide-react';

const HybridNavigationExample = () => {
  const {
    getCurrentRouteState,
    navigateToSection,
    navigateWithParams,
    updateParams,
    isCurrentRoute,
    currentPath
  } = useWorldBuilderNavigation();

  const currentState = getCurrentRouteState();

  const navigationExamples = [
    {
      title: 'Geografia',
      icon: MapPin,
      examples: [
        {
          label: 'Locais (Rota Limpa)',
          action: () => navigateToSection('geography', 'locations'),
          description: '/world-builder/geography/locations'
        },
        {
          label: 'Locais com Filtros',
          action: () => navigateWithParams('geography', 'locations', {
            viewMode: 'grid',
            search: 'cidade',
            filterType: 'city'
          }),
          description: '/world-builder/geography/locations?viewMode=grid&search=cidade&filterType=city'
        },
        {
          label: 'Regiões',
          action: () => navigateToSection('geography', 'regions'),
          description: '/world-builder/geography/regions'
        }
      ]
    },
    {
      title: 'Culturas',
      icon: Users,
      examples: [
        {
          label: 'Povos',
          action: () => navigateToSection('cultures', 'peoples'),
          description: '/world-builder/cultures/peoples'
        },
        {
          label: 'Idiomas com Ordenação',
          action: () => navigateWithParams('cultures', 'languages', {
            sortBy: 'name',
            sortOrder: 'asc'
          }),
          description: '/world-builder/cultures/languages?sortBy=name&sortOrder=asc'
        },
        {
          label: 'Religiões',
          action: () => navigateToSection('cultures', 'religions'),
          description: '/world-builder/cultures/religions'
        }
      ]
    },
    {
      title: 'Sistemas',
      icon: Sparkles,
      examples: [
        {
          label: 'Sistemas Mágicos',
          action: () => navigateToSection('systems', 'magicSystems'),
          description: '/world-builder/systems/magic'
        },
        {
          label: 'Tecnologias',
          action: () => navigateToSection('systems', 'technologies'),
          description: '/world-builder/systems/technology'
        },
        {
          label: 'Governos',
          action: () => navigateToSection('systems', 'governments'),
          description: '/world-builder/systems/government'
        }
      ]
    },
    {
      title: 'História',
      icon: BookOpen,
      examples: [
        {
          label: 'Eventos Históricos',
          action: () => navigateToSection('history', 'events'),
          description: '/world-builder/history/events'
        }
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      examples: [
        {
          label: 'Estatísticas',
          action: () => navigateToSection('analytics', 'statistics'),
          description: '/world-builder/analytics/statistics'
        },
        {
          label: 'Relacionamentos',
          action: () => navigateToSection('analytics', 'relationships'),
          description: '/world-builder/analytics/relationships'
        }
      ]
    }
  ];

  const parameterExamples = [
    {
      label: 'Adicionar Busca',
      action: () => updateParams({ search: 'magia' }),
      description: 'Adiciona termo de busca à rota atual'
    },
    {
      label: 'Mudar Modo de Visualização',
      action: () => updateParams({ viewMode: 'list' }),
      description: 'Muda para modo lista mantendo rota'
    },
    {
      label: 'Aplicar Filtro',
      action: () => updateParams({ filterType: 'ancient' }),
      description: 'Aplica filtro à seção atual'
    },
    {
      label: 'Ordenar por Nome',
      action: () => updateParams({ sortBy: 'name', sortOrder: 'desc' }),
      description: 'Ordena por nome decrescente'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Sistema de Navegação Híbrida</h2>
        <p className="text-muted-foreground mb-4">
          Este exemplo demonstra como usar o novo sistema de navegação que combina rotas aninhadas 
          com query strings para uma experiência mais limpa e flexível.
        </p>
        
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Estado Atual:</h3>
          <div className="text-sm space-y-1">
            <div><strong>Rota:</strong> {currentPath}</div>
            <div><strong>Tab:</strong> {currentState.tab}</div>
            <div><strong>SubTab:</strong> {currentState.subTab || 'Nenhuma'}</div>
            <div><strong>Modo:</strong> {currentState.viewMode}</div>
            <div><strong>Busca:</strong> {currentState.search || 'Nenhuma'}</div>
          </div>
        </div>
      </div>

      {/* Exemplos de Navegação por Seção */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Navegação por Seções</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationExamples.map((section) => (
            <div key={section.title} className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-5 h-5" />
                <h4 className="font-semibold">{section.title}</h4>
              </div>
              <div className="space-y-3">
                {section.examples.map((example) => (
                  <div key={example.label} className="space-y-2">
                    <button
                      onClick={example.action}
                      className="w-full text-left p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      <div className="font-medium">{example.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {example.description}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exemplos de Parâmetros */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Atualização de Parâmetros</h3>
        <p className="text-muted-foreground">
          Estes exemplos mostram como atualizar parâmetros (filtros, busca, ordenação) 
          mantendo a rota atual.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parameterExamples.map((example) => (
            <button
              key={example.label}
              onClick={example.action}
              className="text-left p-4 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium">{example.label}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {example.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Verificação de Rotas Ativas */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Verificação de Rotas Ativas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { tab: 'geography', subTab: 'locations', label: 'Locais' },
            { tab: 'cultures', subTab: 'peoples', label: 'Povos' },
            { tab: 'systems', subTab: 'magicSystems', label: 'Magia' },
            { tab: 'analytics', subTab: 'statistics', label: 'Estatísticas' }
          ].map((route) => (
            <div
              key={`${route.tab}-${route.subTab}`}
              className={`p-3 rounded-lg border ${
                isCurrentRoute(route.tab, route.subTab)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="text-sm font-medium">{route.label}</div>
              <div className="text-xs opacity-75">
                {isCurrentRoute(route.tab, route.subTab) ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Benefícios do Sistema Híbrido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">✅ Rotas Aninhadas</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• URLs mais limpas e semânticas</li>
              <li>• Melhor SEO e indexação</li>
              <li>• Navegação mais intuitiva</li>
              <li>• Compartilhamento mais claro</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">✅ Query Strings</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Flexibilidade para filtros complexos</li>
              <li>• Estados temporários (busca, ordenação)</li>
              <li>• Compatibilidade com sistema existente</li>
              <li>• Fácil atualização de parâmetros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridNavigationExample;
