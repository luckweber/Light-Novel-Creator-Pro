import React from 'react';
import { Palette, Moon, Sun, Monitor, Eye, EyeOff, Contrast, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore';

const AppearanceSettings = () => {
  const { settings, updateSettings } = useStore();

  const handleSettingChange = (field, value) => {
    updateSettings({ [field]: value });
  };

  const themes = [
    {
      id: 'light',
      name: 'Claro',
      description: 'Tema claro padrão',
      icon: Sun,
      preview: 'bg-white border-gray-200'
    },
    {
      id: 'dark',
      name: 'Escuro',
      description: 'Tema escuro para reduzir fadiga visual',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700'
    },
    {
      id: 'auto',
      name: 'Automático',
      description: 'Segue as configurações do sistema',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-100 border-gray-300'
    }
  ];

  const colorSchemes = [
    {
      id: 'blue',
      name: 'Azul',
      description: 'Tema azul profissional',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF'
    },
    {
      id: 'purple',
      name: 'Roxo',
      description: 'Tema roxo criativo',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6D28D9'
    },
    {
      id: 'green',
      name: 'Verde',
      description: 'Tema verde natureza',
      primaryColor: '#10B981',
      secondaryColor: '#059669'
    },
    {
      id: 'orange',
      name: 'Laranja',
      description: 'Tema laranja energético',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706'
    },
    {
      id: 'red',
      name: 'Vermelho',
      description: 'Tema vermelho intenso',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626'
    }
  ];

  const fontSizes = [
    { value: 'xs', label: 'Muito Pequeno', size: '12px' },
    { value: 'sm', label: 'Pequeno', size: '14px' },
    { value: 'base', label: 'Normal', size: '16px' },
    { value: 'lg', label: 'Grande', size: '18px' },
    { value: 'xl', label: 'Muito Grande', size: '20px' }
  ];

  return (
    <div className="space-y-8">
      {/* Tema */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tema</h3>
            <p className="text-sm text-gray-500">Escolha o tema visual da aplicação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            return (
              <div
                key={theme.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  settings?.theme === theme.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSettingChange('theme', theme.id)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-lg ${theme.preview} flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
                  <p className="text-xs text-gray-500">{theme.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Esquema de Cores */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Esquema de Cores</h3>
            <p className="text-sm text-gray-500">Personalize as cores principais da interface</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                settings?.colorScheme === scheme.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSettingChange('colorScheme', scheme.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: scheme.primaryColor }}
                  />
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: scheme.secondaryColor }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                  <p className="text-xs text-gray-500">{scheme.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configurações de Interface */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Eye className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interface</h3>
            <p className="text-sm text-gray-500">Configurações visuais da interface</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tamanho da Fonte da Interface */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tamanho da Fonte da Interface
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {fontSizes.map((font) => (
                <div
                  key={font.value}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    settings?.uiFontSize === font.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSettingChange('uiFontSize', font.value)}
                >
                  <div className="font-medium text-gray-900 mb-1">{font.label}</div>
                  <div className="text-xs text-gray-500">{font.size}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Configurações de Contraste */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Contrast className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Alto Contraste</label>
                  <p className="text-sm text-gray-500">Melhorar legibilidade com alto contraste</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.highContrast || false}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <EyeOff className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Reduzir Animação</label>
                  <p className="text-sm text-gray-500">Minimizar animações para melhor performance</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.reduceMotion || false}
                onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Efeitos Visuais</label>
                  <p className="text-sm text-gray-500">Habilitar efeitos visuais e transições</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.visualEffects !== false}
                onChange={(e) => handleSettingChange('visualEffects', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Densidade */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Monitor className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Densidade da Interface</h3>
            <p className="text-sm text-gray-500">Ajustar espaçamento e tamanho dos elementos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Densidade: {settings?.uiDensity === 'compact' ? 'Compacta' : settings?.uiDensity === 'comfortable' ? 'Confortável' : 'Espaçada'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'compact', name: 'Compacta', description: 'Mais elementos na tela' },
                { id: 'comfortable', name: 'Confortável', description: 'Espaçamento equilibrado' },
                { id: 'spacious', name: 'Espaçada', description: 'Mais espaço entre elementos' }
              ].map((density) => (
                <div
                  key={density.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings?.uiDensity === density.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSettingChange('uiDensity', density.id)}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-1">{density.name}</h4>
                    <p className="text-xs text-gray-500">{density.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Monitor className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Bordas Arredondadas</label>
                <p className="text-sm text-gray-500">Aplicar bordas arredondadas nos elementos</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.roundedCorners !== false}
              onChange={(e) => handleSettingChange('roundedCorners', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Monitor className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Sombras</label>
                <p className="text-sm text-gray-500">Adicionar sombras aos elementos</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.shadows !== false}
              onChange={(e) => handleSettingChange('shadows', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
