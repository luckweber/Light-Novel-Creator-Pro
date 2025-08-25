import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Sparkles } from "lucide-react";

const EconomyFormModal = ({
    economy,
    onClose,
    onSave,
    aiProvider,
    isGenerating,
    onGenerateWithAI
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      currency: '',
      description: '',
      mainExports: '',
      wealthDistribution: '',
      ...economy
    });
  
    const [activeField, setActiveField] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('O nome do sistema é obrigatório');
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
        description: `Descreva o sistema econômico "${formData.name}".`,
        currency: `Defina a moeda principal do sistema "${formData.name}".`,
        mainExports: `Descreva as principais exportações do sistema "${formData.name}".`,
        wealthDistribution: `Descreva a distribuição de riqueza do sistema "${formData.name}".`
      };
  
      try {
        const result = await onGenerateWithAI('economy_field', prompts[field]);
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
              {economy ? 'Editar Sistema Econômico' : 'Adicionar Sistema Econômico'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Sistema *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Mercantilismo de Prata"
                  required
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Moeda
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('currency')}
                      disabled={activeField === 'currency'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'currency' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Draconian Gold"
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
                  placeholder="Descrição detalhada do sistema..."
                  rows="4"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Exportações
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('mainExports')}
                      disabled={activeField === 'mainExports'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'mainExports' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.mainExports}
                  onChange={(e) => setFormData({...formData, mainExports: e.target.value})}
                  className="textarea-field"
                  placeholder="Principais exportações..."
                  rows="3"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Distribuição de Riqueza
                  </label>
                  {aiProvider && (
                    <button
                      type="button"
                      onClick={() => generateFieldContent('wealthDistribution')}
                      disabled={activeField === 'wealthDistribution'}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {activeField === 'wealthDistribution' ? 'Gerando...' : '✨ IA'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.wealthDistribution}
                  onChange={(e) => setFormData({...formData, wealthDistribution: e.target.value})}
                  className="textarea-field"
                  placeholder="Como a riqueza é distribuída?"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-outline">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {economy ? 'Atualizar' : 'Criar'} Sistema Econômico
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default EconomyFormModal;

