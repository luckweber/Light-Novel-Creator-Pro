import React from 'react';
import { FileText, Type, Monitor } from 'lucide-react';
import useStore from '../../store/useStore';

const EditorSettings = () => {
  const { settings, updateSettings } = useStore();

  const fontFamilies = [
    {
      value: 'Inter',
      label: 'Inter',
      description: 'Fonte moderna e legível',
      preview: 'Inter, sans-serif',
      sample: 'AaBbCcDdEeFf'
    },
    {
      value: 'Roboto',
      label: 'Roboto',
      description: 'Fonte clara e profissional',
      preview: 'Roboto, sans-serif',
      sample: 'AaBbCcDdEeFf'
    },
    {
      value: 'Open Sans',
      label: 'Open Sans',
      description: 'Fonte aberta e acessível',
      preview: 'Open Sans, sans-serif',
      sample: 'AaBbCcDdEeFf'
    },
    {
      value: 'Lora',
      label: 'Lora',
      description: 'Fonte serif elegante',
      preview: 'Lora, serif',
      sample: 'AaBbCcDdEeFf'
    },
    {
      value: 'Source Code Pro',
      label: 'Source Code Pro',
      description: 'Fonte monospace para código',
      preview: 'Source Code Pro, monospace',
      sample: 'AaBbCcDdEeFf'
    },
    {
      value: 'Merriweather',
      label: 'Merriweather',
      description: 'Fonte serif para leitura',
      preview: 'Merriweather, serif',
      sample: 'AaBbCcDdEeFf'
    }
  ];

  const handleSettingChange = (field, value) => {
    updateSettings({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Configurações de Texto */}
      <div className="card">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editor de Texto</h3>
            <p className="text-sm text-gray-500">Personalize sua experiência de escrita</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Família de Fonte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Família de Fonte
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontFamilies.map((font) => (
                <div
                  key={font.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings?.fontFamily === font.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSettingChange('fontFamily', font.value)}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">{font.label}</h4>
                    <p className="text-xs text-gray-500 mb-3">{font.description}</p>
                    <div 
                      className="text-lg"
                      style={{ fontFamily: font.preview }}
                    >
                      {font.sample}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tamanho da Fonte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tamanho da Fonte: {settings?.fontSize || 16}px
            </label>
            <input
              type="range"
              min="12"
              max="28"
              step="1"
              value={settings?.fontSize || 16}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Pequena (12px)</span>
              <span>Grande (28px)</span>
            </div>
          </div>

          {/* Altura da Linha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Altura da Linha: {settings?.lineHeight || 1.6}
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings?.lineHeight || 1.6}
              onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Compacta (1.2)</span>
              <span>Espaçada (2.5)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Comportamento */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Monitor className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Comportamento</h3>
            <p className="text-sm text-gray-500">Configurações de funcionamento do editor</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Type className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-save</label>
                <p className="text-sm text-gray-500">Salvar automaticamente enquanto escreve</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoSave !== false}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Type className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Numeração de Linhas</label>
                <p className="text-sm text-gray-500">Mostrar números das linhas</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.showLineNumbers || false}
              onChange={(e) => handleSettingChange('showLineNumbers', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Type className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Modo de Foco</label>
                <p className="text-sm text-gray-500">Escurecer outras áreas durante a escrita</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.focusMode || false}
              onChange={(e) => handleSettingChange('focusMode', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Type className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Histórico de Desfazer</label>
                <p className="text-sm text-gray-500">Número de ações para desfazer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={settings?.undoHistorySize || 50}
                onChange={(e) => handleSettingChange('undoHistorySize', parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-8">{settings?.undoHistorySize || 50}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;
