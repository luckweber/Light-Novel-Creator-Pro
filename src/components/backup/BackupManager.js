import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Clock,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  FileText,
  Shield,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';
import backupManager, { BACKUP_CONFIG } from '../../utils/backupUtils';
import toast from 'react-hot-toast';

const BackupManager = ({ onClose }) => {
  const [backupList, setBackupList] = useState([]);
  const [backupStats, setBackupStats] = useState({});
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupDescription, setBackupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [integrityCheck, setIntegrityCheck] = useState(null);

  useEffect(() => {
    loadBackupData();
    // Inicializar sistema de backup se ainda não foi inicializado
    backupManager.init();
  }, []);

  const loadBackupData = () => {
    setBackupList(backupManager.getBackupList());
    setBackupStats(backupManager.getBackupStats());
    setIntegrityCheck(backupManager.checkBackupIntegrity());
  };

  const handleCreateBackup = async () => {
    if (!backupDescription.trim()) {
      toast.error('Por favor, adicione uma descrição para o backup');
      return;
    }

    setIsLoading(true);
    try {
      const result = await backupManager.performManualBackup(backupDescription);
      toast.success(result.message);
      setBackupDescription('');
      setShowCreateModal(false);
      loadBackupData();
    } catch (error) {
      toast.error(`Erro ao criar backup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (backupKey) => {
    if (!window.confirm('Tem certeza que deseja restaurar este backup? Isso substituirá todos os dados atuais.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await backupManager.restoreBackup(backupKey);
      toast.success(result.message);
      setShowRestoreModal(false);
      setSelectedBackup(null);
      // Recarregar a página para aplicar as mudanças
      window.location.reload();
    } catch (error) {
      toast.error(`Erro ao restaurar backup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (backupKey) => {
    if (!window.confirm('Tem certeza que deseja excluir este backup?')) {
      return;
    }

    try {
      const result = backupManager.deleteBackup(backupKey);
      toast.success(result.message);
      loadBackupData();
    } catch (error) {
      toast.error(`Erro ao excluir backup: ${error.message}`);
    }
  };

  const handleExportBackup = async (backupKey) => {
    try {
      const result = await backupManager.exportBackupToFile(backupKey);
      toast.success(result.message);
    } catch (error) {
      toast.error(`Erro ao exportar backup: ${error.message}`);
    }
  };

  const handleImportBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await backupManager.importBackupFromFile(file);
      toast.success(result.message);
      loadBackupData();
    } catch (error) {
      toast.error(`Erro ao importar backup: ${error.message}`);
    }
  };

  const getBackupTypeIcon = (type) => {
    switch (type) {
      case 'auto':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'manual':
        return <Save className="h-4 w-4 text-green-500" />;
      case 'safety':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'imported':
        return <Upload className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBackupTypeLabel = (type) => {
    switch (type) {
      case 'auto':
        return 'Automático';
      case 'manual':
        return 'Manual';
      case 'safety':
        return 'Segurança';
      case 'imported':
        return 'Importado';
      default:
        return type;
    }
  };

  const getBackupTypeColor = (type) => {
    switch (type) {
      case 'auto':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'manual':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'safety':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'imported':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Gerenciador de Backups</h2>
            <p className="text-sm text-muted-foreground">Gerencie seus backups automáticos e manuais</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar com estatísticas */}
          <div className="w-80 bg-muted border-r border-border p-6">
            <div className="space-y-6">
              {/* Estatísticas */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de Backups:</span>
                    <span className="font-semibold text-foreground">{backupStats.totalBackups || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tamanho Total:</span>
                    <span className="font-semibold text-foreground">{backupStats.totalSize || '0 Bytes'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Automáticos:</span>
                    <span className="font-semibold text-blue-600">{backupStats.autoBackups || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Manuais:</span>
                    <span className="font-semibold text-green-600">{backupStats.manualBackups || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Segurança:</span>
                    <span className="font-semibold text-purple-600">{backupStats.safetyBackups || 0}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Último Backup:</span>
                    <span className="text-xs text-foreground">{backupStats.lastBackup || 'Nunca'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próximo Auto:</span>
                    <span className="text-xs text-foreground">{backupStats.nextAutoBackup || 'Desconhecido'}</span>
                  </div>
                  
                  {/* Integridade */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {integrityCheck?.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium text-foreground">Integridade</span>
                    </div>
                    {integrityCheck?.issues?.length > 0 && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        {integrityCheck.issues.length} problema(s) encontrado(s)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full btn-primary flex items-center justify-center"
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Backup
                </button>
                
                <label className="w-full btn-outline flex items-center justify-center cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={loadBackupData}
                  className="w-full btn-outline flex items-center justify-center"
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de backups */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {backupList.length === 0 ? (
                <div className="text-center py-12">
                  <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum backup encontrado</h3>
                  <p className="text-muted-foreground">Crie seu primeiro backup para começar</p>
                </div>
              ) : (
                backupList.map((backup) => (
                  <div key={backup.key} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getBackupTypeIcon(backup.type)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">
                              {getBackupTypeLabel(backup.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBackupTypeColor(backup.type)}`}>
                              {backup.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{backup.date}</p>
                          {backup.description && (
                            <p className="text-sm text-foreground mt-1">{backup.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{backup.size}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleExportBackup(backup.key)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                            title="Exportar"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowRestoreModal(true);
                            }}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                            title="Restaurar"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(backup.key)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal de Criar Backup */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Criar Backup Manual</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={backupDescription}
                    onChange={(e) => setBackupDescription(e.target.value)}
                    placeholder="Ex: Antes de grandes mudanças no capítulo 5"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    rows="3"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-outline"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateBackup}
                    className="flex-1 btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando...' : 'Criar Backup'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Restaurar Backup */}
        {showRestoreModal && selectedBackup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Restaurar Backup</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        Atenção!
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Esta ação substituirá todos os dados atuais. Esta operação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Backup:</strong> {selectedBackup.description || getBackupTypeLabel(selectedBackup.type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Data:</strong> {selectedBackup.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tamanho:</strong> {selectedBackup.size}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="flex-1 btn-outline"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleRestoreBackup(selectedBackup.key)}
                    className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Restaurando...' : 'Restaurar Backup'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManager;
