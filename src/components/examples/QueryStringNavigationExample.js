import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Sparkles, BookOpen, Crown, BarChart3 } from 'lucide-react';

const QueryStringNavigationExample = () => {
  const navigate = useNavigate();

  const navigationExamples = [
    {
      title: 'Geografia',
      icon: MapPin,
      examples: [
        {
          label: 'Locais',
          url: '/world-builder?tab=geography&subTab=locations',
          description: 'Ver todos os locais criados'
        },
        {
          label: 'Regiões',
          url: '/world-builder?tab=geography&subTab=regions',
          description: 'Explorar regiões do mundo'
        },
        {
          label: 'Locais em Grade',
          url: '/world-builder?tab=geography&subTab=locations&viewMode=grid',
          description: 'Visualizar locais em modo grade'
        },
        {
          label: 'Buscar Cidades',
          url: '/world-builder?tab=geography&subTab=locations&search=cidade&filterType=city',
          description: 'Buscar especificamente por cidades'
        }
      ]
    },
    {
      title: 'Culturas',
      icon: Users,
      examples: [
        {
          label: 'Povos',
          url: '/world-builder?tab=cultures&subTab=peoples',
          description: 'Ver todos os povos e raças'
        },
        {
          label: 'Idiomas',
          url: '/world-builder?tab=cultures&subTab=languages',
          description: 'Explorar idiomas do mundo'
        },
        {
          label: 'Religiões',
          url: '/world-builder?tab=cultures&subTab=religions',
          description: 'Sistemas religiosos'
        },
        {
          label: 'Idiomas Antigos',
          url: '/world-builder?tab=cultures&subTab=languages&search=ancient&sortBy=name&sortOrder=asc',
          description: 'Buscar idiomas antigos ordenados'
        }
      ]
    },
    {
      title: 'Sistemas',
      icon: Sparkles,
      examples: [
        {
          label: 'Sistemas de Magia',
          url: '/world-builder?tab=systems&subTab=magic',
          description: 'Explorar sistemas mágicos'
        },
        {
          label: 'Tecnologia',
          url: '/world-builder?tab=systems&subTab=technology',
          description: 'Ver tecnologias do mundo'
        },
        {
          label: 'Governo',
          url: '/world-builder?tab=systems&subTab=government',
          description: 'Sistemas governamentais'
        },
        {
          label: 'Economia',
          url: '/world-builder?tab=systems&subTab=economy',
          description: 'Sistemas econômicos'
        }
      ]
    },
    {
      title: 'História',
      icon: BookOpen,
      examples: [
        {
          label: 'Eventos Históricos',
          url: '/world-builder?tab=history&subTab=events',
          description: 'Ver eventos importantes'
        },
        {
          label: 'Eras',
          url: '/world-builder?tab=history&subTab=eras',
          description: 'Diferentes eras do mundo'
        },
        {
          label: 'Conflitos',
          url: '/world-builder?tab=history&subTab=conflicts',
          description: 'Conflitos históricos'
        }
      ]
    },
    {
      title: 'Personagens',
      icon: Crown,
      examples: [
        {
          label: 'Protagonistas',
          url: '/world-builder?tab=characters&subTab=protagonists',
          description: 'Personagens principais'
        },
        {
          label: 'Antagonistas',
          url: '/world-builder?tab=characters&subTab=antagonists',
          description: 'Personagens antagonistas'
        },
        {
          label: 'Personagens de Apoio',
          url: '/world-builder?tab=characters&subTab=supporting',
          description: 'Personagens secundários'
        }
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      examples: [
        {
          label: 'Estatísticas',
          url: '/world-builder?tab=analytics&subTab=statistics',
          description: 'Ver estatísticas do mundo'
        },
        {
          label: 'Insights',
          url: '/world-builder?tab=analytics&subTab=insights',
          description: 'Análises e insights'
        },
        {
          label: 'Relatórios',
          url: '/world-builder?tab=analytics&subTab=reports',
          description: 'Relatórios detalhados'
        }
      ]
    }
  ];

  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Exemplos de Navegação por Query Strings
        </h1>
        <p className="text-gray-600 text-lg">
          Clique nos links abaixo para ver como a navegação por query strings funciona no WorldBuilder.
          Cada link demonstra uma configuração específica da URL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationExamples.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <IconComponent className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.title}
                </h2>
              </div>
              
              <div className="space-y-3">
                {category.examples.map((example) => (
                  <div key={example.label} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                    <button
                      onClick={() => handleNavigation(example.url)}
                      className="text-left w-full group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {example.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {example.description}
                      </p>
                      <code className="text-xs text-gray-500 mt-2 block bg-gray-50 p-2 rounded">
                        {example.url}
                      </code>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Como Usar Programaticamente
        </h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegar para uma aba específica
const goToGeography = () => {
  navigate('/world-builder?tab=geography&subTab=locations');
};

// Navegar com busca
const searchLocations = (searchTerm) => {
  navigate(\`/world-builder?tab=geography&subTab=locations&search=\${encodeURIComponent(searchTerm)}\`);
};

// Navegar com filtros e ordenação
const filterAndSort = () => {
  navigate('/world-builder?tab=geography&subTab=locations&filterType=city&sortBy=name&sortOrder=asc&viewMode=grid');
};`}
          </pre>
        </div>
      </div>

      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          Benefícios da Navegação por Query Strings
        </h3>
        <ul className="space-y-2 text-green-800">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Navegação Direta:</strong> Acesso rápido a seções específicas
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Compartilhamento:</strong> Links diretos para configurações específicas
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Bookmarks:</strong> Salvamento de estados favoritos
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Histórico:</strong> Navegação pelo histórico do navegador
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Integração:</strong> Fácil integração com outros sistemas
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QueryStringNavigationExample;
