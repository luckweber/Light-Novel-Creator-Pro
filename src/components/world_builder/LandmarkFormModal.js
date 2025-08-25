import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles, Trash2 } from "lucide-react";
import { landmarkTypes } from "../../data/worldBuilderConstants";

const LandmarkFormModal = ({
    landmark,
    onClose,
    onSave,
    onDelete,
    aiProvider,
    isGenerating,
    onGenerateWithAI
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'natural',
      description: '',
      significance: '',
      location: '',
      features: '',
      ...landmark
    });
  
    const [activeField, setActiveField] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('O nome do marco é obrigatório');
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
        description: `Descreva detalhadamente o marco "${formData.name}".`,
        significance: `Explique a importância histórica ou cultural do marco "${formData.name}".`,
        location: `Descreva a localização do marco "${formData.name}".`,
        features: `Descreva características especiais do marco "${formData.name}".`
      };
  
      try {
        const result = await onGenerateWithAI('landmark_field', prompts[field]);
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
              {landmark ? 'Editar Marco' : 'Adicionar Marco'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Marco *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Ex: Torre dos Ventos"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="input-field"
                  >
                    {landmarkTypes.map(type => (
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
                  placeholder="Descrição detalhada do marco..."
                  rows="4"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Importância Histórica
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('significance')}
                      disabled={activeField === 'significance'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'significance' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.significance}
                  onChange={(e) => setFormData({...formData, significance: e.target.value})}
                  className="textarea-field"
                  placeholder="Por que este marco é importante?"
                  rows="3"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('location')}
                      disabled={activeField === 'location'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'location' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="input-field"
                  placeholder="Onde está localizado?"
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
                  placeholder="Características únicas do marco..."
                  rows="2"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {landmark && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${landmark.name}"?`)) {
                        onDelete(landmark.id);
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
                  {landmark ? 'Atualizar' : 'Criar'} Marco
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default LandmarkFormModal;