import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Sparkles, 
  Save,
  Search,
  Filter,
  Target,
  TrendingUp,
  Heart,
  Sword,
  CheckCircle,
  ArrowRight,
  Clock,
  Star,
  Zap,
  BookOpen,
  Users,
  MapPin
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { AIService } from '../utils/aiProviders';
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const NarrativeGenerator = () => {
  const { 
    narrativeData, 
    addNarrativeItem,
    settings,
    worldData
  } = useStore();

  const [activeTab, setActiveTab] = useState('plotPoints');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [unifiedPromptIntegration, setUnifiedPromptIntegration] = useState(null);

  const [narrativeForm, setNarrativeForm] = useState({
    name: '',
    description: '',
    characters: '',
    locations: '',
    consequences: '',
    timeline: '',
    notes: ''
  });

  const tabs = [
    { id: 'plotPoints', label: 'Plot Points', icon: Target, color: 'bg-blue-100 text-blue-800' },
    { id: 'storyArcs', label: 'Arcos de História', icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    { id: 'themes', label: 'Temas', icon: Heart, color: 'bg-purple-100 text-purple-800' },
    { id: 'conflicts', label: 'Conflitos', icon: Sword, color: 'bg-red-100 text-red-800' },
    { id: 'resolutions', label: 'Resoluções', icon: CheckCircle, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const plotPointTypes = [
    { value: 'inciting_incident', label: 'Incidente Incitador', icon: Zap },
    { value: 'first_plot_point', label: 'Primeiro Plot Point', icon: ArrowRight },
    { value: 'midpoint', label: 'Ponto Médio', icon: Clock },
    { value: 'second_plot_point', label: 'Segundo Plot Point', icon: TrendingUp },
    { value: 'climax', label: 'Clímax', icon: Star },
    { value: 'resolution', label: 'Resolução', icon: CheckCircle }
  ];

  const conflictTypes = [
    { value: 'man_vs_man', label: 'Homem vs Homem', icon: Users },
    { value: 'man_vs_self', label: 'Homem vs Si Mesmo', icon: Heart },
    { value: 'man_vs_nature', label: 'Homem vs Natureza', icon: MapPin },
    { value: 'man_vs_society', label: 'Homem vs Sociedade', icon: BookOpen },
    { value: 'man_vs_technology', label: 'Homem vs Tecnologia', icon: Zap },
    { value: 'man_vs_supernatural', label: 'Homem vs Sobrenatural', icon: Star }
  ];

  // Inicializar Unified Prompt Integration
  useEffect(() => {
    if (settings?.defaultAIProvider && settings?.aiProviders?.[settings.defaultAIProvider]) {
      const activeProvider = settings.aiProviders[settings.defaultAIProvider];
      const aiService = new AIService(settings.defaultAIProvider, activeProvider.apiKey, {
        model: activeProvider.defaultModel,
        temperature: activeProvider.temperature,
        maxTokens: activeProvider.maxTokens
      });
      
      const integration = createUnifiedPromptIntegration(worldData, aiService);
      setUnifiedPromptIntegration(integration);
    }
  }, [settings, worldData]);

  const handleFormChange = (field, value) => {
    setNarrativeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!narrativeForm.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingItem) {
      // Update existing item
      const currentItems = narrativeData[activeTab] || [];
      const updatedItems = currentItems.map(item => 
        item.id === editingItem.id ? { ...narrativeForm, id: item.id } : item
      );
      addNarrativeItem(activeTab, updatedItems);
      toast.success('Item atualizado!');
    } else {
      // Add new item
      addNarrativeItem(activeTab, narrativeForm);
      toast.success('Item criado!');
    }

    resetForm();
  };

  const resetForm = () => {
    setNarrativeForm({
      name: '',
      description: '',
      characters: '',
      locations: '',
      consequences: '',
      timeline: '',
      notes: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNarrativeForm(item);
    setShowForm(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      const currentItems = narrativeData[activeTab] || [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      addNarrativeItem(activeTab, updatedItems);
      toast.success('Item excluído!');
    }
  };

  const generateWithAI = async (field) => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await unifiedPromptIntegration.generateNarrativeField(field, narrativeForm, activeTab);
      
      if (result) {
        handleFormChange(field, result);
        toast.success(`${field} gerado com sucesso!`);
      }
    } catch (error) {
      toast.error(`Erro ao gerar com IA: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentItems = narrativeData[activeTab] || [];
  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPlotPointForm = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Plot Point
      </label>
      <select
        value={narrativeForm.type || ''}
        onChange={(e) => handleFormChange('type', e.target.value)}
        className="input-field"
      >
        <option value="">Selecione o tipo</option>
        {plotPointTypes.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderConflictForm = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Conflito
      </label>
      <select
        value={narrativeForm.conflictType || ''}
        onChange={(e) => handleFormChange('conflictType', e.target.value)}
        className="input-field"
      >
        <option value="">Selecione o tipo</option>
        {conflictTypes.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderFormFields = () => {
    const baseFields = [
      { field: 'description', label: 'Descrição', icon: FileText },
      { field: 'characters', label: 'Personagens Envolvidos', icon: Users },
      { field: 'locations', label: 'Locais', icon: MapPin },
      { field: 'consequences', label: 'Consequências', icon: ArrowRight },
      { field: 'timeline', label: 'Cronologia', icon: Clock }
    ];

    return baseFields.map(({ field, label, icon: Icon }) => (
      <div key={field}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => generateWithAI(field)}
            disabled={isGenerating}
            className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </button>
        </div>
        <textarea
          value={narrativeForm[field]}
          onChange={(e) => handleFormChange(field, e.target.value)}
          className="input-field"
          rows={3}
          placeholder={`Descreva a ${label.toLowerCase()}...`}
        />
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerador de Narrativa</h1>
          <p className="text-gray-600 mt-2">
            Crie plot points, arcos de história e elementos narrativos
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </button>
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

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Editar Item' : `Novo ${tabs.find(t => t.id === activeTab)?.label}`}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={narrativeForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="input-field"
                    placeholder={`Nome do ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}`}
                    required
                  />
                </div>

                {/* Conditional form fields based on active tab */}
                {activeTab === 'plotPoints' && renderPlotPointForm()}
                {activeTab === 'conflicts' && renderConflictForm()}

                {/* Common form fields */}
                {renderFormFields()}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={narrativeForm.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Notas adicionais..."
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
                    onClick={resetForm}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const tabInfo = tabs.find(t => t.id === activeTab);
              return (
                <div
                  key={item.id}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tabInfo?.color}`}>
                          {tabInfo?.label}
                        </span>
                        {item.type && (
                          <span className="text-xs text-gray-500">
                            {plotPointTypes.find(t => t.value === item.type)?.label || item.type}
                          </span>
                        )}
                        {item.conflictType && (
                          <span className="text-xs text-gray-500">
                            {conflictTypes.find(t => t.value === item.conflictType)?.label || item.conflictType}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {item.description && (
                      <p className="line-clamp-2">
                        <strong>Descrição:</strong> {item.description}
                      </p>
                    )}
                    {item.characters && (
                      <p className="line-clamp-1">
                        <strong>Personagens:</strong> {item.characters}
                      </p>
                    )}
                    {item.consequences && (
                      <p className="line-clamp-1">
                        <strong>Consequências:</strong> {item.consequences}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-gray-500">
                {currentItems.length === 0 
                  ? `Crie seu primeiro ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} para começar`
                  : 'Tente ajustar a busca'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NarrativeGenerator;
