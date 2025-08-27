import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Settings,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import useNotifications, { NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from '../../hooks/useNotifications';

const NotificationCenter = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    notificationSettings,
    updateNotificationSettings,
    requestDesktopPermission
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Obter ícone baseado no tipo
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case NOTIFICATION_TYPES.PROGRESS:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case NOTIFICATION_TYPES.REMINDER:
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  // Obter cor de fundo baseada no tipo
  const getNotificationBgColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case NOTIFICATION_TYPES.PROGRESS:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case NOTIFICATION_TYPES.REMINDER:
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  // Formatar timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de notificações */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Notificações</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={requestDesktopPermission}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Configurar notificações desktop"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={markAllAsRead}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Marcar todas como lidas"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={clearAllNotifications}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-3 border-b border-border">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'unread' 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Não lidas ({unreadCount})
              </button>
            </div>
          </div>

          {/* Lista de notificações */}
          <div className="max-h-64 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      getNotificationBgColor(notification.type)
                    } ${!notification.read ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-foreground">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        {notification.action && (
                          <button
                            onClick={notification.action.onClick}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                          title="Marcar como lida"
                        >
                          <EyeOff className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredNotifications.length} de {notifications.length} notificações</span>
                <button
                  onClick={clearAllNotifications}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Limpar todas
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
