import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Save,
  Download,
  Upload,
  Search,
  Filter,
  User,
  Heart,
  Sword,
  Shield,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const CharacterGenerator = () => {
  const { 
    characters, 
    addCharacter, 
    updateCharacter, 
    deleteCharacter, 
    setSelectedCharacter,
    selectedCharacter 
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [characterForm, setCharacterForm] = useState({
    name: '',
    role: 'protagonist',
    age: '',
    gender: '',
    appearance: '',
    personality: '',
    background: '',
    goals: '',
    conflicts: '',
    relationships: '',
    abilities: '',
    weaknesses: '',
    arc: '',
    notes: ''
  });

  const roles = [
    { value: 'protagonist', label: 'Protagonista', color: 'bg-blue-100 text-blue-800' },
    { value: 'antagonist', label: 'Antagonista', color: 'bg-red-100 text-red-800' },
    { value: 'deuteragonist', label: 'Deuteragonista', color: 'bg-green-100 text-green-800' },
    { value: 'supporting', label: 'Coadjuvante', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'mentor', label: 'Mentor', color: 'bg-purple-100 text-purple-800' },
    { value: 'love_interest', label: 'Interesse Romântico', color: 'bg-pink-100 text-pink-800' }
  ];

  const handleFormChange = (field, value) => {
    setCharacterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!characterForm.name.trim()) {
      toast.error('Nome do personagem é obrigatório');
      return;
    }

    if (editingCharacter) {
      updateCharacter(editingCharacter.id, characterForm);
      toast.success('Personagem atualizado!');
    } else {
      addCharacter(characterForm);
      toast.success('Personagem criado!');
    }

    resetForm();
  };

  const resetForm = () => {
    setCharacterForm({
      name: '',
      role: 'protagonist',
      age: '',
      gender: '',
      appearance: '',
      personality: '',
      background: '',
      goals: '',
      conflicts: '',
      relationships: '',
      abilities: '',
      weaknesses: '',
      arc: '',
      notes: ''
    });
    setEditingCharacter(null);
    setShowForm(false);
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setCharacterForm(character);
    setShowForm(true);
  };

  const handleDelete = (characterId) => {
    if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
      deleteCharacter(characterId);
      toast.success('Personagem excluído!');
    }
  };

  const generateWithAI = async (field) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponses = {
        appearance: 'Alta estatura, cabelos escuros e olhos penetrantes que revelam uma determinação inabalável. Sua postura ereta e movimentos graciosos denotam confiança e experiência.',
        personality: 'Determinado e focado, mas com um lado compassivo que emerge em momentos de vulnerabilidade. Tendência a assumir responsabilidades e proteger os outros.',
        background: 'Criado em circunstâncias difíceis, desenvolveu habilidades de sobrevivência desde cedo. Sua história é marcada por perdas e conquistas que moldaram seu caráter.',
        goals: 'Busca encontrar seu lugar no mundo e proteger aqueles que ama. Tem um objetivo maior que ainda não foi completamente revelado.',
        conflicts: 'Luta contra expectativas externas e suas próprias dúvidas internas. Precisa equilibrar responsabilidades pessoais com missões maiores.',
        relationships: 'Mantém poucos amigos próximos, mas é leal aos que conquistam sua confiança. Tem uma relação complexa com figuras de autoridade.',
        abilities: 'Habilidades físicas excepcionais, inteligência estratégica e uma intuição aguçada. Possui conhecimentos em diversas áreas.',
        weaknesses: 'Tendência a se isolar emocionalmente e assumir muita responsabilidade. Às vezes é teimoso demais para pedir ajuda.',
        arc: 'Transformação de um indivíduo solitário para alguém que aprende a confiar e trabalhar em equipe, mantendo sua essência.'
      };

      handleFormChange(field, aiResponses[field] || 'Conteúdo gerado com AI');
      toast.success(`${field} gerado com AI!`);
    } catch (error) {
      toast.error('Erro ao gerar com AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.personality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || character.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const exportCharacters = () => {
    const data = JSON.stringify(characters, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'characters.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Personagens exportados!');
  };

  const importCharacters = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedCharacters = JSON.parse(e.target.result);
            importedCharacters.forEach(char => addCharacter(char));
            toast.success('Personagens importados!');
          } catch (error) {
            toast.error('Erro ao importar personagens');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerador de Personagens</h1>
          <p className="text-gray-600 mt-2">
            Crie e gerencie personagens para sua light novel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportCharacters}
            className="btn-outline flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </button>
          <button
            onClick={importCharacters}
            className="btn-outline flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Personagem
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar personagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field w-48"
          >
            <option value="">Todos os papéis</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCharacter ? 'Editar Personagem' : 'Novo Personagem'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={characterForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Nome do personagem"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Papel
                  </label>
                  <select
                    value={characterForm.role}
                    onChange={(e) => handleFormChange('role', e.target.value)}
                    className="input-field"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idade
                    </label>
                    <input
                      type="text"
                      value={characterForm.age}
                      onChange={(e) => handleFormChange('age', e.target.value)}
                      className="input-field"
                      placeholder="25 anos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gênero
                    </label>
                    <input
                      type="text"
                      value={characterForm.gender}
                      onChange={(e) => handleFormChange('gender', e.target.value)}
                      className="input-field"
                      placeholder="Masculino"
                    />
                  </div>
                </div>

                {/* AI Generation Fields */}
                {[
                  { field: 'appearance', label: 'Aparência', icon: Eye },
                  { field: 'personality', label: 'Personalidade', icon: Heart },
                  { field: 'background', label: 'Histórico', icon: User },
                  { field: 'goals', label: 'Objetivos', icon: Target },
                  { field: 'conflicts', label: 'Conflitos', icon: Sword },
                  { field: 'relationships', label: 'Relacionamentos', icon: Users },
                  { field: 'abilities', label: 'Habilidades', icon: Zap },
                  { field: 'weaknesses', label: 'Fraquezas', icon: Shield },
                  { field: 'arc', label: 'Arco de Desenvolvimento', icon: Brain }
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
                      value={characterForm[field]}
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
                    value={characterForm.notes}
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
                    {editingCharacter ? 'Atualizar' : 'Criar'}
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

        {/* Characters List */}
        <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCharacters.map((character) => {
              const roleInfo = roles.find(r => r.value === character.role);
              return (
                <div
                  key={character.id}
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {character.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.color}`}>
                        {roleInfo?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(character);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(character.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {character.age && (
                      <p><strong>Idade:</strong> {character.age}</p>
                    )}
                    {character.personality && (
                      <p className="line-clamp-2">
                        <strong>Personalidade:</strong> {character.personality}
                      </p>
                    )}
                    {character.goals && (
                      <p className="line-clamp-2">
                        <strong>Objetivos:</strong> {character.goals}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum personagem encontrado
              </h3>
              <p className="text-gray-500">
                {characters.length === 0 
                  ? 'Crie seu primeiro personagem para começar'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterGenerator;
