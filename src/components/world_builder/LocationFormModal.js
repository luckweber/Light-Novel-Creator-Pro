import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building, Home, Tent, Crown, Castle, Landmark, Key, Trees, Mountain, Waves, Sailboat, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { locationTypes } from '../../data/worldBuilderConstants';

const iconMap = {
  Building, Home, Tent, Crown, Castle, Landmark, Key, Trees, Mountain, Waves, Sailboat, MapPin
};

const LocationFormModal = ({
  location,
  onClose,
  onSave,
  onDelete,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'city',
    description: '',
    population: '',
    government: '',
    economy: '',
    history: '',
    ...location
  });

  const [activeField, setActiveField] = useState('');

  useEffect(() => {
    if (location) {
      setFormData({ ...location });
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('O nome do local é obrigatório');
      return;
    }
    onSave(formData);
  };

  const generateFieldContent = async (field) => {
    if (!aiProvider) {
      toast.error('Configure um provedor de IA');
      return;
    }

    setActiveField(field);
    
    const prompts = {
      description: `Gere uma descrição detalhada para o local "${formData.name}", que é do tipo "${formData.type}".`,
      population: `Estime a população para "${formData.name}".`,
      government: `Descreva o governo de "${formData.name}".`,
      economy: `Descreva a economia de "${formData.name}".`,
      history: `Crie um breve histórico para "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('location_field', prompts[field]);
      if (result) {
        setFormData(prev => ({ ...prev, [field]: result }));
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} gerado com sucesso!`);
      }
    } catch (error) {
      toast.error('Erro ao gerar conteúdo');
    } finally {
      setActiveField('');
    }
  };

  const selectedLocationType = locationTypes.find(lt => lt.value === formData.type);
  const IconComponent = selectedLocationType && iconMap[selectedLocationType.icon] 
    ? iconMap[selectedLocationType.icon] 
    : MapPin;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <IconComponent className="h-6 w-6 mr-3 text-indigo-500" />
            {location ? 'Editar Local' : 'Adicionar Local'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Local *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Cidade da Lua Prateada"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Local
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input-field"
                >
                  {locationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('description')}
                    disabled={isGenerating && activeField === 'description'}
                    className="btn-ai"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isGenerating && activeField === 'description' ? 'Gerando...' : 'IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="textarea-field"
                placeholder="Descreva a aparência, atmosfera e características do local."
                rows="4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    População
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('population')}
                      disabled={isGenerating && activeField === 'population'}
                      className="btn-ai"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isGenerating && activeField === 'population' ? 'Gerando...' : 'IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.population}
                  onChange={(e) => setFormData({...formData, population: e.target.value})}
                  className="input-field"
                  placeholder="Ex: 50.000 habitantes"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Governo
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('government')}
                      disabled={isGenerating && activeField === 'government'}
                      className="btn-ai"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isGenerating && activeField === 'government' ? 'Gerando...' : 'IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.government}
                  onChange={(e) => setFormData({...formData, government: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Monarquia Constitucional"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Economia
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('economy')}
                    disabled={isGenerating && activeField === 'economy'}
                    className="btn-ai"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isGenerating && activeField === 'economy' ? 'Gerando...' : 'IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.economy}
                onChange={(e) => setFormData({...formData, economy: e.target.value})}
                className="textarea-field"
                placeholder="Principais indústrias, comércio e recursos."
                rows="2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  História
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('history')}
                    disabled={isGenerating && activeField === 'history'}
                    className="btn-ai"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isGenerating && activeField === 'history' ? 'Gerando...' : 'IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.history}
                onChange={(e) => setFormData({...formData, history: e.target.value})}
                className="textarea-field"
                placeholder="Breve histórico do local, eventos importantes."
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {location && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir "${location.name}"?`)) {
                      onDelete(location.id);
                    }
                  }}
                  className="btn-danger"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="btn-outline">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {location ? 'Atualizar Local' : 'Criar Local'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
