import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles, Trash2 } from "lucide-react";

const RegionFormModal = ({
  region,
  onClose,
  onSave,
  onDelete,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    climate: '',
    terrain: '',
    population: '',
    features: '',
    ...region
  });

  const [activeField, setActiveField] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('O nome da região é obrigatório');
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
      description: `Descreva detalhadamente a geografia da região "${formData.name}".`,
      climate: `Descreva o clima da região "${formData.name}".`,
      terrain: `Descreva o terreno característico da região "${formData.name}".`,
      population: `Estime a população da região "${formData.name}".`,
      features: `Descreva características especiais da região "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('region_field', prompts[field]);
      if (result) {
        setFormData(prev => ({ ...prev, [field]: result }));
        toast.success(`${field} gerado com sucesso!`);
      }
    } catch (error) {
      toast.error('Erro ao gerar conteúdo');
    } finally {
      setActiveField('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {region ? 'Editar Região' : 'Adicionar Região'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Região *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="Ex: Planícies Douradas"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição Geográfica
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('description')}
                    disabled={activeField === 'description'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'description' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="textarea-field"
                placeholder="Descreva a geografia da região..."
                rows="4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Clima
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('climate')}
                      disabled={activeField === 'climate'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'climate' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.climate}
                  onChange={(e) => setFormData({...formData, climate: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Temperado, Tropical"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Terreno
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('terrain')}
                      disabled={activeField === 'terrain'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'terrain' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.terrain}
                  onChange={(e) => setFormData({...formData, terrain: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Planícies, Montanhas"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  População
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('population')}
                    disabled={activeField === 'population'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'population' ? 'Gerando...' : '✨ IA'}
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
                  Características Especiais
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('features')}
                    disabled={activeField === 'features'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'features' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                className="textarea-field"
                placeholder="Características únicas da região..."
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {region && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir "${region.name}"?`)) {
                      onDelete(region.id);
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
                {region ? 'Atualizar' : 'Criar'} Região
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegionFormModal;