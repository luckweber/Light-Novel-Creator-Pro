import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette,
  Database,
  FileText,
  Zap,
  Shield,
  Bell,
  Server,
  Clock
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import AISettings from '../components/settings/AISettings';
import EditorSettings from '../components/settings/EditorSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import NotificationSettings from '../components/notifications/NotificationSettings';

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState('general');
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

  const handleSettingChange = (field, value) => {
    updateSettings({ [field]: value });
    setUnsavedChanges(true);
    
    setTimeout(() => {
      setUnsavedChanges(false);
      toast.success('Configuração salva automaticamente', { duration: 2000 });
    }, 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'ai':
        return <AISettings />;
      case 'editor':
        return <EditorSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'security':
        return (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
              <p className="text-gray-600">Configurações de segurança e privacidade em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados</h3>
              <p className="text-gray-600">Configurações de backup e exportação em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avançado</h3>
              <p className="text-gray-600">Configurações técnicas avançadas em desenvolvimento.</p>
            </div>
          </div>
        );
      default:
        return <GeneralSettings />;
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
