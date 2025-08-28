import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Link, 
  Unlink,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Star,
  Heart,
  Globe,
  MessageSquare,
  Crown,
  Zap,
  Coins,
  Sparkles,
  Book,
  Target,
  Layers,
  Navigation,
  Gem
} from 'lucide-react';
import { useInterdependencySystem, RELATIONSHIP_TYPES } from '../../utils/interdependencySystem';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

const InterdependencyManager = () => {
  const { worldData, characters, aiService } = useStore();
  const [selectedElement, setSelectedElement] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showValidation, setShowValidation] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedElements, setExpandedElements] = useState(new Set());

  // Inicializa o sistema de interdependências
  const interdependencySystem = useInterdependencySystem(worldData, aiService);

  // Mapeamento de ícones por tipo
  const typeIcons = {
    character: Users,
    people: Users,
    language: MessageSquare,
    location: MapPin,
    region: Layers,
    event: Calendar,
    era: Book,
    religion: Star,
    tradition: Heart,
    magicSystem: Sparkles,
    technology: Zap,
    government: Crown,
    economy: Coins,
    landmark: Navigation,
    resource: Gem
  };

  // Mapeamento de cores por tipo
  const typeColors = {
    character: 'bg-green-100 text-green-600',
    people: 'bg-blue-100 text-blue-600',
    language: 'bg-purple-100 text-purple-600',
    location: 'bg-orange-100 text-orange-600',
    region: 'bg-indigo-100 text-indigo-600',
    event: 'bg-red-100 text-red-600',
    era: 'bg-yellow-100 text-yellow-600',
    religion: 'bg-pink-100 text-pink-600',
    tradition: 'bg-teal-100 text-teal-600',
    magicSystem: 'bg-violet-100 text-violet-600',
    technology: 'bg-cyan-100 text-cyan-600',
    government: 'bg-amber-100 text-amber-600',
    economy: 'bg-emerald-100 text-emerald-600',
    landmark: 'bg-rose-100 text-rose-600',
    resource: 'bg-sky-100 text-sky-600'
  };

  // Valida o mundo quando o componente monta
  useEffect(() => {
    validateWorld();
  }, [worldData]);

  // Valida todo o mundo
  const validateWorld = async () => {
    setIsValidating(true);
    try {
      const results = await interdependencySystem.validateWorld();
      setValidationResults(results);
    } catch (error) {
      console.error('Erro ao validar mundo:', error);
      toast.error('Erro ao validar interdependências');
    } finally {
      setIsValidating(false);
    }
  };

  // Obtém todos os elementos do mundo
  const allElements = useMemo(() => {
    const elements = [];
    
    // Personagens
    characters?.forEach(char => {
      elements.push({
        id: char.id,
        name: char.name,
        type: 'character',
        data: char,
        relationships: interdependencySystem.getRelationships(char.id, 'character')
      });
    });

    // Povos
    worldData.peoples?.forEach(people => {
      elements.push({
        id: people.id,
        name: people.name,
        type: 'people',
        data: people,
        relationships: interdependencySystem.getRelationships(people.id, 'people')
      });
    });

    // Idiomas
    worldData.languages?.forEach(language => {
      elements.push({
        id: language.id,
        name: language.name,
        type: 'language',
        data: language,
        relationships: interdependencySystem.getRelationships(language.id, 'language')
      });
    });

    // Locais
    worldData.locations?.forEach(location => {
      elements.push({
        id: location.id,
        name: location.name,
        type: 'location',
        data: location,
        relationships: interdependencySystem.getRelationships(location.id, 'location')
      });
    });

    // Regiões
    worldData.regions?.forEach(region => {
      elements.push({
        id: region.id,
        name: region.name,
        type: 'region',
        data: region,
        relationships: interdependencySystem.getRelationships(region.id, 'region')
      });
    });

    // Eventos
    worldData.events?.forEach(event => {
      elements.push({
        id: event.id,
        name: event.name,
        type: 'event',
        data: event,
        relationships: interdependencySystem.getRelationships(event.id, 'event')
      });
    });

    // Eras
    worldData.eras?.forEach(era => {
      elements.push({
        id: era.id,
        name: era.name,
        type: 'era',
        data: era,
        relationships: interdependencySystem.getRelationships(era.id, 'era')
      });
    });

    // Religiões
    worldData.religions?.forEach(religion => {
      elements.push({
        id: religion.id,
        name: religion.name,
        type: 'religion',
        data: religion,
        relationships: interdependencySystem.getRelationships(religion.id, 'religion')
      });
    });

    // Tradições
    worldData.traditions?.forEach(tradition => {
      elements.push({
        id: tradition.id,
        name: tradition.name,
        type: 'tradition',
        data: tradition,
        relationships: interdependencySystem.getRelationships(tradition.id, 'tradition')
      });
    });

    return elements;
  }, [worldData, characters, interdependencySystem]);

  // Filtra elementos baseado no tipo e termo de busca
  const filteredElements = useMemo(() => {
    let filtered = allElements;

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(element => element.type === filterType);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(element =>
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allElements, filterType, searchTerm]);

  // Alterna expansão de um elemento
  const toggleElementExpansion = (elementId) => {
    setExpandedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  };

  // Gera sugestões para um elemento
  const generateSuggestions = async (element) => {
    try {
      const suggestions = await interdependencySystem.generateSuggestions(
        element.type,
        element.data
      );
      toast.success(`Sugestões geradas para ${element.name}`);
      return suggestions;
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      toast.error('Erro ao gerar sugestões');
    }
  };

  // Renderiza o status de validação
  const renderValidationStatus = () => {
    if (!validationResults) return null;

    const { overallScore, totalElements, validElements, invalidElements, healthStatus } = validationResults;

    const getStatusColor = (status) => {
      switch (status) {
        case 'excellent': return 'text-green-600 bg-green-50';
        case 'good': return 'text-blue-600 bg-blue-50';
        case 'fair': return 'text-yellow-600 bg-yellow-50';
        case 'poor': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'excellent': return <CheckCircle className="h-5 w-5" />;
        case 'good': return <CheckCircle className="h-5 w-5" />;
        case 'fair': return <AlertTriangle className="h-5 w-5" />;
        case 'poor': return <XCircle className="h-5 w-5" />;
        default: return <AlertTriangle className="h-5 w-5" />;
      }
    };

    return (
      <div className={`p-4 rounded-lg border ${getStatusColor(healthStatus)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(healthStatus)}
            <div>
              <h3 className="font-semibold">Status de Interdependências</h3>
              <p className="text-sm opacity-75">
                {validElements} de {totalElements} elementos válidos
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(overallScore)}%</div>
            <div className="text-sm opacity-75">Score Geral</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold text-green-600">{validElements}</div>
            <div>Válidos</div>
          </div>
          <div>
            <div className="font-semibold text-red-600">{invalidElements}</div>
            <div>Inválidos</div>
          </div>
          <div>
            <div className="font-semibold text-blue-600">{totalElements}</div>
            <div>Total</div>
          </div>
        </div>
      </div>
    );
  };

  // Renderiza um elemento
  const renderElement = (element) => {
    const Icon = typeIcons[element.type] || Globe;
    const isExpanded = expandedElements.has(element.id);
    const hasRelationships = element.relationships.length > 0;

    return (
      <div key={element.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${typeColors[element.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{element.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{element.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasRelationships && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Link className="h-3 w-3 mr-1" />
                  {element.relationships.length}
                </span>
              )}
              
              <button
                onClick={() => toggleElementExpansion(element.id)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title={isExpanded ? "Recolher" : "Expandir"}
              >
                {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => generateSuggestions(element)}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                title="Gerar sugestões"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conteúdo expandido */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* Relacionamentos */}
              {hasRelationships ? (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Relacionamentos</h5>
                  <div className="space-y-2">
                    {element.relationships.map((rel, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">{rel.type}:</span>
                        <span className="font-medium">{rel.targetElement?.name}</span>
                        <span className="text-gray-400">({rel.targetType})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Nenhum relacionamento encontrado
                </div>
              )}

              {/* Sugestões */}
              {showSuggestions && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Sugestões</h5>
                  <button
                    onClick={() => generateSuggestions(element)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Gerar Sugestões
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Interdependências</h2>
          <p className="text-gray-600">
            Visualize e gerencie relacionamentos entre elementos do mundo
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={validateWorld}
            disabled={isValidating}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Validando...' : 'Validar Mundo'}
          </button>
        </div>
      </div>

      {/* Status de Validação */}
      {showValidation && renderValidationStatus()}

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* Filtro por tipo */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="character">Personagens</option>
              <option value="people">Povos</option>
              <option value="language">Idiomas</option>
              <option value="location">Locais</option>
              <option value="region">Regiões</option>
              <option value="event">Eventos</option>
              <option value="era">Eras</option>
              <option value="religion">Religiões</option>
              <option value="tradition">Tradições</option>
            </select>
          </div>

          {/* Busca */}
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar elementos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Validação</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showSuggestions}
                onChange={(e) => setShowSuggestions(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Sugestões</span>
            </label>
          </div>
        </div>
      </div>

      {/* Lista de Elementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredElements.map(renderElement)}
      </div>

      {/* Mensagem quando não há elementos */}
      {filteredElements.length === 0 && (
        <div className="text-center py-12">
          <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum elemento encontrado
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Tente ajustar os filtros ou termos de busca'
              : 'Crie elementos no World Builder para começar a ver interdependências'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default InterdependencyManager;
