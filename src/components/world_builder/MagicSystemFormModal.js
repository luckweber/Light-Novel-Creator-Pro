import { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
  
const MagicSystemFormModal = ({
  system,
  onClose,
  onSave,
  aiProvider,
  isGenerating,
  onGenerateWithAI
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    source: '',
    limitations: '',
    ...system
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
      description: `Descreva o sistema de magia "${formData.name}".`,
      rules: `Defina as regras principais do sistema de magia "${formData.name}".`,
      source: `Descreva a fonte ou origem da magia "${formData.name}".`,
      limitations: `Descreva as limitações e custos do sistema de magia "${formData.name}".`
    };

    try {
      const result = await onGenerateWithAI('magicSystem_field', prompts[field]);
      if (result) {
        setFormData(prev => ({ ...prev, [field]: result }));
        toast.success(`${field} gerado com sucesso!`);
      }
    } catch (error) {
      toast.error(`Erro ao gerar ${field}`);
    } finally {
      setActiveField('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {system ? 'Editar Sistema de Magia' : 'Adicionar Sistema de Magia'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-field"
            placeholder="Nome do Sistema de Magia"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="textarea-field"
            placeholder="Descrição geral"
          />
          <textarea
            value={formData.rules}
            onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
            className="textarea-field"
            placeholder="Regras principais"
          />
          <textarea
            value={formData.source}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            className="textarea-field"
            placeholder="Fonte da magia"
          />
          <textarea
            value={formData.limitations}
            onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
            className="textarea-field"
            placeholder="Limitações e custos"
          />
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
            <button type="submit" className="btn-primary">{system ? 'Atualizar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagicSystemFormModal;
