import React, { useState } from 'react';
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

const LoreGenerator = () => {
  const { 
    loreData, 
    addLoreItem 
  } = useStore();

  const [activeTab, setActiveTab] = useState('myths');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateWithAI = async (field) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponses = {
        myths: {
          name: 'O Nascimento das Estrelas',
          description: 'Conta a história de como os deuses antigos criaram as estrelas para iluminar o mundo durante a noite, cada uma representando uma alma que se sacrificou pelo bem comum.',
          origin: 'Passado de geração em geração pelos anciões das tribos nômades, este mito explica a origem do céu noturno.',
          significance: 'Representa o sacrifício pelo bem comum e a importância da luz em tempos de escuridão.',
          characters: 'Os Deuses Antigos, os Sacrificados, os Guardiões da Noite',
          locations: 'O Céu Primordial, o Vale dos Sacrifícios, o Templo das Estrelas',
          effects: 'Influencia rituais noturnos e crenças sobre sacrifício e renascimento.'
        },
        legends: {
          name: 'A Espada do Primeiro Rei',
          description: 'Uma espada lendária forjada com metal celestial que só pode ser empunhada por um verdadeiro herdeiro do trono.',
          origin: 'Forjada pelos ferreiros celestiais para o primeiro rei que unificou as terras.',
          significance: 'Símbolo de legitimidade real e poder divino sobre as terras.',
          characters: 'O Primeiro Rei, os Ferreiros Celestiais, os Guardiões da Espada',
          locations: 'A Forja Celestial, o Trono Real, a Cripta dos Reis',
          effects: 'Concede poder divino ao portador legítimo e protege contra usurpadores.'
        },
        prophecies: {
          name: 'A Profecia do Eclipse',
          description: 'Quando o sol e a lua se encontrarem no céu, um escolhido surgirá para enfrentar a escuridão que ameaça o mundo.',
          origin: 'Revelada por uma vidente em transe durante um eclipse total.',
          significance: 'Prediz o surgimento de um herói destinado a salvar o mundo.',
          characters: 'O Escolhido, a Vidente, os Guardiões da Profecia',
          locations: 'O Templo da Vidente, o Vale do Eclipse, o Altar dos Destinos',
          effects: 'Mobiliza forças para encontrar e proteger o escolhido.'
        },
        artifacts: {
          name: 'O Orbe da Verdade',
          description: 'Um orbe cristalino que revela a verdade oculta e expõe mentiras quando tocado.',
          origin: 'Criado pelos sábios antigos para julgar disputas e descobrir traidores.',
          significance: 'Instrumento de justiça e revelação da verdade.',
          characters: 'Os Sábios Antigos, os Guardiões da Verdade, os Julgadores',
          locations: 'A Câmara dos Julgamentos, o Santuário da Verdade, o Tribunal Real',
          effects: 'Revela mentiras, expõe traidores e garante justiça imparcial.'
        },
        rituals: {
          name: 'O Ritual da Renovação',
          description: 'Cerimônia anual que renova a energia vital da terra e garante boas colheitas.',
          origin: 'Desenvolvido pelos primeiros agricultores para garantir a fertilidade da terra.',
          significance: 'Mantém o equilíbrio entre a humanidade e a natureza.',
          characters: 'Os Sacerdotes da Terra, os Agricultores, os Guardiões da Natureza',
          locations: 'O Círculo Sagrado, os Campos de Colheita, o Altar da Terra',
          effects: 'Renova a fertilidade da terra e fortalece a conexão com a natureza.'
        },
        customs: {
          name: 'A Festa dos Ancestrais',
          description: 'Celebração anual onde os vivos honram os mortos e buscam sua orientação.',
          origin: 'Tradição antiga que mantém a conexão entre gerações passadas e presentes.',
          significance: 'Preserva a memória dos ancestrais e fortalece os laços familiares.',
          characters: 'Os Ancestrais, os Familiares, os Guardiões da Memória',
          locations: 'O Cemitério Sagrado, o Salão dos Ancestrais, o Altar da Memória',
          effects: 'Fortalece laços familiares e preserva tradições ancestrais.'
        }
      };

      const response = aiResponses[activeTab]?.[field] || 'Conteúdo gerado com AI';
      handleFormChange(field, response);
      toast.success(`${field} gerado com AI!`);
    } catch (error) {
      toast.error('Erro ao gerar com AI');
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
                        onClick={() => generateWithAI(field)}
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
    </div>
  );
};

export default LoreGenerator;
