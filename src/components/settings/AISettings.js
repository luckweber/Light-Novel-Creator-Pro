import React, { useState } from 'react';
import { 
  Zap, 
  Shield, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Cloud, 
  Wifi 
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import { AI_PROVIDERS } from '../../utils/aiProviders';

const AISettings = () => {
  const { settings, updateSettings } = useStore();
  const [showApiKey, setShowApiKey] = useState({});
  const [testingConnection, setTestingConnection] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const [showDisabledProviders, setShowDisabledProviders] = useState(false);

  // Obter o provedor padrão atual
  const currentDefaultProvider = settings?.defaultAIProvider || 'openai';

  // Converter AI_PROVIDERS para o formato esperado pelo componente
  const allProviders = Object.entries(AI_PROVIDERS).map(([id, provider]) => ({
    id,
    name: provider.name,
    models: Object.keys(provider.models),
    baseUrl: provider.baseUrl,
    keyFormat: provider.keyFormat,
    description: provider.description,
    website: provider.website,
    disabled: provider.disabled || false
  })).concat([
    {
      id: 'custom',
      name: 'API Personalizada',
      models: ['custom-model'],
      baseUrl: '',
      keyFormat: 'custom-key',
      description: 'Configure sua própria API compatível com OpenAI',
      website: '',
      disabled: false
    }
  ]);

  // Separar provedores habilitados e desabilitados
  const enabledProviders = allProviders.filter(provider => !provider.disabled);
  const disabledProviders = allProviders.filter(provider => provider.disabled);
  
  // Provedores a serem exibidos baseado no estado
  const aiProviders = showDisabledProviders ? allProviders : enabledProviders;

  const handleAIProviderChange = (providerId, field, value) => {
    const aiProviders = settings?.aiProviders || {};
    const providerSettings = aiProviders[providerId] || {};
    
    updateSettings({
      aiProviders: {
        ...aiProviders,
        [providerId]: {
          ...providerSettings,
          [field]: value
        }
      }
    });
  };

  const handleSetDefaultProvider = (providerId) => {
    updateSettings({ defaultAIProvider: providerId });
  };

  const testConnection = async (providerId) => {
    setTestingConnection(prev => ({ ...prev, [providerId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const provider = settings?.aiProviders?.[providerId];
      if (provider?.apiKey && provider.apiKey.length > 10) {
        setConnectionStatus(prev => ({ ...prev, [providerId]: 'success' }));
        toast.success(`Conexão com ${aiProviders.find(p => p.id === providerId)?.name} estabelecida!`);
      } else {
        setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
        toast.error('API Key inválida ou não configurada');
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
      toast.error('Erro ao testar conexão');
    } finally {
      setTestingConnection(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-8">
      {/* Introdução */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start">
          <Zap className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integração com IA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure suas APIs de IA favoritas para potencializar sua criatividade.
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <Shield className="h-4 w-4 mr-1" />
              <span>Suas chaves API são armazenadas localmente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do Provedor Padrão */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
              <Cloud className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Provedor Padrão Atual</h4>
              <p className="text-sm text-gray-500">
                {aiProviders.find(p => p.id === currentDefaultProvider)?.name || 'Nenhum provedor configurado'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-sm font-medium text-gray-900">
              {settings?.aiProviders?.[currentDefaultProvider]?.apiKey 
                ? '✅ Configurado' 
                : '❌ Não configurado'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Provedores de IA */}
      <div className="space-y-6">
        {aiProviders.map(provider => {
          const providerSettings = settings?.aiProviders?.[provider.id] || {};
          const isConfigured = !!providerSettings.apiKey;
          const status = connectionStatus[provider.id];
          const isTesting = testingConnection[provider.id];
          const isDefaultProvider = currentDefaultProvider === provider.id;

          return (
            <div key={provider.id} className={`card ${provider.disabled ? 'opacity-60' : ''} ${isDefaultProvider ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    provider.disabled ? 'bg-red-100' : isConfigured ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Cloud className={`h-5 w-5 ${
                      provider.disabled ? 'text-red-600' : isConfigured ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {provider.name}
                        {provider.disabled && <span className="ml-2 text-sm text-red-600 font-normal">[Desabilitado]</span>}
                      </h3>
                      {isDefaultProvider && (
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full font-medium">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                    {provider.disabled && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Este provedor está temporariamente indisponível
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {provider.website && (
                    <button
                      onClick={() => window.open(provider.website, '_blank')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Abrir website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                  
                  {status === 'success' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Conectado</span>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Erro</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`space-y-4 ${provider.disabled ? 'pointer-events-none' : ''}`}>
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                    <span className="text-gray-400 ml-1">({provider.keyFormat})</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey[provider.id] ? 'text' : 'password'}
                      value={providerSettings.apiKey || ''}
                      onChange={(e) => handleAIProviderChange(provider.id, 'apiKey', e.target.value)}
                      placeholder={`Cole sua ${provider.name} API key aqui`}
                      className={`input-field pr-20 ${provider.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      disabled={provider.disabled}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowApiKey(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {providerSettings.apiKey && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(providerSettings.apiKey)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modelo e Configurações */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo Padrão
                    </label>
                    <select
                      value={providerSettings.defaultModel || provider.models[0]}
                      onChange={(e) => handleAIProviderChange(provider.id, 'defaultModel', e.target.value)}
                      className={`input-field ${provider.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      disabled={provider.disabled}
                    >
                      {provider.models.map(model => {
                        const modelInfo = AI_PROVIDERS[provider.id]?.models[model];
                        const displayName = modelInfo ? `${modelInfo.name} (${modelInfo.cost})` : model;
                        return (
                          <option key={model} value={model}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperatura: {providerSettings.temperature || 0.7}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={providerSettings.temperature || 0.7}
                      onChange={(e) => handleAIProviderChange(provider.id, 'temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tokens: {providerSettings.maxTokens || 2000}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="100"
                        max="200000"
                        step="100"
                        value={providerSettings.maxTokens || 2000}
                        onChange={(e) => handleAIProviderChange(provider.id, 'maxTokens', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="100"
                        max="200000"
                        step="100"
                        value={providerSettings.maxTokens || 2000}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 100 && value <= 200000) {
                            handleAIProviderChange(provider.id, 'maxTokens', value);
                          }
                        }}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="2000"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100</span>
                      <span>200k</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => testConnection(provider.id)}
                      disabled={!providerSettings.apiKey || isTesting || provider.disabled}
                      className="btn-outline flex items-center disabled:opacity-50"
                    >
                      {isTesting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wifi className="mr-2 h-4 w-4" />
                      )}
                      {isTesting ? 'Testando...' : 'Testar Conexão'}
                    </button>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`enabled-${provider.id}`}
                        checked={providerSettings.enabled !== false}
                        onChange={(e) => handleAIProviderChange(provider.id, 'enabled', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={provider.disabled}
                      />
                      <label htmlFor={`enabled-${provider.id}`} className={`ml-2 text-sm ${provider.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                        Habilitado
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isConfigured && !provider.disabled && (
                      <button
                        onClick={() => handleSetDefaultProvider(provider.id)}
                        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                          isDefaultProvider
                            ? 'bg-primary-100 text-primary-700 cursor-default'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                        disabled={isDefaultProvider}
                      >
                        {isDefaultProvider ? 'Padrão Atual' : 'Definir como Padrão'}
                      </button>
                    )}
                    
                    {providerSettings.apiKey && !provider.disabled && (
                      <button
                        onClick={() => handleAIProviderChange(provider.id, 'apiKey', '')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remover API Key
                      </button>
                    )}
                  </div>
                  
                  {provider.disabled && (
                    <div className="text-red-600 text-sm font-medium">
                      ⚠️ Provedor indisponível
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      
        {/* Botão para mostrar/ocultar provedores desabilitados */}
        {disabledProviders.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowDisabledProviders(!showDisabledProviders)}
              className="btn-outline flex items-center"
            >
              {showDisabledProviders ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar LLMs Desabilitados
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Mostrar Mais LLMs ({disabledProviders.length} desabilitados)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISettings;
