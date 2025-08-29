import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { WORLD_BUILDER_SCHEMAS, SchemaUtils } from '../../data/worldBuilderSchemas';

// Usa os esquemas centralizados
const ITEM_CONFIGS = WORLD_BUILDER_SCHEMAS;

// Componente para renderizar campos dinamicamente
const DynamicField = ({ field, value, onChange, config }) => {
  const { type, label, required, options } = config;

  // Função para converter objetos em string para exibição
  const convertObjectToString = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object' && !Array.isArray(val)) {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return '[object Object]';
      }
    }
    return val;
  };

  // Função para processar mudanças de valor
  const handleChange = (newValue) => {
    // Se o valor original era um objeto mas agora é uma string, tenta fazer parse
    if (typeof value === 'object' && typeof newValue === 'string') {
      try {
        const parsed = JSON.parse(newValue);
        onChange(field, parsed);
      } catch {
        // Se não conseguir fazer parse, mantém como string
        onChange(field, newValue);
      }
    } else {
      onChange(field, newValue);
    }
  };

  // Converte o valor para exibição se for objeto
  const displayValue = convertObjectToString(value);

  switch (type) {
    case 'text':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={displayValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={displayValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
        </div>
      );

    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={displayValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          >
            <option value="">Selecione...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'array':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) => handleChange(e.target.value.split('\n').filter(item => item.trim()))}
            rows={3}
            placeholder="Digite um item por linha"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
        </div>
      );

    case 'object':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(parsed);
              } catch {
                // Se não for JSON válido, mantém como string
                handleChange(e.target.value);
              }
            }}
            rows={4}
            placeholder='{"chave": "valor"}'
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required={required}
          />
        </div>
      );

    default:
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={displayValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
        </div>
      );
  }
};

const UniversalFormModal = ({
  isOpen,
  onClose,
  onSave,
  itemType,
  item = null,
  title = null
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const config = ITEM_CONFIGS[itemType];

  // Inicializa o formulário com dados do item ou valores padrão
  useEffect(() => {
    if (!config) {
      console.error(`Configuração não encontrada para o tipo: ${itemType}`);
      return;
    }

    if (item) {
      // Normaliza o item usando SchemaUtils para garantir consistência
      const normalizedItem = SchemaUtils.normalizeItem(item, itemType);
      setFormData(normalizedItem);
    } else {
      // Cria objeto com valores padrão baseado na configuração
      const defaultData = SchemaUtils.createEmptyItem(itemType) || {};
      setFormData(defaultData);
    }
    setErrors({});
  }, [item, itemType, config]);

  // Early return if modal is not open or config is not found
  if (!isOpen || !config) {
    return null;
  }

  const modalTitle = title || `${item ? 'Editar' : 'Adicionar'} ${config.title}`;

  const handleFieldChange = (field, value) => {
    // Se o valor é uma string que parece ser JSON de um objeto, tenta fazer parse
    let processedValue = value;
    if (typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
      try {
        const parsed = JSON.parse(value);
        processedValue = parsed;
      } catch {
        // Se não conseguir fazer parse, mantém como string
        processedValue = value;
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Remove erro do campo se foi corrigido
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Valida usando SchemaUtils
    const validation = SchemaUtils.validateItem(formData, itemType);
    if (!validation.valid) {
      validation.errors.forEach(error => {
        // Extrai o nome do campo do erro
        const fieldMatch = error.match(/Campo "([^"]+)" é obrigatório/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          // Encontra o campo correspondente
          Object.entries(config.fields).forEach(([field, fieldConfig]) => {
            if (fieldConfig.label === fieldName) {
              newErrors[field] = error;
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Normaliza o item antes de salvar
      const normalizedData = SchemaUtils.normalizeItem(formData, itemType);
      onSave(normalizedData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {Object.entries(config.fields).map(([field, fieldConfig]) => (
              <DynamicField
                key={field}
                field={field}
                value={formData[field]}
                onChange={handleFieldChange}
                config={fieldConfig}
              />
            ))}

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="text-sm font-medium text-red-800 mb-2">Erros encontrados:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversalFormModal;
