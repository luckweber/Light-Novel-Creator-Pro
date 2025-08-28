import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

// Configurações para cada tipo de item
const ITEM_CONFIGS = {
  landmark: {
    title: 'Marco',
    icon: '🏛️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      significance: { type: 'textarea', label: 'Significado', required: false },
      location: { type: 'text', label: 'Localização', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      features: { type: 'textarea', label: 'Características', required: false },
      accessibility: { type: 'text', label: 'Acessibilidade', required: false },
      legends: { type: 'textarea', label: 'Lendas', required: false },
      visitors: { type: 'text', label: 'Visitantes', required: false }
    }
  },
  location: {
    title: 'Local',
    icon: '📍',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      climate: { type: 'text', label: 'Clima', required: false },
      population: { type: 'text', label: 'População', required: false },
      culture: { type: 'text', label: 'Cultura', required: false },
      government: { type: 'text', label: 'Governo', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      pointsOfInterest: { type: 'array', label: 'Pontos de Interesse', required: false },
      atmosphere: { type: 'text', label: 'Atmosfera', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false }
    }
  },
  magicSystem: {
    title: 'Sistema Mágico',
    icon: '✨',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      rules: { type: 'textarea', label: 'Regras', required: false },
      source: { type: 'text', label: 'Fonte de Poder', required: false },
      limitations: { type: 'textarea', label: 'Limitações', required: false }
    }
  },
  language: {
    title: 'Idioma',
    icon: '🗣️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      family: { type: 'text', label: 'Família Linguística', required: false },
      speakers: { type: 'text', label: 'Falantes', required: false },
      script: { type: 'text', label: 'Sistema de Escrita', required: false },
      examples: { type: 'object', label: 'Exemplos', required: false },
      dialects: { type: 'object', label: 'Dialetos', required: false },
      culturalInfluence: { type: 'textarea', label: 'Influência Cultural', required: false },
      socialStatus: { type: 'text', label: 'Status Social', required: false },
      evolution: { type: 'textarea', label: 'Evolução', required: false }
    }
  },
  people: {
    title: 'Povo',
    icon: '👥',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      physicalTraits: { type: 'textarea', label: 'Traços Físicos', required: false },
      culture: { type: 'textarea', label: 'Cultura', required: false },
      socialStructure: { type: 'textarea', label: 'Estrutura Social', required: false },
      specialAbilities: { type: 'textarea', label: 'Habilidades Especiais', required: false },
      relationships: { type: 'textarea', label: 'Relacionamentos', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      values: { type: 'textarea', label: 'Valores', required: false },
      territory: { type: 'text', label: 'Território', required: false },
      population: { type: 'text', label: 'População', required: false },
      language: { type: 'text', label: 'Idioma', required: false },
      religion: { type: 'text', label: 'Religião', required: false },
      technology: { type: 'text', label: 'Tecnologia', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },
  religion: {
    title: 'Religião',
    icon: '⛪',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: false },
      deities: { type: 'textarea', label: 'Divindades', required: false },
      dogmas: { type: 'textarea', label: 'Dogmas', required: false },
      rituals: { type: 'textarea', label: 'Rituais', required: false },
      hierarchy: { type: 'textarea', label: 'Hierarquia', required: false },
      sacredPlaces: { type: 'textarea', label: 'Locais Sagrados', required: false },
      sacredTexts: { type: 'textarea', label: 'Textos Sagrados', required: false },
      festivals: { type: 'textarea', label: 'Festivais', required: false },
      relationships: { type: 'textarea', label: 'Relações', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      secrets: { type: 'textarea', label: 'Segredos', required: false }
    }
  },
  tradition: {
    title: 'Tradição',
    icon: '🎭',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: false },
      origin: { type: 'textarea', label: 'Origem', required: false },
      practice: { type: 'textarea', label: 'Prática', required: false },
      meaning: { type: 'textarea', label: 'Significado', required: false },
      participants: { type: 'text', label: 'Participantes', required: false },
      frequency: { type: 'text', label: 'Frequência', required: false },
      symbols: { type: 'textarea', label: 'Símbolos', required: false },
      variations: { type: 'textarea', label: 'Variações', required: false },
      importance: { type: 'textarea', label: 'Importância', required: false },
      evolution: { type: 'textarea', label: 'Evolução', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },
  event: {
    title: 'Evento',
    icon: '📅',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      date: { type: 'text', label: 'Data', required: false },
      location: { type: 'text', label: 'Local', required: false },
      characters: { type: 'textarea', label: 'Personagens', required: false },
      description: { type: 'textarea', label: 'Descrição', required: true },
      causes: { type: 'textarea', label: 'Causas', required: false },
      consequences: { type: 'textarea', label: 'Consequências', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      legacy: { type: 'textarea', label: 'Legado', required: false },
      sources: { type: 'textarea', label: 'Fontes', required: false },
      controversies: { type: 'textarea', label: 'Controvérsias', required: false },
      lessons: { type: 'textarea', label: 'Lições', required: false }
    }
  },
  era: {
    title: 'Era',
    icon: '⏰',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      startYear: { type: 'text', label: 'Ano de Início', required: false },
      endYear: { type: 'text', label: 'Ano de Fim', required: false },
      description: { type: 'textarea', label: 'Descrição', required: true },
      characteristics: { type: 'textarea', label: 'Características', required: false },
      majorEvents: { type: 'textarea', label: 'Eventos Principais', required: false },
      keyFigures: { type: 'textarea', label: 'Figuras Importantes', required: false },
      culturalChanges: { type: 'textarea', label: 'Mudanças Culturais', required: false },
      technologicalAdvances: { type: 'textarea', label: 'Avanços Tecnológicos', required: false },
      socialStructures: { type: 'textarea', label: 'Estruturas Sociais', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false },
      achievements: { type: 'textarea', label: 'Conquistas', required: false },
      legacy: { type: 'textarea', label: 'Legado', required: false },
      transition: { type: 'textarea', label: 'Transição', required: false }
    }
  },
  region: {
    title: 'Região',
    icon: '🗺️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      geography: { type: 'textarea', label: 'Geografia', required: false },
      climate: { type: 'text', label: 'Clima', required: false },
      population: { type: 'text', label: 'População', required: false },
      government: { type: 'text', label: 'Governo', required: false },
      economy: { type: 'text', label: 'Economia', required: false },
      culture: { type: 'textarea', label: 'Cultura', required: false },
      history: { type: 'textarea', label: 'História', required: false },
      borders: { type: 'textarea', label: 'Fronteiras', required: false },
      resources: { type: 'textarea', label: 'Recursos', required: false },
      conflicts: { type: 'textarea', label: 'Conflitos', required: false }
    }
  },
  resource: {
    title: 'Recurso',
    icon: '💎',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      location: { type: 'text', label: 'Localização', required: false },
      rarity: { type: 'select', label: 'Raridade', options: ['Comum', 'Incomum', 'Raro', 'Muito Raro', 'Lendário'], required: false },
      value: { type: 'text', label: 'Valor', required: false },
      uses: { type: 'textarea', label: 'Usos', required: false },
      extraction: { type: 'textarea', label: 'Extração', required: false },
      trade: { type: 'textarea', label: 'Comércio', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      regulations: { type: 'textarea', label: 'Regulamentações', required: false }
    }
  },
  technology: {
    title: 'Tecnologia',
    icon: '⚙️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      inventor: { type: 'text', label: 'Inventor', required: false },
      year: { type: 'text', label: 'Ano', required: false },
      materials: { type: 'textarea', label: 'Materiais', required: false },
      process: { type: 'textarea', label: 'Processo', required: false },
      applications: { type: 'textarea', label: 'Aplicações', required: false },
      limitations: { type: 'textarea', label: 'Limitações', required: false },
      impact: { type: 'textarea', label: 'Impacto', required: false },
      distribution: { type: 'textarea', label: 'Distribuição', required: false },
      maintenance: { type: 'textarea', label: 'Manutenção', required: false }
    }
  },
  government: {
    title: 'Governo',
    icon: '🏛️',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      leader: { type: 'text', label: 'Líder', required: false },
      structure: { type: 'textarea', label: 'Estrutura', required: false },
      laws: { type: 'textarea', label: 'Leis', required: false },
      military: { type: 'textarea', label: 'Militar', required: false },
      economy: { type: 'textarea', label: 'Economia', required: false },
      foreignPolicy: { type: 'textarea', label: 'Política Externa', required: false },
      stability: { type: 'text', label: 'Estabilidade', required: false },
      corruption: { type: 'textarea', label: 'Corrupção', required: false },
      challenges: { type: 'textarea', label: 'Desafios', required: false }
    }
  },
  economy: {
    title: 'Economia',
    icon: '💰',
    fields: {
      name: { type: 'text', label: 'Nome', required: true },
      type: { type: 'text', label: 'Tipo', required: true },
      description: { type: 'textarea', label: 'Descrição', required: true },
      currency: { type: 'text', label: 'Moeda', required: false },
      trade: { type: 'textarea', label: 'Comércio', required: false },
      resources: { type: 'textarea', label: 'Recursos', required: false },
      industries: { type: 'textarea', label: 'Indústrias', required: false },
      wealth: { type: 'text', label: 'Riqueza', required: false },
      inequality: { type: 'textarea', label: 'Desigualdade', required: false },
      regulations: { type: 'textarea', label: 'Regulamentações', required: false },
      challenges: { type: 'textarea', label: 'Desafios', required: false },
      opportunities: { type: 'textarea', label: 'Oportunidades', required: false }
    }
  }
};

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
            value={Array.isArray(value) ? value.join('\n') : (typeof value === 'object' ? displayValue : '')}
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
            value={displayValue}
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
      return null;
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
      setFormData(item);
    } else {
      // Cria objeto com valores padrão baseado na configuração
      const defaultData = {};
      Object.entries(config.fields).forEach(([field, fieldConfig]) => {
        switch (fieldConfig.type) {
          case 'array':
            defaultData[field] = [];
            break;
          case 'object':
            defaultData[field] = {};
            break;
          default:
            defaultData[field] = '';
        }
      });
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
    
    Object.entries(config.fields).forEach(([field, fieldConfig]) => {
      if (fieldConfig.required) {
        const value = formData[field];
        if (!value || (typeof value === 'string' && !value.trim()) || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0)) {
          newErrors[field] = `${fieldConfig.label} é obrigatório`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Adiciona metadados se não existirem
    const dataToSave = {
      ...formData,
      generatedBy: formData.generatedBy || 'Manual',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {Object.entries(config.fields).map(([field, fieldConfig]) => (
              <div key={field}>
                <DynamicField
                  field={field}
                  value={formData[field]}
                  onChange={handleFieldChange}
                  config={fieldConfig}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversalFormModal;
