import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles, Trash2 } from "lucide-react";

const TechnologyFormModal = ({
    technology,
    onClose,
    onSave,
    onDelete,
    aiProvider,
    isGenerating,
    onGenerateWithAI
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      level: '',
      description: '',
      applications: '',
      ...technology
    });
  
    const [activeField, setActiveField] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('O nome da tecnologia é obrigatório');
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
        description: `Descreva detalhadamente a tecnologia "${formData.name}".`,
        applications: `Descreva as principais aplicações da tecnologia "${formData.name}".`,
        level: `Defina o nível tecnológico da tecnologia "${formData.name}".`
      };
  
      try {
        const result = await onGenerateWithAI('technology_field', prompts[field]);
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
              {technology ? 'Editar Tecnologia' : 'Adicionar Tecnologia'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Tecnologia *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Tecnologia de Teletransporte"
                  required
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Nível Tecnológico
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('level')}
                      disabled={activeField === 'level'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'level' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Nível 5"
                />
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
                  placeholder="Descrição detalhada da tecnologia..."
                  rows="4"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Aplicações
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('applications')}
                      disabled={activeField === 'applications'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'applications' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.applications}
                  onChange={(e) => setFormData({...formData, applications: e.target.value})}
                  className="textarea-field"
                  placeholder="Principais aplicações da tecnologia..."
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {technology && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${technology.name}"?`)) {
                        onDelete(technology.id);
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
                  {technology ? 'Atualizar' : 'Criar'} Tecnologia
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default TechnologyFormModal;