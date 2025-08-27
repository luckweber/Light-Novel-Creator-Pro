import React from 'react';
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone,
  Clock,
  Target,
  BookOpen,
  Bot,
  Database,
  Settings,
  Info
} from 'lucide-react';
import useNotifications, { NOTIFICATION_CATEGORIES } from '../../hooks/useNotifications';

const NotificationSettings = () => {
  const {
    notificationSettings,
    updateNotificationSettings,
    requestDesktopPermission
  } = useNotifications();

  const categoryIcons = {
    [NOTIFICATION_CATEGORIES.WRITING]: BookOpen,
    [NOTIFICATION_CATEGORIES.AI]: Bot,
    [NOTIFICATION_CATEGORIES.PROJECT]: Settings,
    [NOTIFICATION_CATEGORIES.SYSTEM]: Settings,
    [NOTIFICATION_CATEGORIES.GOAL]: Target,
    [NOTIFICATION_CATEGORIES.BACKUP]: Database
  };

  const categoryLabels = {
    [NOTIFICATION_CATEGORIES.WRITING]: 'Escrita',
    [NOTIFICATION_CATEGORIES.AI]: 'Inteligência Artificial',
    [NOTIFICATION_CATEGORIES.PROJECT]: 'Projetos',
    [NOTIFICATION_CATEGORIES.SYSTEM]: 'Sistema',
    [NOTIFICATION_CATEGORIES.GOAL]: 'Metas',
    [NOTIFICATION_CATEGORIES.BACKUP]: 'Backup'
  };

  const categoryDescriptions = {
    [NOTIFICATION_CATEGORIES.WRITING]: 'Progresso de escrita, sessões longas e pausas',
    [NOTIFICATION_CATEGORIES.AI]: 'Configuração de IA e funcionalidades',
    [NOTIFICATION_CATEGORIES.PROJECT]: 'Criação, edição e gerenciamento de projetos',
    [NOTIFICATION_CATEGORIES.SYSTEM]: 'Atualizações e configurações do sistema',
    [NOTIFICATION_CATEGORIES.GOAL]: 'Metas diárias e conquistas',
    [NOTIFICATION_CATEGORIES.BACKUP]: 'Lembretes de backup e sincronização'
  };

  const handleToggleNotifications = () => {
    updateNotificationSettings({
      enabled: !notificationSettings.enabled
    });
  };

  const handleToggleSound = () => {
    updateNotificationSettings({
      sound: !notificationSettings.sound
    });
  };

  const handleToggleDesktop = () => {
    updateNotificationSettings({
      desktop: !notificationSettings.desktop
    });
    
    if (!notificationSettings.desktop) {
      requestDesktopPermission();
    }
  };

  const handleToggleCategory = (category) => {
    updateNotificationSettings({
      categories: {
        ...notificationSettings.categories,
        [category]: !notificationSettings.categories[category]
      }
    });
  };

  const handleFrequencyChange = (type, value) => {
    updateNotificationSettings({
      frequency: {
        ...notificationSettings.frequency,
        [type]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Bell className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            Configure como e quando receber notificações
          </p>
        </div>
      </div>

      {/* Configurações Gerais */}
      <div className="card">
        <h4 className="text-md font-medium text-foreground mb-4">Configurações Gerais</h4>
        
        <div className="space-y-4">
          {/* Habilitar/Desabilitar Notificações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {notificationSettings.enabled ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Notificações</p>
                <p className="text-xs text-muted-foreground">
                  {notificationSettings.enabled ? 'Ativadas' : 'Desativadas'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Som */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {notificationSettings.sound ? (
                <Volume2 className="h-5 w-5 text-green-600" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Som</p>
                <p className="text-xs text-muted-foreground">
                  {notificationSettings.sound ? 'Ativado' : 'Desativado'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.sound ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notificações Desktop */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Monitor className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Notificações Desktop</p>
                <p className="text-xs text-muted-foreground">
                  Receber notificações do sistema operacional
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleDesktop}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.desktop ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.desktop ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Categorias de Notificação */}
      <div className="card">
        <h4 className="text-md font-medium text-foreground mb-4">Categorias</h4>
        
        <div className="space-y-3">
          {Object.values(NOTIFICATION_CATEGORIES).map((category) => {
            const Icon = categoryIcons[category];
            const isEnabled = notificationSettings.categories[category];
            
            return (
              <div key={category} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isEnabled ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {categoryLabels[category]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryDescriptions[category]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCategory(category)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequência de Notificações */}
      <div className="card">
        <h4 className="text-md font-medium text-foreground mb-4">Frequência</h4>
        
        <div className="space-y-4">
          {/* Lembretes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Lembretes</p>
                <p className="text-xs text-muted-foreground">Frequência dos lembretes</p>
              </div>
            </div>
            <select
              value={notificationSettings.frequency.reminders}
              onChange={(e) => handleFrequencyChange('reminders', e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground"
            >
              <option value="never">Nunca</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>

          {/* Progresso */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Progresso</p>
                <p className="text-xs text-muted-foreground">Relatórios de progresso</p>
              </div>
            </div>
            <select
              value={notificationSettings.frequency.progress}
              onChange={(e) => handleFrequencyChange('progress', e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground"
            >
              <option value="never">Nunca</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          {/* Backup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Backup</p>
                <p className="text-xs text-muted-foreground">Lembretes de backup</p>
              </div>
            </div>
            <select
              value={notificationSettings.frequency.backup}
              onChange={(e) => handleFrequencyChange('backup', e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground"
            >
              <option value="never">Nunca</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Dicas sobre Notificações
            </h5>
            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• As notificações desktop requerem permissão do navegador</li>
              <li>• Notificações de progresso aparecem a cada 100 palavras escritas</li>
              <li>• Lembretes de pausa aparecem após 1 hora de escrita contínua</li>
              <li>• Você pode personalizar a frequência de cada tipo de notificação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
