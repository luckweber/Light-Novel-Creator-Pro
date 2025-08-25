import React, { useState } from 'react';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const PeopleFormModal = ({
  people,
  onClose,
  onSave,
  onDelete,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    classification: '',
    description: '',
    society: '',
    traditions: '',
    appearance: '',
    ...people
  });

  const [activeField, setActiveField] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('O nome do povo é obrigatório');
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
      description: `Gere uma descrição detalhada para o povo "${formData.name}".`,
      society: `Descreva a sociedade do povo "${formData.name}".`,
      traditions: `Descreva as tradições do povo "${formData.name}".`,
      appearance: `Descreva a aparência do povo "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('people_field', prompts[field]);
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
            {people ? 'Editar Povo' : 'Adicionar Povo'}
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
                  Nome do Povo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Elfos da Floresta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classificação
                </label>
                <input
                  type="text"
                  value={formData.classification}
                  onChange={(e) => setFormData({...formData, classification: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Humanoide, Fae"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Aparência
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('appearance')}
                    disabled={activeField === 'appearance'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'appearance' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.appearance}
                onChange={(e) => setFormData({...formData, appearance: e.target.value})}
                className="textarea-field"
                placeholder="Descreva a aparência física do povo..."
                rows="3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição Geral
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
                placeholder="Descreva o povo, sua cultura e características."
                rows="4"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Sociedade
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('society')}
                    disabled={activeField === 'society'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'society' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.society}
                onChange={(e) => setFormData({...formData, society: e.target.value})}
                className="textarea-field"
                placeholder="Estrutura social, governo, etc."
                rows="3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tradições
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('traditions')}
                    disabled={activeField === 'traditions'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'traditions' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.traditions}
                onChange={(e) => setFormData({...formData, traditions: e.target.value})}
                className="textarea-field"
                placeholder="Costumes e tradições importantes."
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {people && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir "${people.name}"?`)) {
                      onDelete(people.id);
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
                {people ? 'Atualizar' : 'Criar'} Povo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeopleFormModal;
