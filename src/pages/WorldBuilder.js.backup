import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  BookOpen, 
  Zap,
  Building,
  Mountain,
  TreePine,
  Droplets,
  Castle,
  Home,
  Sparkles,
  Save,
  Download,
  Upload,
  Search,
  Filter,
  Layers,
  Compass,
  Clock,
  Star
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const WorldBuilder = () => {
  const { 
    worldData, 
    updateWorldData, 
    addLocation 
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [locationForm, setLocationForm] = useState({
    name: '',
    type: 'city',
    description: '',
    climate: '',
    population: '',
    culture: '',
    landmarks: '',
    history: '',
    significance: '',
    connections: ''
  });

  const locationTypes = [
    { value: 'city', label: 'Cidade', icon: Building, color: 'bg-blue-100 text-blue-800' },
    { value: 'village', label: 'Vila', icon: Home, color: 'bg-green-100 text-green-800' },
    { value: 'castle', label: 'Castelo', icon: Castle, color: 'bg-purple-100 text-purple-800' },
    { value: 'mountain', label: 'Montanha', icon: Mountain, color: 'bg-gray-100 text-gray-800' },
    { value: 'forest', label: 'Floresta', icon: TreePine, color: 'bg-emerald-100 text-emerald-800' },
    { value: 'river', label: 'Rio', icon: Droplets, color: 'bg-cyan-100 text-cyan-800' },
    { value: 'ruins', label: 'Ruínas', icon: Layers, color: 'bg-orange-100 text-orange-800' },
    { value: 'temple', label: 'Templo', icon: BookOpen, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Globe },
    { id: 'locations', label: 'Locais', icon: MapPin },
    { id: 'cultures', label: 'Culturas', icon: Users },
    { id: 'religions', label: 'Religiões', icon: BookOpen },
    { id: 'magic', label: 'Magia', icon: Zap },
    { id: 'technology', label: 'Tecnologia', icon: Building },
    { id: 'history', label: 'História', icon: Clock },
    { id: 'politics', label: 'Política', icon: Star },
    { id: 'economy', label: 'Economia', icon: Compass },
    { id: 'geography', label: 'Geografia', icon: Mountain }
  ];

  const handleFormChange = (field, value) => {
    setLocationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    
    if (!locationForm.name.trim()) {
      toast.error('Nome do local é obrigatório');
      return;
    }

    if (editingItem) {
      // Update existing location
      const updatedLocations = worldData.locations.map(loc => 
        loc.id === editingItem.id ? { ...locationForm, id: loc.id } : loc
      );
      updateWorldData({ locations: updatedLocations });
      toast.success('Local atualizado!');
    } else {
      // Add new location
      addLocation(locationForm);
      toast.success('Local criado!');
    }

    resetLocationForm();
  };

  const resetLocationForm = () => {
    setLocationForm({
      name: '',
      type: 'city',
      description: '',
      climate: '',
      population: '',
      culture: '',
      landmarks: '',
      history: '',
      significance: '',
      connections: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEditLocation = (location) => {
    setEditingItem(location);
    setLocationForm(location);
    setShowForm(true);
  };

  const handleDeleteLocation = (locationId) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      const updatedLocations = worldData.locations.filter(loc => loc.id !== locationId);
      updateWorldData({ locations: updatedLocations });
      toast.success('Local excluído!');
    }
  };

  const generateWithAI = async (category, field) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponses = {
        location: {
          description: 'Uma cidade majestosa que se ergue contra o horizonte, com torres que tocam as nuvens e ruas que contam histórias de séculos passados.',
          climate: 'Clima temperado com estações bem definidas, verões quentes e invernos frios, perfeito para a agricultura local.',
          culture: 'Cultura rica e diversificada, influenciada por múltiplas civilizações que passaram pela região ao longo dos séculos.',
          history: 'Fundada há mais de mil anos, a cidade cresceu de um pequeno assentamento para um centro de comércio e cultura.',
          significance: 'Ponto estratégico de comércio e centro político da região, guardando segredos antigos em suas fundações.'
        },
        culture: {
          name: 'Cultura dos Ventos',
          description: 'Uma sociedade que valoriza a liberdade e a adaptabilidade, inspirada pelos ventos que moldam suas terras.',
          customs: 'Festivais sazonais celebram as mudanças do vento, com danças e rituais que honram a natureza.',
          values: 'Liberdade individual, harmonia com a natureza, e sabedoria ancestral são os pilares desta cultura.',
          social_structure: 'Sociedade baseada em clãs familiares, com líderes escolhidos por mérito e sabedoria.'
        },
        religion: {
          name: 'Crença dos Antigos',
          description: 'Religião politeísta que venera os espíritos da natureza e os ancestrais que protegem a terra.',
          beliefs: 'Acredita-se que todos os elementos naturais possuem espíritos que devem ser respeitados e honrados.',
          rituals: 'Cerimônias sazonais incluem oferendas aos espíritos e danças rituais para garantir boas colheitas.',
          hierarchy: 'Sacerdotes e xamãs servem como intermediários entre o mundo físico e o espiritual.'
        },
        magic: {
          name: 'Arte dos Elementos',
          description: 'Sistema mágico baseado na manipulação dos quatro elementos fundamentais: terra, água, fogo e ar.',
          rules: 'A magia requer foco mental, gestos específicos e, em alguns casos, materiais raros como catalisadores.',
          limitations: 'O uso excessivo de magia pode causar fadiga mental e física, com consequências perigosas.',
          schools: 'Diferentes escolas de magia se especializam em elementos específicos ou combinações únicas.'
        }
      };

      const response = aiResponses[category]?.[field] || 'Conteúdo gerado com AI';
      
      if (category === 'location') {
        handleFormChange(field, response);
      } else {
        // Handle other categories
        const currentData = worldData[category] || [];
        const newItem = {
          id: Date.now(),
          name: field === 'name' ? response : `Novo ${category}`,
          description: field === 'description' ? response : '',
          [field]: response
        };
        
        updateWorldData({
          [category]: [...currentData, newItem]
        });
      }
      
      toast.success(`${field} gerado com AI!`);
    } catch (error) {
      toast.error('Erro ao gerar com AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredLocations = worldData.locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Locais</p>
              <p className="text-2xl font-bold text-gray-900">{worldData.locations.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Culturas</p>
              <p className="text-2xl font-bold text-gray-900">{worldData.cultures.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Religiões</p>
              <p className="text-2xl font-bold text-gray-900">{worldData.religions.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Sistemas Mágicos</p>
              <p className="text-2xl font-bold text-gray-900">{worldData.magic.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição do Mundo</h3>
          <textarea
            value={worldData.description}
            onChange={(e) => updateWorldData({ description: e.target.value })}
            className="input-field"
            rows={6}
            placeholder="Descreva seu mundo..."
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nome do Mundo</h3>
          <input
            type="text"
            value={worldData.name}
            onChange={(e) => updateWorldData({ name: e.target.value })}
            className="input-field"
            placeholder="Nome do seu mundo..."
          />
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar locais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Local
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Editar Local' : 'Novo Local'}
              </h3>
              
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Nome do local"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={locationForm.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="input-field"
                  >
                    {locationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AI Generation Fields */}
                {[
                  { field: 'description', label: 'Descrição', icon: Globe },
                  { field: 'climate', label: 'Clima', icon: Mountain },
                  { field: 'culture', label: 'Cultura', icon: Users },
                  { field: 'history', label: 'História', icon: Clock },
                  { field: 'significance', label: 'Significado', icon: Star }
                ].map(({ field, label, icon: Icon }) => (
                  <div key={field}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <button
                        type="button"
                        onClick={() => generateWithAI('location', field)}
                        disabled={isGenerating}
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </button>
                    </div>
                    <textarea
                      value={locationForm[field]}
                      onChange={(e) => handleFormChange(field, e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder={`Descreva a ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      População
                    </label>
                    <input
                      type="text"
                      value={locationForm.population}
                      onChange={(e) => handleFormChange('population', e.target.value)}
                      className="input-field"
                      placeholder="10.000 habitantes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marcos
                    </label>
                    <input
                      type="text"
                      value={locationForm.landmarks}
                      onChange={(e) => handleFormChange('landmarks', e.target.value)}
                      className="input-field"
                      placeholder="Torre do Relógio, Praça Central"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conexões
                  </label>
                  <textarea
                    value={locationForm.connections}
                    onChange={(e) => handleFormChange('connections', e.target.value)}
                    className="input-field"
                    rows={2}
                    placeholder="Conexões com outros locais..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetLocationForm}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocations.map((location) => {
              const typeInfo = locationTypes.find(t => t.value === location.type);
              return (
                <div
                  key={location.id}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {location.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeInfo?.color}`}>
                        {typeInfo?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {location.description && (
                      <p className="line-clamp-2">
                        <strong>Descrição:</strong> {location.description}
                      </p>
                    )}
                    {location.population && (
                      <p><strong>População:</strong> {location.population}</p>
                    )}
                    {location.climate && (
                      <p><strong>Clima:</strong> {location.climate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum local encontrado
              </h3>
              <p className="text-gray-500">
                {worldData.locations.length === 0 
                  ? 'Crie seu primeiro local para começar'
                  : 'Tente ajustar a busca'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'locations':
        return renderLocations();
      default:
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento para {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Construtor de Mundo</h1>
          <p className="text-gray-600 mt-2">
            Crie e desenvolva o mundo da sua light novel
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default WorldBuilder;
