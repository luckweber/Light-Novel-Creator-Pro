import { exportBackup } from './exportUtils';

// Configurações do sistema de backup
const BACKUP_CONFIG = {
  // Backup automático a cada 15 minutos (reduzido para evitar quota)
  AUTO_BACKUP_INTERVAL: 15 * 60 * 1000,
  
  // Manter apenas os últimos 5 backups automáticos (reduzido)
  MAX_AUTO_BACKUPS: 5,
  
  // Backup manual - manter os últimos 20 (reduzido)
  MAX_MANUAL_BACKUPS: 20,
  
  // Backup de segurança - manter os últimos 3 (reduzido)
  MAX_SAFETY_BACKUPS: 3,
  
  // Intervalo para backup de segurança (2 horas) (aumentado)
  SAFETY_BACKUP_INTERVAL: 2 * 60 * 60 * 1000,
  
  // Tamanho máximo do backup (10MB) (reduzido)
  MAX_BACKUP_SIZE: 10 * 1024 * 1024
};

class BackupManager {
  constructor() {
    this.autoBackupInterval = null;
    this.safetyBackupInterval = null;
    this.lastBackupTime = this.getLastBackupTime();
    this.isBackupInProgress = false;
  }

  // Inicializar sistema de backup
  init() {
    this.startAutoBackup();
    this.startSafetyBackup();
    this.cleanupOldBackups();
  }

  // Parar sistema de backup
  destroy() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
    }
    if (this.safetyBackupInterval) {
      clearInterval(this.safetyBackupInterval);
    }
  }

  // Iniciar backup automático
  startAutoBackup() {
    this.autoBackupInterval = setInterval(() => {
      this.performAutoBackup();
    }, BACKUP_CONFIG.AUTO_BACKUP_INTERVAL);
  }

  // Iniciar backup de segurança
  startSafetyBackup() {
    this.safetyBackupInterval = setInterval(() => {
      this.performSafetyBackup();
    }, BACKUP_CONFIG.SAFETY_BACKUP_INTERVAL);
  }

  // Realizar backup automático
  async performAutoBackup() {
    if (this.isBackupInProgress) return;

    try {
      this.isBackupInProgress = true;
      
      const projectData = this.getCurrentProjectData();
      if (!projectData.project) return; // Não fazer backup se não há projeto

      const backupData = {
        ...projectData,
        timestamp: Date.now(),
        type: 'auto',
        version: '1.0'
      };

      const backupKey = `backup_auto_${Date.now()}`;
      const backupString = JSON.stringify(backupData);
      
      // Verificar tamanho do backup
      if (backupString.length > BACKUP_CONFIG.MAX_BACKUP_SIZE) {
        console.warn('Backup muito grande, pulando...');
        return;
      }

      // Salvar backup
      try {
        localStorage.setItem(backupKey, backupString);
        
        // Atualizar metadados
        this.updateBackupMetadata(backupKey, 'auto');
        
        // Limpar backups antigos
        this.cleanupOldBackups();
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('Quota excedida, limpando backups antigos...');
          this.cleanupOldBackups();
          
          // Tentar novamente após limpeza
          try {
            localStorage.setItem(backupKey, backupString);
            this.updateBackupMetadata(backupKey, 'auto');
          } catch (retryError) {
            console.error('Falha ao salvar backup mesmo após limpeza:', retryError);
            return;
          }
        } else {
          throw error;
        }
      }
      
      console.log('Backup automático realizado com sucesso');
      
    } catch (error) {
      console.error('Erro no backup automático:', error);
    } finally {
      this.isBackupInProgress = false;
    }
  }

  // Realizar backup de segurança
  async performSafetyBackup() {
    if (this.isBackupInProgress) return;

    try {
      this.isBackupInProgress = true;
      
      const projectData = this.getCurrentProjectData();
      if (!projectData.project) return;

      const backupData = {
        ...projectData,
        timestamp: Date.now(),
        type: 'safety',
        version: '1.0'
      };

      const backupKey = `backup_safety_${Date.now()}`;
      const backupString = JSON.stringify(backupData);
      
      if (backupString.length > BACKUP_CONFIG.MAX_BACKUP_SIZE) {
        console.warn('Backup de segurança muito grande, pulando...');
        return;
      }

      localStorage.setItem(backupKey, backupString);
      this.updateBackupMetadata(backupKey, 'safety');
      this.cleanupOldBackups();
      
      console.log('Backup de segurança realizado com sucesso');
      
    } catch (error) {
      console.error('Erro no backup de segurança:', error);
    } finally {
      this.isBackupInProgress = false;
    }
  }

  // Realizar backup manual
  async performManualBackup(description = '') {
    if (this.isBackupInProgress) {
      throw new Error('Backup já está em andamento');
    }

    try {
      this.isBackupInProgress = true;
      
      const projectData = this.getCurrentProjectData();
      if (!projectData.project) {
        throw new Error('Nenhum projeto ativo para backup');
      }

      const backupData = {
        ...projectData,
        timestamp: Date.now(),
        type: 'manual',
        description,
        version: '1.0'
      };

      const backupKey = `backup_manual_${Date.now()}`;
      const backupString = JSON.stringify(backupData);
      
      if (backupString.length > BACKUP_CONFIG.MAX_BACKUP_SIZE) {
        throw new Error('Dados do projeto muito grandes para backup');
      }

      localStorage.setItem(backupKey, backupString);
      this.updateBackupMetadata(backupKey, 'manual', description);
      this.cleanupOldBackups();
      
      this.lastBackupTime = Date.now();
      localStorage.setItem('lastBackupTime', this.lastBackupTime.toString());
      
      console.log('Backup manual realizado com sucesso');
      
      return {
        success: true,
        message: 'Backup realizado com sucesso',
        backupKey,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('Erro no backup manual:', error);
      throw error;
    } finally {
      this.isBackupInProgress = false;
    }
  }

  // Restaurar backup
  async restoreBackup(backupKey) {
    try {
      const backupString = localStorage.getItem(backupKey);
      if (!backupString) {
        throw new Error('Backup não encontrado');
      }

      const backupData = JSON.parse(backupString);
      
      // Validar dados do backup
      if (!backupData.project || !backupData.volumes) {
        throw new Error('Dados do backup inválidos');
      }

      // Restaurar dados
      this.restoreProjectData(backupData);
      
      console.log('Backup restaurado com sucesso');
      
      return {
        success: true,
        message: 'Backup restaurado com sucesso',
        backupData
      };
      
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw error;
    }
  }

  // Obter dados atuais do projeto
  getCurrentProjectData() {
    const store = require('../store/useStore').default.getState();
    
    return {
      project: store.currentProject,
      volumes: store.projectStructure?.volumes || [],
      worldData: store.worldData || {},
      characters: store.characters || [],
      loreData: store.loreData || {},
      narrativeData: store.narrativeData || {},
      settings: store.settings || {},
      goals: JSON.parse(localStorage.getItem('writing-goals') || '[]'),
      dailyStats: JSON.parse(localStorage.getItem('daily-writing-stats') || '{}'),
      quickNotes: JSON.parse(localStorage.getItem('quick-notes') || '[]')
    };
  }

  // Restaurar dados do projeto
  restoreProjectData(backupData) {
    const store = require('../store/useStore').default;
    
    // Restaurar dados principais
    if (backupData.project) {
      store.getState().setCurrentProject(backupData.project);
    }
    
    if (backupData.volumes) {
      // Atualizar a estrutura do projeto diretamente
      store.setState((state) => ({
        projectStructure: {
          ...state.projectStructure,
          volumes: backupData.volumes
        }
      }));
    }
    
    if (backupData.worldData) {
      store.getState().updateWorldData(backupData.worldData);
    }
    
    if (backupData.characters) {
      // Substituir todos os personagens
      store.setState({ characters: backupData.characters });
    }
    
    if (backupData.loreData) {
      // Substituir todos os dados de lore
      store.setState({ loreData: backupData.loreData });
    }
    
    if (backupData.narrativeData) {
      // Substituir todos os dados narrativos
      store.setState({ narrativeData: backupData.narrativeData });
    }
    
    if (backupData.settings) {
      store.getState().updateSettings(backupData.settings);
    }
    
    // Restaurar dados locais
    if (backupData.goals) {
      localStorage.setItem('writing-goals', JSON.stringify(backupData.goals));
    }
    
    if (backupData.dailyStats) {
      localStorage.setItem('daily-writing-stats', JSON.stringify(backupData.dailyStats));
    }
    
    if (backupData.quickNotes) {
      localStorage.setItem('quick-notes', JSON.stringify(backupData.quickNotes));
    }
  }

  // Atualizar metadados de backup
  updateBackupMetadata(backupKey, type, description = '') {
    const metadata = this.getBackupMetadata();
    
    metadata.backups.push({
      key: backupKey,
      type,
      description,
      timestamp: Date.now(),
      size: localStorage.getItem(backupKey)?.length || 0
    });
    
    localStorage.setItem('backupMetadata', JSON.stringify(metadata));
  }

  // Obter metadados de backup
  getBackupMetadata() {
    const stored = localStorage.getItem('backupMetadata');
    return stored ? JSON.parse(stored) : { backups: [] };
  }

  // Limpar backups antigos
  cleanupOldBackups() {
    try {
      const metadata = this.getBackupMetadata();
      const { backups } = metadata;
      
      // Verificar se há erro de quota e fazer limpeza mais agressiva
      const isQuotaExceeded = this.checkQuotaExceeded();
      
      // Separar por tipo
      const autoBackups = backups.filter(b => b.type === 'auto');
      const manualBackups = backups.filter(b => b.type === 'manual');
      const safetyBackups = backups.filter(b => b.type === 'safety');
      
      // Se há erro de quota, limpar mais backups
      const maxAutoBackups = isQuotaExceeded ? Math.max(1, BACKUP_CONFIG.MAX_AUTO_BACKUPS / 2) : BACKUP_CONFIG.MAX_AUTO_BACKUPS;
      const maxManualBackups = isQuotaExceeded ? Math.max(5, BACKUP_CONFIG.MAX_MANUAL_BACKUPS / 2) : BACKUP_CONFIG.MAX_MANUAL_BACKUPS;
      const maxSafetyBackups = isQuotaExceeded ? Math.max(2, BACKUP_CONFIG.MAX_SAFETY_BACKUPS / 2) : BACKUP_CONFIG.MAX_SAFETY_BACKUPS;
      
      // Limpar backups automáticos antigos
      if (autoBackups.length > maxAutoBackups) {
        const toRemove = autoBackups
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, autoBackups.length - maxAutoBackups);
        
        toRemove.forEach(backup => {
          try {
            localStorage.removeItem(backup.key);
          } catch (e) {
            console.warn('Erro ao remover backup:', backup.key, e);
          }
          metadata.backups = metadata.backups.filter(b => b.key !== backup.key);
        });
      }
      
      // Limpar backups manuais antigos
      if (manualBackups.length > maxManualBackups) {
        const toRemove = manualBackups
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, manualBackups.length - maxManualBackups);
        
        toRemove.forEach(backup => {
          try {
            localStorage.removeItem(backup.key);
          } catch (e) {
            console.warn('Erro ao remover backup:', backup.key, e);
          }
          metadata.backups = metadata.backups.filter(b => b.key !== backup.key);
        });
      }
      
      // Limpar backups de segurança antigos
      if (safetyBackups.length > maxSafetyBackups) {
        const toRemove = safetyBackups
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, safetyBackups.length - maxSafetyBackups);
        
        toRemove.forEach(backup => {
          try {
            localStorage.removeItem(backup.key);
          } catch (e) {
            console.warn('Erro ao remover backup:', backup.key, e);
          }
          metadata.backups = metadata.backups.filter(b => b.key !== backup.key);
        });
      }
      
      // Se ainda há erro de quota, limpar todos os backups exceto os mais recentes
      if (isQuotaExceeded && backups.length > 10) {
        const sortedBackups = backups.sort((a, b) => b.timestamp - a.timestamp);
        const toKeep = sortedBackups.slice(0, 10);
        const toRemove = sortedBackups.slice(10);
        
        toRemove.forEach(backup => {
          try {
            localStorage.removeItem(backup.key);
          } catch (e) {
            console.warn('Erro ao remover backup:', backup.key, e);
          }
        });
        
        metadata.backups = toKeep;
      }
      
      try {
        localStorage.setItem('backupMetadata', JSON.stringify(metadata));
      } catch (e) {
        console.warn('Erro ao salvar metadados de backup:', e);
      }
    } catch (error) {
      console.error('Erro durante limpeza de backups:', error);
    }
  }

  // Verificar se há erro de quota
  checkQuotaExceeded() {
    try {
      // Tenta salvar um item pequeno para testar a quota
      const testKey = `quota_test_${Date.now()}`;
      const testValue = 'test';
      localStorage.setItem(testKey, testValue);
      localStorage.removeItem(testKey);
      return false;
    } catch (error) {
      return error.name === 'QuotaExceededError';
    }
  }

  // Obter estatísticas de backup
  getBackupStats() {
    const metadata = this.getBackupMetadata();
    const { backups } = metadata;
    
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    const autoCount = backups.filter(b => b.type === 'auto').length;
    const manualCount = backups.filter(b => b.type === 'manual').length;
    const safetyCount = backups.filter(b => b.type === 'safety').length;
    
    return {
      totalBackups: backups.length,
      totalSize: this.formatBytes(totalSize),
      autoBackups: autoCount,
      manualBackups: manualCount,
      safetyBackups: safetyCount,
      lastBackup: this.lastBackupTime ? new Date(this.lastBackupTime).toLocaleString() : 'Nunca',
      nextAutoBackup: this.getNextAutoBackupTime()
    };
  }

  // Obter lista de backups
  getBackupList() {
    const metadata = this.getBackupMetadata();
    return metadata.backups
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(backup => ({
        ...backup,
        date: new Date(backup.timestamp).toLocaleString(),
        size: this.formatBytes(backup.size)
      }));
  }

  // Excluir backup
  deleteBackup(backupKey) {
    try {
      localStorage.removeItem(backupKey);
      
      const metadata = this.getBackupMetadata();
      metadata.backups = metadata.backups.filter(b => b.key !== backupKey);
      localStorage.setItem('backupMetadata', JSON.stringify(metadata));
      
      return { success: true, message: 'Backup excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      throw error;
    }
  }

  // Exportar backup para arquivo
  async exportBackupToFile(backupKey, filename = null) {
    try {
      const backupString = localStorage.getItem(backupKey);
      if (!backupString) {
        throw new Error('Backup não encontrado');
      }

      const backupData = JSON.parse(backupString);
      const metadata = this.getBackupMetadata();
      const backupMeta = metadata.backups.find(b => b.key === backupKey);
      
      if (!filename) {
        const date = new Date(backupMeta.timestamp).toISOString().split('T')[0];
        const time = new Date(backupMeta.timestamp).toTimeString().split(' ')[0].replace(/:/g, '-');
        filename = `backup_${backupMeta.type}_${date}_${time}.json`;
      }

      const blob = new Blob([backupString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Backup exportado com sucesso', filename };
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      throw error;
    }
  }

  // Importar backup de arquivo
  async importBackupFromFile(file) {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      // Validar dados
      if (!backupData.project || !backupData.volumes) {
        throw new Error('Arquivo de backup inválido');
      }
      
      const backupKey = `backup_imported_${Date.now()}`;
      localStorage.setItem(backupKey, text);
      
      this.updateBackupMetadata(backupKey, 'imported', `Importado de ${file.name}`);
      
      return { success: true, message: 'Backup importado com sucesso', backupKey };
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      throw error;
    }
  }

  // Utilitários
  getLastBackupTime() {
    const stored = localStorage.getItem('lastBackupTime');
    return stored ? parseInt(stored) : null;
  }

  getNextAutoBackupTime() {
    if (!this.lastBackupTime) return 'Desconhecido';
    const nextTime = this.lastBackupTime + BACKUP_CONFIG.AUTO_BACKUP_INTERVAL;
    return new Date(nextTime).toLocaleString();
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Verificar integridade dos backups
  checkBackupIntegrity() {
    const metadata = this.getBackupMetadata();
    const issues = [];
    
    metadata.backups.forEach(backup => {
      const backupString = localStorage.getItem(backup.key);
      if (!backupString) {
        issues.push(`Backup ${backup.key} não encontrado no localStorage`);
        return;
      }
      
      try {
        const backupData = JSON.parse(backupString);
        if (!backupData.project || !backupData.volumes) {
          issues.push(`Backup ${backup.key} tem dados inválidos`);
        }
      } catch (error) {
        issues.push(`Backup ${backup.key} tem formato JSON inválido`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// Instância global do gerenciador de backup
const backupManager = new BackupManager();

export default backupManager;
export { BACKUP_CONFIG };
