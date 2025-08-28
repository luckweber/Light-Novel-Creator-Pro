import React, { useState, useEffect } from 'react';
import { GitBranch, Save, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getCurrentVersion } from '../../utils/versionControl';

const VersionNotification = ({ content }) => {
  const [lastVersion, setLastVersion] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');

  useEffect(() => {
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
      setLastVersion(currentVersion);
    }
  }, [content]);

  useEffect(() => {
    if (lastVersion) {
      setShowNotification(true);
      setNotificationType('success');
      
      // Ocultar notificação após 5 segundos
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [lastVersion]);

  if (!showNotification || !lastVersion) return null;

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Save className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = () => {
    switch (notificationType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${getNotificationColor()} shadow-lg z-50 max-w-sm`}>
      <div className="flex items-start space-x-3">
        {getNotificationIcon()}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <GitBranch className="h-3 w-3" />
            <span className="text-sm font-medium">Versão Salva</span>
          </div>
          <p className="text-xs mb-2">{lastVersion.message}</p>
          <div className="flex items-center space-x-4 text-xs opacity-75">
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {new Date(lastVersion.timestamp).toLocaleTimeString()}
            </span>
            <span>{lastVersion.stats.totalChanges} mudanças</span>
          </div>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="text-current opacity-50 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default VersionNotification;
