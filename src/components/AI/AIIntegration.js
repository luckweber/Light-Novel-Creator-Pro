import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Loader, 
  Settings, 
  RefreshCw,
  Key,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const AIIntegration = ({ onSettingsClick }) => {
  const { settings } = useStore();
  const [testingProviders, setTestingProviders] = useState({});
  const [providerStatus, setProviderStatus] = useState({});

  const aiProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 e outros modelos avançados',
      website: 'https://platform.openai.com',
      color: 'green',
      icon: '🤖'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3.5 Sonnet, Opus e Haiku',
      website: 'https://console.anthropic.com',
      color: 'purple',
      icon: '🧠'
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini Pro e Flash',
      website: 'https://ai.google.dev',
      color: 'blue',
      icon: '🔍'
    },
    {
      id: 'groq',
      name: 'Groq',
      description: 'Llama 3 e Mixtral ultra-rápidos',
      website: 'https://console.groq.com',
      color: 'orange',
      icon: '⚡'
    }
  ];

  useEffect(() => {
    // Verificar status inicial dos provedores
    aiProviders.forEach(provider => {
      const providerSettings = settings?.aiProviders?.[provider.id];
      if (providerSettings?.apiKey && providerSettings?.enabled) {
        testConnection(provider.id);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testConnection = async (providerId) => {
    setTestingProviders(prev => ({ ...prev, [providerId]: true }));
    
    try {
      // Simular teste de conexão (em uma implementação real, você faria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const providerSettings = settings?.aiProviders?.[providerId];
      if (providerSettings?.apiKey && providerSettings.apiKey.length > 10) {
        setProviderStatus(prev => ({ ...prev, [providerId]: 'connected' }));
        toast.success(`Conexão com ${aiProviders.find(p => p.id === providerId)?.name} estabelecida!`);
      } else {
        throw new Error('API Key inválida');
      }
    } catch (error) {
      setProviderStatus(prev => ({ ...prev, [providerId]: 'error' }));
      toast.error(`Erro ao conectar com ${aiProviders.find(p => p.id === providerId)?.name}`);
    } finally {
      setTestingProviders(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const getProviderStatusColor = (providerId) => {
    const status = providerStatus[providerId];
    const isEnabled = settings?.aiProviders?.[providerId]?.enabled;
    const hasApiKey = settings?.aiProviders?.[providerId]?.apiKey;
    
    if (!isEnabled) return 'gray';
    if (!hasApiKey) return 'yellow';
    if (status === 'connected') return 'green';
    if (status === 'error') return 'red';
    return 'blue';
  };

  const getProviderStatusIcon = (providerId) => {
    const status = providerStatus[providerId];
    const isEnabled = settings?.aiProviders?.[providerId]?.enabled;
    const hasApiKey = settings?.aiProviders?.[providerId]?.apiKey;
    const isTesting = testingProviders[providerId];
    
    if (isTesting) return <Loader className="h-4 w-4 animate-spin" />;
    if (!isEnabled) return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    if (!hasApiKey) return <Key className="h-4 w-4 text-yellow-500" />;
    if (status === 'connected') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full bg-blue-300" />;
  };

  const getProviderStatusText = (providerId) => {
    const status = providerStatus[providerId];
    const isEnabled = settings?.aiProviders?.[providerId]?.enabled;
    const hasApiKey = settings?.aiProviders?.[providerId]?.apiKey;
    const isTesting = testingProviders[providerId];
    
    if (isTesting) return 'Testando...';
    if (!isEnabled) return 'Desabilitado';
    if (!hasApiKey) return 'API Key necessária';
    if (status === 'connected') return 'Conectado';
    if (status === 'error') return 'Erro de conexão';
    return 'Não testado';
  };

  const connectedProviders = aiProviders.filter(p => 
    settings?.aiProviders?.[p.id]?.enabled && 
    settings?.aiProviders?.[p.id]?.apiKey &&
    providerStatus[p.id] === 'connected'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Integração com IA</h3>
            <p className="text-sm text-gray-500">
              {connectedProviders.length > 0 
                ? `${connectedProviders.length} provedor(es) conectado(s)`
                : 'Nenhum provedor configurado'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onSettingsClick}
            className="btn-outline flex items-center text-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            Configurar
          </button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="mb-6">
        {connectedProviders.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-green-900">IA Configurada</h4>
                <p className="text-sm text-green-700">
                  Você pode usar as funcionalidades de IA para gerar conteúdo, personagens e muito mais!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Configure sua IA</h4>
                <p className="text-sm text-blue-700">
                  Configure pelo menos um provedor de IA para desbloquear funcionalidades avançadas de geração de conteúdo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Provedores */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Provedores Disponíveis</h4>
        
        {aiProviders.map(provider => {
          const providerSettings = settings?.aiProviders?.[provider.id] || {};
          
          return (
            <div 
              key={provider.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                providerSettings.enabled 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">{provider.icon}</div>
                <div>
                  <div className="flex items-center">
                    <h5 className="text-sm font-medium text-gray-900 mr-2">{provider.name}</h5>
                    {getProviderStatusIcon(provider.id)}
                  </div>
                  <p className="text-xs text-gray-500">{provider.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Status: {getProviderStatusText(provider.id)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {providerSettings.apiKey && providerSettings.enabled && (
                  <button
                    onClick={() => testConnection(provider.id)}
                    disabled={testingProviders[provider.id]}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    title="Testar conexão"
                  >
                    <RefreshCw className={`h-4 w-4 ${testingProviders[provider.id] ? 'animate-spin' : ''}`} />
                  </button>
                )}
                
                <button
                  onClick={() => window.open(provider.website, '_blank')}
                  className="text-gray-400 hover:text-gray-600"
                  title="Abrir website"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Setup */}
      {connectedProviders.length === 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">🚀 Setup Rápido</h4>
          <p className="text-sm text-gray-600 mb-3">
            Recomendamos começar com o OpenAI (mais popular) ou Groq (mais rápido e gratuito):
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onSettingsClick();
                // Simular clique na aba AI
                setTimeout(() => {
                  const aiTab = document.querySelector('[data-tab="ai"]');
                  if (aiTab) aiTab.click();
                }, 100);
              }}
              className="btn-primary text-sm"
            >
              Configurar OpenAI
            </button>
            <button
              onClick={() => {
                window.open('https://console.groq.com', '_blank');
              }}
              className="btn-outline text-sm"
            >
              Obter Groq (Gratuito)
            </button>
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-xs font-medium text-gray-700 mb-2">💡 Dicas:</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Groq oferece modelos gratuitos e muito rápidos</li>
          <li>• OpenAI tem os modelos mais avançados (GPT-4)</li>
          <li>• Claude (Anthropic) é excelente para textos longos</li>
          <li>• Você pode configurar múltiplos provedores e alternar entre eles</li>
        </ul>
      </div>
    </div>
  );
};

export default AIIntegration;
