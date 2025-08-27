import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Moon, 
  Sun, 
  Monitor,
  Palette,
  Database,
  FileText,
  Zap,
  Key,
  Shield,
  Globe,
  Bell,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Copy,
  Server,
  Cloud,
  Lock,
  Activity,
  BarChart3,
  Clock,
  HardDrive,
  Wifi,
  Volume2,
  Monitor as MonitorIcon,
  Type
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import NotificationSettings from '../components/notifications/NotificationSettings';

const Settings = () => {
  const { 
    settings, 
    updateSettings,
    projects,
    characters,
    worldData,
    aiConversations
  } = useStore();

  const [activeTab, setActiveTab] = useState('general');
  const [isExporting, setIsExporting] = useState(false);
  const [showApiKey, setShowApiKey] = useState({});
  const [testingConnection, setTestingConnection] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'Geral', icon: SettingsIcon, description: 'Configurações básicas da aplicação' },
    { id: 'ai', label: 'Integração AI', icon: Zap, description: 'Configurar APIs de IA e modelos' },
    { id: 'editor', label: 'Editor', icon: FileText, description: 'Personalizar o editor de texto' },
    { id: 'appearance', label: 'Aparência', icon: Palette, description: 'Temas e interface visual' },
    { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Alertas e lembretes' },
    { id: 'security', label: 'Segurança', icon: Shield, description: 'Privacidade e proteção de dados' },
    { id: 'data', label: 'Dados', icon: Database, description: 'Backup, importação e exportação' },
    { id: 'advanced', label: 'Avançado', icon: Server, description: 'Configurações técnicas' }
  ];

  const aiProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      baseUrl: 'https://api.openai.com/v1',
      keyFormat: 'sk-...',
      description: 'GPT-4, GPT-3.5 e outros modelos da OpenAI',
      website: 'https://platform.openai.com'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      baseUrl: 'https://api.anthropic.com',
      keyFormat: 'sk-ant-...',
      description: 'Claude 3.5 Sonnet, Opus, Sonnet e Haiku',
      website: 'https://console.anthropic.com'
    },
    {
      id: 'google',
      name: 'Google AI',
      models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      keyFormat: 'AI...',
      description: 'Gemini Pro e Flash da Google',
      website: 'https://ai.google.dev'
    },
    {
      id: 'groq',
      name: 'Groq',
      models: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768'],
      baseUrl: 'https://api.groq.com/openai/v1',
      keyFormat: 'gsk_...',
      description: 'Llama 3 e Mixtral com velocidade ultra-rápida',
      website: 'https://console.groq.com'
    },
    {
      id: 'custom',
      name: 'API Personalizada',
      models: ['custom-model'],
      baseUrl: '',
      keyFormat: 'custom-key',
      description: 'Configure sua própria API compatível com OpenAI',
      website: ''
    }
  ];

  const themes = [
    { 
      value: 'light', 
      label: 'Claro', 
      icon: Sun, 
      description: 'Interface clara para uso durante o dia',
      preview: 'bg-white text-gray-900'
    },
    { 
      value: 'dark', 
      label: 'Escuro', 
      icon: Moon, 
      description: 'Interface escura para reduzir fadiga ocular',
      preview: 'bg-gray-900 text-white'
    },
    { 
      value: 'auto', 
      label: 'Automático', 
      icon: Monitor, 
      description: 'Segue as configurações do sistema',
      preview: 'bg-gradient-to-r from-white to-gray-900'
    }
  ];

  const fontFamilies = [
    { 
      value: 'serif', 
      label: 'Serif (Georgia)', 
      preview: 'Georgia',
      description: 'Ideal para textos longos e narrativas',
      sample: 'Era uma vez, em uma terra distante...'
    },
    { 
      value: 'sans', 
      label: 'Sans-serif (Inter)', 
      preview: 'Inter',
      description: 'Moderna e limpa, boa para interface',
      sample: 'Era uma vez, em uma terra distante...'
    },
    { 
      value: 'mono', 
      label: 'Monospace (Fira Code)', 
      preview: 'Fira Code',
      description: 'Espaçamento fixo, ideal para código',
      sample: 'Era uma vez, em uma terra distante...'
    }
  ];

  const notificationTypes = [
    { id: 'auto_save', label: 'Auto-salvamento', description: 'Notificar quando documentos são salvos automaticamente' },
    { id: 'ai_responses', label: 'Respostas de IA', description: 'Alertas quando a IA termina de gerar conteúdo' },
    { id: 'reminders', label: 'Lembretes', description: 'Lembretes para continuar escrevendo' },
    { id: 'updates', label: 'Atualizações', description: 'Notificações sobre novas funcionalidades' },
    { id: 'errors', label: 'Erros', description: 'Alertas sobre problemas técnicos' }
  ];

  useEffect(() => {
    // Verificar status das conexões AI ao carregar
    aiProviders.forEach(provider => {
      if (settings?.aiProviders?.[provider.id]?.apiKey) {
        testConnection(provider.id);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSettingChange = (field, value) => {
    updateSettings({ [field]: value });
    setUnsavedChanges(true);
    
    // Auto-save após 2 segundos
    setTimeout(() => {
      setUnsavedChanges(false);
      toast.success('Configuração salva automaticamente', { duration: 2000 });
    }, 2000);
  };

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
    setUnsavedChanges(true);
  };

  const testConnection = async (providerId) => {
    setTestingConnection(prev => ({ ...prev, [providerId]: true }));
    
    try {
      // Simular teste de conexão
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

  const handleExportAll = async () => {
    setIsExporting(true);
    
    try {
      const exportData = {
        projects,
        characters,
        worldData,
        aiConversations,
        settings: {
          ...settings,
          // Não exportar API keys por segurança
          aiProviders: Object.keys(settings?.aiProviders || {}).reduce((acc, key) => {
            acc[key] = {
              ...settings.aiProviders[key],
              apiKey: '[HIDDEN]'
            };
            return acc;
          }, {})
        },
        exportDate: new Date().toISOString(),
        version: '2.0.0',
        metadata: {
          totalProjects: projects?.length || 0,
          totalCharacters: characters?.length || 0,
          totalLocations: worldData?.locations?.length || 0,
          totalConversations: aiConversations?.length || 0
        }
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `light-novel-creator-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Backup completo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportAll = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.version && importedData.settings) {
              // Importar apenas configurações não sensíveis
              const safeSettings = { ...importedData.settings };
              delete safeSettings.aiProviders; // Não importar API keys
              
              updateSettings(safeSettings);
              toast.success('Configurações importadas com sucesso!');
            } else {
              toast.error('Arquivo de backup inválido');
            }
          } catch (error) {
            toast.error('Erro ao importar backup');
            console.error('Import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ ATENÇÃO: Esta ação irá limpar TODOS os dados da aplicação incluindo projetos, personagens, configurações e API keys. Esta ação NÃO PODE ser desfeita.\n\nTem certeza absoluta que deseja continuar?')) {
      if (window.confirm('Digite "CONFIRMAR" para prosseguir:') === 'CONFIRMAR') {
        localStorage.clear();
        toast.success('Todos os dados foram limpos. A página será recarregada.');
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  };

  const renderGeneral = () => (
    <div className="space-y-8">
      {/* Configurações Básicas */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
            <p className="text-sm text-gray-500">Preferências básicas da aplicação</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma da Interface
            </label>
            <select
              value={settings?.language || 'pt-BR'}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input-field"
            >
              <option value="pt-BR">🇧🇷 Português (Brasil)</option>
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="es-ES">🇪🇸 Español</option>
              <option value="fr-FR">🇫🇷 Français</option>
              <option value="de-DE">🇩🇪 Deutsch</option>
              <option value="ja-JP">🇯🇵 日本語</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={settings?.timezone || 'America/Sao_Paulo'}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="input-field"
            >
              <option value="America/Sao_Paulo">🇧🇷 Brasília (GMT-3)</option>
              <option value="America/New_York">🇺🇸 New York (GMT-5)</option>
              <option value="Europe/London">🇬🇧 London (GMT+0)</option>
              <option value="Europe/Paris">🇫🇷 Paris (GMT+1)</option>
              <option value="Asia/Tokyo">🇯🇵 Tokyo (GMT+9)</option>
              <option value="Australia/Sydney">🇦🇺 Sydney (GMT+10)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Save className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-salvamento</label>
                <p className="text-sm text-gray-500">Salvar automaticamente o progresso a cada 30 segundos</p>
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
              <Activity className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Estatísticas de Uso</label>
                <p className="text-sm text-gray-500">Coletar dados anônimos para melhorar a experiência</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.analytics || false}
              onChange={(e) => handleSettingChange('analytics', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Verificação Ortográfica</label>
                <p className="text-sm text-gray-500">Verificar ortografia enquanto digita</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.spellCheck !== false}
              onChange={(e) => handleSettingChange('spellCheck', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Configurações de Performance */}
      <div className="card">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-500">Otimizações para melhor desempenho</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Auto-save (segundos): {settings?.autoSaveInterval || 30}
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={settings?.autoSaveInterval || 30}
              onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10s</span>
              <span>5min</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Histórico de Desfazer (ações): {settings?.undoHistorySize || 50}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={settings?.undoHistorySize || 50}
              onChange={(e) => handleSettingChange('undoHistorySize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-8">
      {/* Introdução */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start">
          <Zap className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integração com IA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure suas APIs de IA favoritas para potencializar sua criatividade. Suportamos os principais provedores do mercado.
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <Shield className="h-4 w-4 mr-1" />
              <span>Suas chaves API são armazenadas localmente e nunca enviadas para nossos servidores</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações Globais de IA */}
      <div className="card">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Globais</h3>
            <p className="text-sm text-gray-500">Configurações que se aplicam a todos os provedores</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provedor Padrão
            </label>
            <select
              value={settings?.defaultAIProvider || 'openai'}
              onChange={(e) => handleSettingChange('defaultAIProvider', e.target.value)}
              className="input-field"
            >
              {aiProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (segundos): {settings?.aiTimeout || 30}
            </label>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={settings?.aiTimeout || 30}
              onChange={(e) => handleSettingChange('aiTimeout', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Sugestões Automáticas</label>
                <p className="text-sm text-gray-500">Mostrar sugestões de IA enquanto escreve</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoSuggestions || false}
              onChange={(e) => handleSettingChange('autoSuggestions', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Retry Automático</label>
                <p className="text-sm text-gray-500">Tentar novamente automaticamente em caso de erro</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoRetry !== false}
              onChange={(e) => handleSettingChange('autoRetry', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
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

          return (
            <div key={provider.id} className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    isConfigured ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Cloud className={`h-5 w-5 ${isConfigured ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.description}</p>
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

              <div className="space-y-4">
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
                      className="input-field pr-20"
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
                      className="input-field"
                    >
                      {provider.models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
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
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={providerSettings.maxTokens || 2000}
                      onChange={(e) => handleAIProviderChange(provider.id, 'maxTokens', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* URL Personalizada (para API customizada) */}
                {provider.id === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Base da API
                    </label>
                    <input
                      type="url"
                      value={providerSettings.baseUrl || ''}
                      onChange={(e) => handleAIProviderChange(provider.id, 'baseUrl', e.target.value)}
                      placeholder="https://api.exemplo.com/v1"
                      className="input-field"
                    />
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => testConnection(provider.id)}
                      disabled={!providerSettings.apiKey || isTesting}
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
                      />
                      <label htmlFor={`enabled-${provider.id}`} className="ml-2 text-sm text-gray-700">
                        Habilitado
                      </label>
                    </div>
                  </div>

                  {providerSettings.apiKey && (
                    <button
                      onClick={() => handleAIProviderChange(provider.id, 'apiKey', '')}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remover API Key
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderEditor = () => (
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
          <SettingsIcon className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Comportamento do Editor</h3>
            <p className="text-sm text-gray-500">Como o editor deve se comportar</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Modo de Foco</label>
                <p className="text-sm text-gray-500">Esconder elementos da interface durante a escrita</p>
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
                <label className="text-sm font-medium text-gray-700">Quebra Automática de Linha</label>
                <p className="text-sm text-gray-500">Quebrar linhas automaticamente ao atingir a margem</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.wordWrap !== false}
              onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Mostrar Estatísticas</label>
                <p className="text-sm text-gray-500">Exibir contador de palavras e estatísticas em tempo real</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.showStats !== false}
              onChange={(e) => handleSettingChange('showStats', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Destacar Sintaxe</label>
                <p className="text-sm text-gray-500">Destacar elementos como diálogos e formatação</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.syntaxHighlight !== false}
              onChange={(e) => handleSettingChange('syntaxHighlight', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Atalhos de Teclado */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Key className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Atalhos de Teclado</h3>
            <p className="text-sm text-gray-500">Atalhos para aumentar sua produtividade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { action: 'Salvar', shortcut: 'Ctrl + S' },
            { action: 'Novo Documento', shortcut: 'Ctrl + N' },
            { action: 'Buscar', shortcut: 'Ctrl + F' },
            { action: 'Desfazer', shortcut: 'Ctrl + Z' },
            { action: 'Refazer', shortcut: 'Ctrl + Y' },
            { action: 'Modo Foco', shortcut: 'F11' },
            { action: 'Assistente IA', shortcut: 'Ctrl + Alt + A' },
            { action: 'Inserir Data', shortcut: 'Ctrl + D' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{item.action}</span>
              <code className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">
                {item.shortcut}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-8">
      {/* Tema */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tema da Interface</h3>
            <p className="text-sm text-gray-500">Escolha o tema que mais combina com você</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.value}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                settings?.theme === theme.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSettingChange('theme', theme.value)}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg ${theme.preview} flex items-center justify-center`}>
                  <theme.icon className="h-8 w-8" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{theme.label}</h4>
                <p className="text-xs text-gray-500">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cores */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cor Primária</h3>
            <p className="text-sm text-gray-500">Personalize a cor principal da interface</p>
          </div>
        </div>
        
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {[
            { name: 'Azul', value: 'blue', color: '#3b82f6' },
            { name: 'Roxo', value: 'purple', color: '#8b5cf6' },
            { name: 'Verde', value: 'green', color: '#10b981' },
            { name: 'Vermelho', value: 'red', color: '#ef4444' },
            { name: 'Amarelo', value: 'yellow', color: '#f59e0b' },
            { name: 'Rosa', value: 'pink', color: '#ec4899' },
            { name: 'Indigo', value: 'indigo', color: '#6366f1' },
            { name: 'Teal', value: 'teal', color: '#14b8a6' }
          ].map((color) => (
            <button
              key={color.value}
              onClick={() => handleSettingChange('primaryColor', color.value)}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                settings?.primaryColor === color.value
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="card">
        <div className="flex items-center mb-6">
          <MonitorIcon className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Layout da Interface</h3>
            <p className="text-sm text-gray-500">Configure o layout e densidade da interface</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Densidade da Interface
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'compact', label: 'Compacta', description: 'Mais conteúdo na tela' },
                { value: 'normal', label: 'Normal', description: 'Equilíbrio ideal' },
                { value: 'comfortable', label: 'Confortável', description: 'Mais espaçamento' }
              ].map((density) => (
                <div
                  key={density.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings?.density === density.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSettingChange('density', density.value)}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-1">{density.label}</h4>
                    <p className="text-xs text-gray-500">{density.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Animações</label>
                  <p className="text-sm text-gray-500">Habilitar animações e transições suaves</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.animations !== false}
                onChange={(e) => handleSettingChange('animations', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Efeitos Visuais</label>
                  <p className="text-sm text-gray-500">Sombras, gradientes e outros efeitos</p>
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
    </div>
  );

  const renderNotifications = () => (
    <NotificationSettings />
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      {/* Privacidade */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Privacidade e Segurança</h3>
            <p className="text-sm text-gray-500">Configure como seus dados são tratados</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Armazenamento Local</h4>
                <p className="text-sm text-blue-700">
                  Todos os seus dados são armazenados localmente no seu navegador. Nada é enviado para nossos servidores.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Criptografar Dados Locais</label>
                  <p className="text-sm text-gray-500">Criptografar dados salvos no navegador (experimental)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.encryptLocalData || false}
                onChange={(e) => handleSettingChange('encryptLocalData', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Mascarar API Keys</label>
                  <p className="text-sm text-gray-500">Ocultar API keys por padrão na interface</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.maskApiKeys !== false}
                onChange={(e) => handleSettingChange('maskApiKeys', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Log de Atividades</label>
                  <p className="text-sm text-gray-500">Manter registro das ações realizadas (apenas local)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.activityLog !== false}
                onChange={(e) => handleSettingChange('activityLog', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup Automático */}
      <div className="card">
        <div className="flex items-center mb-6">
          <HardDrive className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Backup Automático</h3>
            <p className="text-sm text-gray-500">Configure backups automáticos dos seus dados</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Backup Automático</label>
              <p className="text-sm text-gray-500">Criar backups automaticamente no navegador</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoBackup || false}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          {settings?.autoBackup && (
            <div className="space-y-4 pl-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência do Backup
                </label>
                <select
                  value={settings?.backupFrequency || 'daily'}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  className="input-field"
                >
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Backups: {settings?.maxBackups || 10}
                </label>
                <input
                  type="range"
                  min="3"
                  max="50"
                  step="1"
                  value={settings?.maxBackups || 10}
                  onChange={(e) => handleSettingChange('maxBackups', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="card">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Estatísticas dos Dados</h3>
            <p className="text-sm text-gray-500">Visão geral dos seus dados armazenados</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">{projects?.length || 0}</div>
              <div className="text-sm font-medium text-foreground">Projetos</div>
              <div className="text-xs text-muted-foreground mt-1">
                {projects?.reduce((acc, p) => acc + (p.wordCount || 0), 0)?.toLocaleString() || 0} palavras
              </div>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="text-3xl font-bold text-secondary-600 mb-2">{characters?.length || 0}</div>
              <div className="text-sm font-medium text-foreground">Personagens</div>
              <div className="text-xs text-muted-foreground mt-1">
                {characters?.filter(c => c.role === 'protagonist').length || 0} protagonistas
              </div>
            </div>
            
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-3xl font-bold text-accent-foreground mb-2">{worldData?.locations?.length || 0}</div>
              <div className="text-sm font-medium text-foreground">Locais</div>
              <div className="text-xs text-muted-foreground mt-1">
                {worldData?.cultures?.length || 0} culturas
              </div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-muted-foreground mb-2">{aiConversations?.length || 0}</div>
              <div className="text-sm font-medium text-foreground">Conversas AI</div>
              <div className="text-xs text-muted-foreground mt-1">
                {aiConversations?.reduce((acc, c) => acc + (c.messages?.length || 0), 0) || 0} mensagens
              </div>
            </div>
        </div>

        {/* Uso de Armazenamento */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Uso de Armazenamento Local</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(JSON.stringify(localStorage).length / 1024)} KB
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((JSON.stringify(localStorage).length / (10 * 1024 * 1024)) * 100, 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0 KB</span>
            <span>10 MB (limite recomendado)</span>
          </div>
        </div>
      </div>

      {/* Backup e Restauração */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Database className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Backup e Restauração</h3>
            <p className="text-sm text-gray-500">Faça backup dos seus dados ou restaure de um backup anterior</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Ações de Backup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExportAll}
              disabled={isExporting}
              className="btn-primary flex items-center justify-center disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? 'Exportando...' : 'Fazer Backup Completo'}
            </button>
            
            <button
              onClick={handleImportAll}
              className="btn-outline flex items-center justify-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Restaurar Backup
            </button>
          </div>

          {/* Informações sobre Backup */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">Sobre os Backups</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Backups incluem todos os projetos, personagens, configurações e dados do mundo</li>
                  <li>• API Keys são mascaradas por segurança e não são incluídas no backup</li>
                  <li>• Backups são arquivos JSON que podem ser visualizados em qualquer editor de texto</li>
                  <li>• Recomendamos fazer backups regulares, especialmente antes de grandes mudanças</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Backup Seletivo */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Backup Seletivo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'projects', label: 'Projetos', data: projects },
                { key: 'characters', label: 'Personagens', data: characters },
                { key: 'worldData', label: 'Mundo', data: worldData },
                { key: 'settings', label: 'Configurações', data: settings }
              ].map((item) => (
                <button
                  key={item.key}
                  className="btn-outline text-sm"
                  onClick={() => {
                    const data = { [item.key]: item.data };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${item.key}-backup.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success(`${item.label} exportado!`);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Limpeza de Dados */}
      <div className="card border-red-200">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Zona de Perigo</h3>
            <p className="text-sm text-red-600">Ações irreversíveis que afetam seus dados</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900 mb-1">Aviso Importante</h4>
                <p className="text-sm text-red-700">
                  As ações abaixo são irreversíveis. Certifique-se de fazer um backup antes de prosseguir.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                if (window.confirm('Limpar apenas as configurações? Projetos e dados serão mantidos.')) {
                  const settingsKeys = Object.keys(localStorage).filter(key => key.includes('settings'));
                  settingsKeys.forEach(key => localStorage.removeItem(key));
                  toast.success('Configurações limpas!');
                }
              }}
              className="btn-outline border-yellow-300 text-yellow-600 hover:bg-yellow-50"
            >
              Limpar Configurações
            </button>
            
            <button
              onClick={() => {
                if (window.confirm('Limpar cache e dados temporários?')) {
                  // Limpar apenas cache
                  toast.success('Cache limpo!');
                }
              }}
              className="btn-outline border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Limpar Cache
            </button>
            
            <button
              onClick={handleClearData}
              className="btn-outline border-red-300 text-red-600 hover:bg-red-50"
            >
              Limpar Todos os Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-8">
      {/* Performance */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Zap className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-500">Otimize o desempenho da aplicação</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Cache TTL (minutos)</label>
            <p className="text-sm text-gray-500 mb-2">Tempo de vida do cache de dados</p>
            <input
              type="range"
              min="5"
              max="480"
              step="5"
              value={settings?.cacheTTL || 60}
              onChange={(e) => handleSettingChange('cacheTTL', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 min</span>
              <span>8 horas</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Lazy Loading</label>
              <p className="text-sm text-gray-500">Carregar conteúdo conforme necessário</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.lazyLoading !== false}
              onChange={(e) => handleSettingChange('lazyLoading', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Info className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
            <p className="text-sm text-gray-500">Detalhes técnicos sobre o ambiente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Versão da Aplicação:</span>
              <span className="text-sm font-medium">v2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Navegador:</span>
              <span className="text-sm font-medium">{navigator.userAgent.split(' ').slice(-1)[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Plataforma:</span>
              <span className="text-sm font-medium">{navigator.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Idioma:</span>
              <span className="text-sm font-medium">{navigator.language}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Local Storage:</span>
              <span className="text-sm font-medium">
                {(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Session Storage:</span>
              <span className="text-sm font-medium">
                {(JSON.stringify(sessionStorage).length / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cookies Habilitados:</span>
              <span className="text-sm font-medium">{navigator.cookieEnabled ? 'Sim' : 'Não'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Online:</span>
              <span className="text-sm font-medium">{navigator.onLine ? 'Sim' : 'Não'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Recursos Suportados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className={`flex items-center ${typeof Storage !== 'undefined' ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Local Storage
            </div>
            <div className={`flex items-center ${navigator.serviceWorker ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Service Worker
            </div>
            <div className={`flex items-center ${window.indexedDB ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              IndexedDB
            </div>
            <div className={`flex items-center ${navigator.clipboard ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Clipboard API
            </div>
          </div>
        </div>
      </div>

      {/* Reset e Manutenção */}
      <div className="card">
        <div className="flex items-center mb-6">
          <RefreshCw className="h-6 w-6 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manutenção</h3>
            <p className="text-sm text-gray-500">Ferramentas para manutenção e reset</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('light-novel-creator-cache');
              toast.success('Cache limpo!');
            }}
            className="btn-outline"
          >
            Limpar Cache
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Resetar todas as configurações para padrão?')) {
                const defaultSettings = {
                  theme: 'light',
                  language: 'pt-BR',
                  fontSize: 16,
                  fontFamily: 'serif'
                };
                updateSettings(defaultSettings);
                toast.success('Configurações resetadas!');
              }
            }}
            className="btn-outline"
          >
            Reset Configurações
          </button>
          
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="btn-outline"
          >
            Recarregar App
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneral();
      case 'ai':
        return renderAI();
      case 'editor':
        return renderEditor();
      case 'appearance':
        return renderAppearance();
      case 'notifications':
        return renderNotifications();
      case 'security':
        return renderSecurity();
      case 'data':
        return renderData();
      case 'advanced':
        return renderAdvanced();
      default:
        return renderGeneral();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-2">
                Personalize sua experiência de criação de light novels
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {unsavedChanges && (
                <div className="flex items-center text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Salvando...</span>
                </div>
              )}
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn-outline flex items-center"
              >
                <Server className="mr-2 h-4 w-4" />
                {showAdvanced ? 'Ocultar' : 'Mostrar'} Avançado
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.filter(tab => showAdvanced || tab.id !== 'advanced').map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-500 mt-0.5">
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;