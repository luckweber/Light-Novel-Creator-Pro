import React from 'react';
import { Settings as SettingsIcon, Globe, Clock, Save } from 'lucide-react';
import useStore from '../../store/useStore';

const GeneralSettings = () => {
  const { settings, updateSettings } = useStore();

  const handleSettingChange = (field, value) => {
    updateSettings({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Configurações Básicas */}
      <div className="card">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Básicas</h3>
            <p className="text-sm text-gray-500">Configurações fundamentais da aplicação</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Idioma */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma da Interface
            </label>
            <select
              value={settings?.language || 'pt-BR'}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input-field"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
            </select>
          </div>

          {/* Fuso Horário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={settings?.timezone || 'America/Sao_Paulo'}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="input-field"
            >
              <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
            </select>
          </div>

          {/* Formato de Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Data
            </label>
            <select
              value={settings?.dateFormat || 'DD/MM/YYYY'}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="input-field"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configurações de Performance */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-500">Otimizações de velocidade e recursos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Save className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-save</label>
                <p className="text-sm text-gray-500">Salvar automaticamente a cada</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="30"
                max="300"
                step="30"
                value={settings?.autoSaveInterval || 60}
                onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-12">{settings?.autoSaveInterval || 60}s</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Sincronização em Tempo Real</label>
                <p className="text-sm text-gray-500">Sincronizar mudanças automaticamente</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.realTimeSync !== false}
              onChange={(e) => handleSettingChange('realTimeSync', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Cache de Dados</label>
                <p className="text-sm text-gray-500">Armazenar dados em cache para melhor performance</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.enableCache !== false}
              onChange={(e) => handleSettingChange('enableCache', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Configurações de Acessibilidade */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acessibilidade</h3>
            <p className="text-sm text-gray-500">Configurações para melhorar a acessibilidade</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Alto Contraste</label>
                <p className="text-sm text-gray-500">Usar tema de alto contraste</p>
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
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Reduzir Animação</label>
                <p className="text-sm text-gray-500">Minimizar animações na interface</p>
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
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Tamanho do Texto</label>
                <p className="text-sm text-gray-500">Ajustar tamanho do texto da interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="12"
                max="20"
                step="1"
                value={settings?.uiFontSize || 14}
                onChange={(e) => handleSettingChange('uiFontSize', parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-8">{settings?.uiFontSize || 14}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
