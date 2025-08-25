import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles, Trash2 } from "lucide-react";
const LanguageFormModal = ({
    language,
    onClose,
    onSave,
    onDelete,
    aiProvider,
    isGenerating,
    onGenerateWithAI
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      family: '',
      description: '',
      speakers: '',
      script: '',
      examples: '',
      ...language
    });
  
    const [activeField, setActiveField] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('O nome do idioma é obrigatório');
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
        description: `Descreva detalhadamente as características do idioma "${formData.name}".`,
        family: `Defina a família linguística do idioma "${formData.name}".`,
        speakers: `Descreva os principais falantes do idioma "${formData.name}".`,
        script: `Descreva o sistema de escrita do idioma "${formData.name}".`,
        examples: `Crie exemplos de palavras ou frases do idioma "${formData.name}".`
      };
  
      try {
        const result = await onGenerateWithAI('language_field', prompts[field]);
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
              {language ? 'Editar Idioma' : 'Adicionar Idioma'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Idioma *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Élfico Antigo"
                  required
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Família Linguística
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('family')}
                      disabled={activeField === 'family'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'family' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.family}
                  onChange={(e) => setFormData({...formData, family: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Proto-Élfico"
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
                  placeholder="Características do idioma..."
                  rows="4"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Principais Falantes
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('speakers')}
                      disabled={activeField === 'speakers'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'speakers' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.speakers}
                  onChange={(e) => setFormData({...formData, speakers: e.target.value})}
                  className="textarea-field"
                  placeholder="Quem fala este idioma?"
                  rows="2"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Sistema de Escrita
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('script')}
                      disabled={activeField === 'script'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'script' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.script}
                  onChange={(e) => setFormData({...formData, script: e.target.value})}
                  className="textarea-field"
                  placeholder="Como é escrito?"
                  rows="2"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Exemplos
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('examples')}
                      disabled={activeField === 'examples'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'examples' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.examples}
                  onChange={(e) => setFormData({...formData, examples: e.target.value})}
                  className="textarea-field"
                  placeholder="Palavras ou frases de exemplo..."
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {language && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${language.name}"?`)) {
                        onDelete(language.id);
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
                  {language ? 'Atualizar' : 'Criar'} Idioma
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default LanguageFormModal;