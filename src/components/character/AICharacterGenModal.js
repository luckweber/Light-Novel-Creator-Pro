import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const AICharacterGenModal = ({
  onClose,
  onGenerate,
  isGenerating,
  regions // Adicionar regions
}) => {
  const [prompt, setPrompt] = useState('');
  const [characterType, setCharacterType] = useState('protagonist');
  const [region, setRegion] = useState(''); // Adicionar estado para região

  const characterTypes = [
    { value: 'protagonist', label: 'Protagonista' },
    { value: 'antagonist', label: 'Antagonista' },
    { value: 'supporting', label: 'Coadjuvante' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'love_interest', label: 'Interesse Romântico' },
    { value: 'any', label: 'Qualquer' }
  ];

  const handleGenerate = () => {
    onGenerate(prompt, characterType, region); // Passar região
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
            Gerar Personagem com IA
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descreva o personagem (opcional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="textarea-field"
              rows="3"
              placeholder="Ex: um cavaleiro sombrio com um passado trágico e um senso de humor sarcástico."
            />
            <p className="text-xs text-gray-500 mt-1">Deixe em branco para um personagem completamente aleatório.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Personagem
              </label>
              <select
                value={characterType}
                onChange={(e) => setCharacterType(e.target.value)}
                className="input-field"
              >
                {characterTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Região de Origem (Opcional)
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="input-field"
                disabled={!regions || regions.length === 0}
              >
                <option value="">Aleatória</option>
                {regions && regions.map(r => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
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
            {isGenerating ? 'Gerando...' : 'Gerar Personagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICharacterGenModal;
