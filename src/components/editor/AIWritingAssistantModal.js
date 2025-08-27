import React, { useState } from 'react';
import { X, Sparkles, Wand2, BookOpen, Users, MapPin } from 'lucide-react';

const AIWritingAssistantModal = ({
  onClose,
  onGenerate,
  isGenerating,
  worldData,
  characters,
  selectedText
}) => {
  const [prompt, setPrompt] = useState('');
  const [assistantType, setAssistantType] = useState('continue');
  const [contextOptions, setContextOptions] = useState({
    useCharacters: true,
    useLocations: true,
    useSelectedText: true
  });

  const assistantTypes = [
    { value: 'continue', label: 'Continuar História', icon: BookOpen, desc: 'Continue escrevendo de onde parou' },
    { value: 'character', label: 'Foco em Personagem', icon: Users, desc: 'Desenvolva um personagem específico' },
    { value: 'scene', label: 'Nova Cena', icon: MapPin, desc: 'Crie uma nova cena ou cenário' },
    { value: 'dialogue', label: 'Diálogo', icon: Wand2, desc: 'Gere conversas naturais' },
    { value: 'action', label: 'Cena de Ação', icon: Sparkles, desc: 'Escreva sequências dinâmicas' },
    { value: 'custom', label: 'Personalizado', icon: Wand2, desc: 'Prompt totalmente customizado' }
  ];

  const handleGenerate = () => {
    const context = {
      type: assistantType,
      prompt: prompt,
      options: contextOptions,
      selectedText: contextOptions.useSelectedText ? selectedText : null
    };
    onGenerate(context);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
              Assistente de Escrita IA
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Tipo de Assistência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Assistência
            </label>
            <div className="grid grid-cols-2 gap-3">
              {assistantTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setAssistantType(type.value)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    assistantType === type.value
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <type.icon className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Texto Selecionado */}
          {selectedText && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-1">Texto Selecionado:</p>
              <p className="text-sm text-blue-700 italic">
                "{selectedText.substring(0, 200)}{selectedText.length > 200 ? '...' : ''}"
              </p>
            </div>
          )}

          {/* Prompt Personalizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {assistantType === 'custom' ? 'Prompt Personalizado' : 'Instruções Adicionais (Opcional)'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                assistantType === 'custom' 
                  ? 'Descreva exatamente o que você quer que a IA escreva...'
                  : 'Ex: "Inclua mais tensão emocional", "Foque no desenvolvimento do protagonista"...'
              }
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Opções de Contexto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contexto a Incluir
            </label>
            <div className="space-y-2">
              {selectedText && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contextOptions.useSelectedText}
                    onChange={(e) => setContextOptions(prev => ({
                      ...prev,
                      useSelectedText: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Usar texto selecionado</span>
                </label>
              )}
              
              {characters.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contextOptions.useCharacters}
                    onChange={(e) => setContextOptions(prev => ({
                      ...prev,
                      useCharacters: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Incluir informações dos personagens ({characters.length})
                  </span>
                </label>
              )}
              
              {worldData?.locations?.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contextOptions.useLocations}
                    onChange={(e) => setContextOptions(prev => ({
                      ...prev,
                      useLocations: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Incluir informações dos locais ({worldData.locations.length})
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (assistantType === 'custom' && !prompt.trim())}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Texto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistantModal;
