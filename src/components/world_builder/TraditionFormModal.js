import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles, Trash2 } from "lucide-react";
import { traditionTypes } from "../../data/worldBuilderConstants";

const TraditionFormModal = ({
    tradition,
    onClose,
    onSave,
    onDelete,
    aiProvider,
    isGenerating,
    onGenerateWithAI
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'festival',
      description: '',
      origin: '',
      practice: '',
      frequency: '',
      ...tradition
    });
  
    const [activeField, setActiveField] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('O nome da tradição é obrigatório');
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
        description: `Descreva detalhadamente a tradição "${formData.name}".`,
        origin: `Descreva a origem histórica da tradição "${formData.name}".`,
        practice: `Descreva como é praticada a tradição "${formData.name}".`,
        frequency: `Defina com que frequência acontece a tradição "${formData.name}".`
      };
  
      try {
        const result = await onGenerateWithAI('tradition_field', prompts[field]);
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
              {tradition ? 'Editar Tradição' : 'Adicionar Tradição'}
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
                    Nome da Tradição *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Ex: Festival das Flores"
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
                    {traditionTypes.map(type => (
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
                  placeholder="Descrição detalhada da tradição..."
                  rows="4"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Origem Histórica
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('origin')}
                      disabled={activeField === 'origin'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'origin' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  className="textarea-field"
                  placeholder="Como surgiu esta tradição?"
                  rows="3"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Como é Praticada
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('practice')}
                      disabled={activeField === 'practice'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'practice' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.practice}
                  onChange={(e) => setFormData({...formData, practice: e.target.value})}
                  className="textarea-field"
                  placeholder="Detalhes de como é praticada..."
                  rows="3"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Frequência
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('frequency')}
                      disabled={activeField === 'frequency'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'frequency' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Anualmente, Sazonal, Mensal..."
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {tradition && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${tradition.name}"?`)) {
                        onDelete(tradition.id);
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
                  {tradition ? 'Atualizar' : 'Criar'} Tradição
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default TraditionFormModal;