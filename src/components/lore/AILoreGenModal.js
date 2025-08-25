import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const AILoreGenModal = ({
  onClose,
  onGenerate,
  isGenerating,
  loreTypes
}) => {
  const [prompt, setPrompt] = useState('');
  const [loreType, setLoreType] = useState('myth');

  const handleGenerate = () => {
    onGenerate(prompt, loreType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
            Gerar Lore com IA
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descreva o que você quer criar (opcional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="textarea-field"
              rows="3"
              placeholder="Ex: uma lenda sobre uma espada amaldiçoada..."
            />
            <p className="text-xs text-gray-500 mt-1">Deixe em branco para um item de lore completamente aleatório.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Lore
            </label>
            <select
              value={loreType}
              onChange={(e) => setLoreType(e.target.value)}
              className="input-field"
            >
              {loreTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary"
          >
            {isGenerating ? 'Gerando...' : 'Gerar Item de Lore'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AILoreGenModal;
