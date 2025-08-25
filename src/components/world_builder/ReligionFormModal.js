import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { X, Sparkles, Trash2 } from 'lucide-react';

const ReligionFormModal = ({
  religion,
  onClose,
  onSave,
  onDelete,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    deities: '',
    description: '',
    practices: '',
    followers: '',
    symbols: '',
    ...religion
  });

  const [activeField, setActiveField] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('O nome da religião é obrigatório');
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
      description: `Descreva as crenças centrais da religião "${formData.name}".`,
      deities: `Liste e descreva as principais divindades da religião "${formData.name}".`,
      practices: `Descreva as práticas e rituais da religião "${formData.name}".`,
      followers: `Descreva os principais seguidores da religião "${formData.name}".`,
      symbols: `Descreva os símbolos sagrados da religião "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('religion_field', prompts[field]);
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
            {religion ? 'Editar Religião' : 'Adicionar Religião'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Religião *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="Ex: Culto da Luz Eterna"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição das Crenças
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
                placeholder="Crenças centrais da religião..."
                rows="4"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Divindades
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('deities')}
                    disabled={activeField === 'deities'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'deities' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.deities}
                onChange={(e) => setFormData({...formData, deities: e.target.value})}
                className="textarea-field"
                placeholder="Principais divindades e conceitos..."
                rows="3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Práticas e Rituais
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('practices')}
                    disabled={activeField === 'practices'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'practices' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.practices}
                onChange={(e) => setFormData({...formData, practices: e.target.value})}
                className="textarea-field"
                placeholder="Como praticam sua fé?"
                rows="3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Seguidores
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('followers')}
                    disabled={activeField === 'followers'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'followers' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.followers}
                onChange={(e) => setFormData({...formData, followers: e.target.value})}
                className="textarea-field"
                placeholder="Principais seguidores..."
                rows="2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Símbolos Sagrados
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('symbols')}
                    disabled={activeField === 'symbols'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'symbols' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.symbols}
                onChange={(e) => setFormData({...formData, symbols: e.target.value})}
                className="textarea-field"
                placeholder="Símbolos e artefatos sagrados..."
                rows="2"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {religion && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir "${religion.name}"?`)) {
                      onDelete(religion.id);
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
                {religion ? 'Atualizar' : 'Criar'} Religião
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReligionFormModal;
