
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { X, Sparkles } from 'lucide-react';

const eventTypes = [
  { value: 'political', label: 'Político' },
  { value: 'war', label: 'Guerra' },
  { value: 'discovery', label: 'Descoberta' },
  { value: 'disaster', label: 'Desastre' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'magical', label: 'Mágico' },
  { value: 'religious', label: 'Religioso' },
  { value: 'technological', label: 'Tecnológico' }
];

const EventFormModal = ({
  event,
  onClose,
  onSave,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    year: '',
    type: 'political',
    impact: '',
    participants: '',
    ...event
  });

  const [activeField, setActiveField] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('O nome do evento é obrigatório');
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
      description: `Descreva detalhadamente um evento histórico chamado "${formData.name}" que aconteceu no ano ${formData.year || 'desconhecido'}.`,
      impact: `Descreva o impacto e consequências do evento "${formData.name}" no mundo.`,
      participants: `Liste os principais participantes, heróis ou vilões envolvidos no evento "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('event_field', prompts[field]);
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
            {event ? 'Editar Evento' : 'Adicionar Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Evento *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: A Grande Guerra dos Dragões"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="input-field"
                  placeholder="Ex: 1205"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="input-field"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
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
                placeholder="O que aconteceu neste evento?"
                rows="4"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Impacto e Consequências
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('impact')}
                    disabled={activeField === 'impact'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'impact' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.impact}
                onChange={(e) => setFormData({...formData, impact: e.target.value})}
                className="textarea-field"
                placeholder="Quais foram as consequências deste evento?"
                rows="3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Participantes
                </label>
                {aiProvider && (
                  <button
                    type="button"
                    onClick={() => generateFieldContent('participants')}
                    disabled={activeField === 'participants'}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {activeField === 'participants' ? 'Gerando...' : '✨ IA'}
                  </button>
                )}
              </div>
              <textarea
                value={formData.participants}
                onChange={(e) => setFormData({...formData, participants: e.target.value})}
                className="textarea-field"
                placeholder="Quem esteve envolvido?"
                rows="2"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {event ? 'Atualizar' : 'Criar'} Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;