import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Plus, 
  Edit, 
  Trash2, 
  Sparkles, 
  Save,
  Search,
  Filter,
  BookOpen,
  Star,
  Eye,
  Zap,
  Crown,
  Sword,
  Shield,
  Gem,
  Scroll,
  Flame,
  Moon,
  Sun,
  MapPin
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { AIService } from '../utils/aiProviders';
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';
import AILoreGenModal from '../components/lore/AILoreGenModal';

const LoreGenerator = () => {
  const { 
    loreData, 
    addLoreItem,
    worldData,
    settings
  } = useStore();

  const [activeTab, setActiveTab] = useState('myths');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIGenModal, setShowAIGenModal] = useState(false);
  const [unifiedPromptIntegration, setUnifiedPromptIntegration] = useState(null);

  const [loreForm, setLoreForm] = useState({
    name: '',
    description: '',
    origin: '',
    significance: '',
    characters: '',
    locations: '',
    effects: '',
    notes: ''
  });

  const tabs = [
    { id: 'myths', label: 'Mitos', icon: BookOpen, color: 'bg-blue-100 text-blue-800' },
    { id: 'legends', label: 'Lendas', icon: Star, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'prophecies', label: 'Profecias', icon: Eye, color: 'bg-purple-100 text-purple-800' },
    { id: 'artifacts', label: 'Artefatos', icon: Gem, color: 'bg-green-100 text-green-800' },
    { id: 'rituals', label: 'Rituais', icon: Flame, color: 'bg-red-100 text-red-800' },
    { id: 'customs', label: 'Costumes', icon: Crown, color: 'bg-indigo-100 text-indigo-800' }
  ];

  const artifactTypes = [
    { value: 'weapon', label: 'Arma', icon: Sword },
    { value: 'armor', label: 'Armadura', icon: Shield },
    { value: 'jewelry', label: 'Joia', icon: Gem },
    { value: 'scroll', label: 'Pergaminho', icon: Scroll },
    { value: 'crown', label: 'Coroa', icon: Crown },
    { value: 'orb', label: 'Orbe', icon: Moon },
    { value: 'staff', label: 'Cajado', icon: Zap },
    { value: 'mirror', label: 'Espelho', icon: Eye }
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
    setLoreForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!loreForm.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingItem) {
      // Update existing item
      const currentItems = loreData[activeTab] || [];
      const updatedItems = currentItems.map(item => 
        item.id === editingItem.id ? { ...loreForm, id: item.id } : item
      );
      addLoreItem(activeTab, updatedItems);
      toast.success('Item atualizado!');
    } else {
      // Add new item
      addLoreItem(activeTab, loreForm);
      toast.success('Item criado!');
    }

    resetForm();
  };

  const resetForm = () => {
    setLoreForm({
      name: '',
      description: '',
      origin: '',
      significance: '',
      characters: '',
      locations: '',
      effects: '',
      notes: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setLoreForm(item);
    setShowForm(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      const currentItems = loreData[activeTab] || [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      addLoreItem(activeTab, updatedItems);
      toast.success('Item excluído!');
    }
  };

  const generateFullLoreItem = async (prompt, loreType) => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    setShowAIGenModal(false);
    const toastId = toast.loading(`Gerando ${loreType}...`);

    try {
      const result = await unifiedPromptIntegration.generateLoreItem(loreType, {
        prompt,
        worldData
      });
      
      if (result) {
        setLoreForm(prev => ({ ...prev, ...result }));
        setActiveTab(loreType);
        setShowForm(true);
        setEditingItem(null);
        toast.success('Item de lore gerado com sucesso!', { id: toastId });
      }
    } catch (error) {
      toast.error(`Erro ao gerar lore: ${error.message}`, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentItems = loreData[activeTab] || [];
  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerador de Lore</h1>
          <p className="text-gray-600 mt-2">
            Crie mitos, lendas, profecias e elementos de lore para seu mundo
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIGenModal(true)}
            className="btn-secondary flex items-center bg-purple-600 text-white hover:bg-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Criar com IA
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </button>
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
                    value={loreForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="input-field"
                    placeholder={`Nome do ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}`}
                    required
                  />
                </div>

                {/* AI Generation Fields */}
                {[
                  { field: 'description', label: 'Descrição', icon: BookOpen },
                  { field: 'origin', label: 'Origem', icon: Star },
                  { field: 'significance', label: 'Significado', icon: Eye },
                  { field: 'characters', label: 'Personagens Envolvidos', icon: Crown },
                  { field: 'locations', label: 'Locais Relacionados', icon: MapPin },
                  { field: 'effects', label: 'Efeitos/Impacto', icon: Zap }
                ].map(({ field, label, icon: Icon }) => (
                  <div key={field}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <button
                        type="button"
                        onClick={() => generateFullLoreItem('', activeTab)}
                        disabled={isGenerating}
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </button>
                    </div>
                    <textarea
                      value={loreForm[field]}
                      onChange={(e) => handleFormChange(field, e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder={`Descreva a ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={loreForm.notes}
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
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tabInfo?.color}`}>
                        {tabInfo?.label}
                      </span>
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
                    {item.origin && (
                      <p className="line-clamp-1">
                        <strong>Origem:</strong> {item.origin}
                      </p>
                    )}
                    {item.significance && (
                      <p className="line-clamp-1">
                        <strong>Significado:</strong> {item.significance}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ScrollText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

      {showAIGenModal && (
        <AILoreGenModal
          onClose={() => setShowAIGenModal(false)}
          onGenerate={generateFullLoreItem}
          isGenerating={isGenerating}
          loreTypes={tabs}
        />
      )}
    </div>
  );
};

export default LoreGenerator;
