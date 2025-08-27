import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  PROGRESS: 'progress',
  REMINDER: 'reminder'
};

// Categorias de notificação
export const NOTIFICATION_CATEGORIES = {
  WRITING: 'writing',
  AI: 'ai',
  PROJECT: 'project',
  SYSTEM: 'system',
  GOAL: 'goal',
  BACKUP: 'backup'
};

// Configurações padrão de notificações
const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  sound: true,
  desktop: true,
  categories: {
    [NOTIFICATION_CATEGORIES.WRITING]: true,
    [NOTIFICATION_CATEGORIES.AI]: true,
    [NOTIFICATION_CATEGORIES.PROJECT]: true,
    [NOTIFICATION_CATEGORIES.SYSTEM]: true,
    [NOTIFICATION_CATEGORIES.GOAL]: true,
    [NOTIFICATION_CATEGORIES.BACKUP]: true
  },
  frequency: {
    reminders: 'daily',
    progress: 'weekly',
    backup: 'daily'
  }
};

const useNotifications = () => {
  const { settings, updateSettings } = useStore();
  const [notifications, setNotifications] = useState([]);
  const [lastWordCount, setLastWordCount] = useState(0);
  const [lastSession, setLastSession] = useState(null);

  // Obter configurações de notificação
  const notificationSettings = settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS;

  // Verificar se notificações estão habilitadas para uma categoria
  const isCategoryEnabled = useCallback((category) => {
    return notificationSettings.enabled && notificationSettings.categories[category];
  }, [notificationSettings]);

  // Adicionar notificação
  const addNotification = useCallback(({
    type = NOTIFICATION_TYPES.INFO,
    category = NOTIFICATION_CATEGORIES.SYSTEM,
    title,
    message,
    duration = 5000,
    action,
    priority = 'normal'
  }) => {
    if (!isCategoryEnabled(category)) return;

    const notification = {
      id: Date.now() + Math.random(),
      type,
      category,
      title,
      message,
      timestamp: new Date(),
      action,
      priority,
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Manter máximo 50 notificações

    // Mostrar toast baseado no tipo
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, { duration });
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, { duration });
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(message, { 
          icon: '⚠️',
          style: { background: '#fbbf24', color: '#1f2937' }
        });
        break;
      case NOTIFICATION_TYPES.PROGRESS:
        toast.success(message, { 
          duration,
          icon: '📈'
        });
        break;
      case NOTIFICATION_TYPES.REMINDER:
        toast(message, { 
          duration: 8000,
          icon: '⏰',
          style: { background: '#3b82f6', color: 'white' }
        });
        break;
      default:
        toast(message, { duration });
    }

    // Notificação desktop se habilitada
    if (notificationSettings.desktop && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: category
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    return notification.id;
  }, [isCategoryEnabled, notificationSettings.desktop]);

  // Marcar notificação como lida
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Remover notificação
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Notificações de progresso de escrita
  const checkWritingProgress = useCallback((currentWordCount) => {
    if (!isCategoryEnabled(NOTIFICATION_CATEGORIES.WRITING)) return;

    const wordDifference = currentWordCount - lastWordCount;
    
    // Notificar progresso significativo
    if (wordDifference >= 100) {
      addNotification({
        type: NOTIFICATION_TYPES.PROGRESS,
        category: NOTIFICATION_CATEGORIES.WRITING,
        title: 'Progresso de Escrita',
        message: `Parabéns! Você escreveu mais ${wordDifference} palavras!`,
        duration: 4000
      });
    }

    // Notificar metas atingidas
    const { currentProject } = useStore.getState();
    if (currentProject?.targetWordCount && currentWordCount >= currentProject.targetWordCount) {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        category: NOTIFICATION_CATEGORIES.GOAL,
        title: 'Meta Atingida! 🎉',
        message: `Você atingiu sua meta de ${currentProject.targetWordCount} palavras!`,
        duration: 6000
      });
    }

    setLastWordCount(currentWordCount);
  }, [lastWordCount, isCategoryEnabled, addNotification]);

  // Notificações de sessão de escrita
  const checkWritingSession = useCallback((sessionDuration) => {
    if (!isCategoryEnabled(NOTIFICATION_CATEGORIES.WRITING)) return;

    const now = Date.now();
    const timeSinceLastSession = lastSession ? now - lastSession : 0;

    // Lembrar de fazer pausas
    if (sessionDuration > 60 * 60 * 1000) { // 1 hora
      addNotification({
        type: NOTIFICATION_TYPES.REMINDER,
        category: NOTIFICATION_CATEGORIES.WRITING,
        title: 'Hora de uma Pausa',
        message: 'Você está escrevendo há mais de 1 hora. Que tal fazer uma pausa?',
        duration: 8000
      });
    }

    // Parabenizar por sessões longas
    if (sessionDuration > 2 * 60 * 60 * 1000) { // 2 horas
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        category: NOTIFICATION_CATEGORIES.WRITING,
        title: 'Sessão Incrível!',
        message: 'Você está escrevendo há mais de 2 horas. Dedicação impressionante!',
        duration: 5000
      });
    }

    setLastSession(now);
  }, [lastSession, isCategoryEnabled, addNotification]);

  // Verificar configuração de IA
  const checkAIConfiguration = useCallback(() => {
    if (!isCategoryEnabled(NOTIFICATION_CATEGORIES.AI)) return;

    const { settings } = useStore.getState();
    const hasConfiguredAI = Object.values(settings?.aiProviders || {}).some(
      provider => provider.enabled && provider.apiKey
    );

    if (!hasConfiguredAI) {
      addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        category: NOTIFICATION_CATEGORIES.AI,
        title: 'IA Não Configurada',
        message: 'Configure um provedor de IA para desbloquear funcionalidades avançadas!',
        duration: 10000,
        action: {
          label: 'Configurar',
          onClick: () => window.location.href = '/settings'
        }
      });
    }
  }, [isCategoryEnabled, addNotification]);

  // Verificar backup
  const checkBackupStatus = useCallback(() => {
    if (!isCategoryEnabled(NOTIFICATION_CATEGORIES.BACKUP)) return;

    const lastBackup = localStorage.getItem('lastBackup');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastBackup || (now - parseInt(lastBackup)) > oneDay) {
      addNotification({
        type: NOTIFICATION_TYPES.REMINDER,
        category: NOTIFICATION_CATEGORIES.BACKUP,
        title: 'Backup Pendente',
        message: 'Faça backup do seu projeto para não perder seu trabalho!',
        duration: 8000,
        action: {
          label: 'Fazer Backup',
          onClick: () => {
            const { exportProject } = useStore.getState();
            exportProject();
          }
        }
      });
    }
  }, [isCategoryEnabled, addNotification]);

  // Verificar metas diárias
  const checkDailyGoals = useCallback(() => {
    if (!isCategoryEnabled(NOTIFICATION_CATEGORIES.GOAL)) return;

    const { currentProject, editorContent } = useStore.getState();
    const wordCount = editorContent.split(/\s+/).filter(word => word.length > 0).length;
    
    if (currentProject?.dailyGoal && wordCount < currentProject.dailyGoal) {
      const remainingWords = currentProject.dailyGoal - wordCount;
      
      addNotification({
        type: NOTIFICATION_TYPES.REMINDER,
        category: NOTIFICATION_CATEGORIES.GOAL,
        title: 'Meta Diária',
        message: `Faltam ${remainingWords} palavras para atingir sua meta diária!`,
        duration: 6000
      });
    }
  }, [isCategoryEnabled, addNotification]);

  // Atualizar configurações de notificação
  const updateNotificationSettings = useCallback((newSettings) => {
    updateSettings({
      notifications: {
        ...notificationSettings,
        ...newSettings
      }
    });
  }, [notificationSettings, updateSettings]);

  // Solicitar permissão para notificações desktop
  const requestDesktopPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            category: NOTIFICATION_CATEGORIES.SYSTEM,
            title: 'Notificações Ativadas',
            message: 'Você receberá notificações desktop!',
            duration: 3000
          });
        }
      });
    }
  }, [addNotification]);

  // Verificações automáticas
  useEffect(() => {
    // Verificar configuração de IA na inicialização
    checkAIConfiguration();

    // Verificar backup a cada 6 horas
    const backupInterval = setInterval(checkBackupStatus, 6 * 60 * 60 * 1000);
    
    // Verificar metas diárias a cada hora
    const goalsInterval = setInterval(checkDailyGoals, 60 * 60 * 1000);

    return () => {
      clearInterval(backupInterval);
      clearInterval(goalsInterval);
    };
  }, [checkAIConfiguration, checkBackupStatus, checkDailyGoals]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    checkWritingProgress,
    checkWritingSession,
    checkAIConfiguration,
    checkBackupStatus,
    checkDailyGoals,
    updateNotificationSettings,
    requestDesktopPermission,
    notificationSettings,
    isCategoryEnabled
  };
};

export default useNotifications;
