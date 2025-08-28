import { useEffect, useRef, useCallback } from 'react';
import { createVersion, VERSION_TYPES } from '../utils/versionControl';
import useStore from '../store/useStore';

const useVersionControl = (content) => {
  const { currentProject } = useStore();
  const lastContentRef = useRef('');
  const autoVersionTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Configurações de versionamento automático
  const AUTO_VERSION_CONFIG = {
    enabled: true,
    interval: 5 * 60 * 1000, // 5 minutos
    minChanges: 50, // Mínimo de caracteres alterados
    maxVersions: 20 // Máximo de versões automáticas por sessão
  };

  // Verificar se houve mudanças significativas
  const hasSignificantChanges = useCallback((oldContent, newContent) => {
    if (!oldContent || !newContent) return false;
    
    const oldWords = oldContent.split(/\s+/).filter(word => word.length > 0);
    const newWords = newContent.split(/\s+/).filter(word => word.length > 0);
    
    const wordDifference = Math.abs(newWords.length - oldWords.length);
    const charDifference = Math.abs(newContent.length - oldContent.length);
    
    return charDifference >= AUTO_VERSION_CONFIG.minChanges || wordDifference >= 10;
  }, []);

  // Criar versão automática
  const createAutoVersion = useCallback(async (content) => {
    if (!currentProject || !AUTO_VERSION_CONFIG.enabled) return;

    try {
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const charCount = content.length;
      
      const message = `Auto-save: ${wordCount} palavras, ${charCount} caracteres`;
      const description = `Versão automática criada durante a escrita. Progresso: ${wordCount} palavras.`;
      
      await createVersion(content, {
        type: VERSION_TYPES.AUTO,
        message,
        description,
        author: 'Sistema',
        isAuto: true
      });

      console.log('Versão automática criada:', message);
    } catch (error) {
      console.error('Erro ao criar versão automática:', error);
    }
  }, [currentProject]);

  // Agendar versão automática
  const scheduleAutoVersion = useCallback((content) => {
    if (autoVersionTimeoutRef.current) {
      clearTimeout(autoVersionTimeoutRef.current);
    }

    autoVersionTimeoutRef.current = setTimeout(() => {
      createAutoVersion(content);
    }, AUTO_VERSION_CONFIG.interval);
  }, [createAutoVersion]);

  // Inicializar versionamento automático
  useEffect(() => {
    if (!currentProject || isInitializedRef.current) return;

    isInitializedRef.current = true;
    lastContentRef.current = content;

    // Criar versão inicial se não existir
    if (content && content.trim().length > 0) {
      createVersion(content, {
        type: VERSION_TYPES.MANUAL,
        message: 'Versão inicial',
        description: 'Primeira versão do projeto',
        author: 'Sistema'
      });
    }

    return () => {
      if (autoVersionTimeoutRef.current) {
        clearTimeout(autoVersionTimeoutRef.current);
      }
    };
  }, [currentProject, content]);

  // Monitorar mudanças no conteúdo
  useEffect(() => {
    if (!currentProject || !isInitializedRef.current) return;

    const hasChanges = hasSignificantChanges(lastContentRef.current, content);
    
    if (hasChanges) {
      lastContentRef.current = content;
      scheduleAutoVersion(content);
    }
  }, [content, currentProject, hasSignificantChanges, scheduleAutoVersion]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (autoVersionTimeoutRef.current) {
        clearTimeout(autoVersionTimeoutRef.current);
      }
    };
  }, []);

  // Função para criar versão manual
  const createManualVersion = useCallback(async (message, description = '') => {
    if (!currentProject || !content) return null;

    try {
      const version = await createVersion(content, {
        type: VERSION_TYPES.MANUAL,
        message: message || 'Versão manual',
        description,
        author: 'Usuário'
      });

      return version;
    } catch (error) {
      console.error('Erro ao criar versão manual:', error);
      return null;
    }
  }, [currentProject, content]);

  // Função para obter estatísticas de versionamento
  const getVersionStats = useCallback(() => {
    if (!currentProject) return null;

    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    const lineCount = content.split('\n').length;

    return {
      wordCount,
      charCount,
      lineCount,
      lastModified: new Date().toISOString(),
      autoVersionEnabled: AUTO_VERSION_CONFIG.enabled,
      autoVersionInterval: AUTO_VERSION_CONFIG.interval
    };
  }, [content, currentProject]);

  return {
    createManualVersion,
    getVersionStats,
    autoVersionConfig: AUTO_VERSION_CONFIG
  };
};

export default useVersionControl;
