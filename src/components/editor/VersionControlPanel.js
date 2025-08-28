import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  History,
  RotateCcw,
  Plus,
  Save,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import useStore from '../../store/useStore';
import versionControl, { 
  VERSION_TYPES, 
  createVersion, 
  createBranch, 
  switchBranch, 
  getVersionHistory, 
  compareVersions, 
  revertVersion 
} from '../../utils/versionControl';
import toast from 'react-hot-toast';

const VersionControlPanel = ({ content, onContentUpdate }) => {
  const { currentProject } = useStore();
  const [versions, setVersions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [versionForm, setVersionForm] = useState({
    message: '',
    description: '',
    type: VERSION_TYPES.MANUAL
  });

  useEffect(() => {
    if (currentProject) {
      versionControl.init(currentProject.id);
      loadData();
    }
  }, [currentProject]);

  const loadData = () => {
    if (!currentProject) return;
    
    const history = getVersionHistory(currentBranch, 50);
    setVersions(history);
    
    const branchesList = Array.from(versionControl.branches.values());
    setBranches(branchesList);
    setCurrentBranch(versionControl.currentBranch);
  };

  const handleCreateVersion = () => {
    if (!versionForm.message.trim()) {
      toast.error('Adicione uma mensagem para a versão');
      return;
    }

    try {
      const newVersion = createVersion(content, {
        message: versionForm.message,
        description: versionForm.description,
        type: versionForm.type,
        author: 'Usuário'
      });

      if (newVersion) {
        toast.success('Versão criada com sucesso!');
        setVersionForm({ message: '', description: '', type: VERSION_TYPES.MANUAL });
        setShowCreateVersion(false);
        loadData();
      }
    } catch (error) {
      toast.error(`Erro ao criar versão: ${error.message}`);
    }
  };

  const handleRevertVersion = (versionId) => {
    if (!window.confirm('Tem certeza que deseja reverter para esta versão?')) {
      return;
    }

    try {
      const revertVersion = revertVersion(versionId, { author: 'Usuário' });
      if (onContentUpdate) {
        onContentUpdate(revertVersion.content);
      }
      toast.success('Versão revertida com sucesso!');
      loadData();
    } catch (error) {
      toast.error(`Erro ao reverter versão: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Controle de Versões</h2>
          <p className="text-muted-foreground">Gerencie versões e histórico de mudanças</p>
        </div>
        <button
          onClick={() => setShowCreateVersion(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Versão
        </button>
      </div>

      <div className="card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Histórico de Versões</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma versão encontrada</p>
              </div>
            ) : (
              versions.map(version => (
                <div key={version.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Save className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-foreground">
                          {version.message}
                        </span>
                      </div>
                      
                      {version.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {version.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {version.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(version.timestamp)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {version.stats.totalChanges} mudanças
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRevertVersion(version.id)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Reverter para esta versão"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Nova Versão */}
      {showCreateVersion && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Criar Nova Versão</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Mensagem *
                </label>
                <input
                  type="text"
                  value={versionForm.message}
                  onChange={(e) => setVersionForm(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field"
                  placeholder="Descreva as mudanças..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={versionForm.description}
                  onChange={(e) => setVersionForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Descrição detalhada..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateVersion(false);
                    setVersionForm({ message: '', description: '', type: VERSION_TYPES.MANUAL });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button onClick={handleCreateVersion} className="btn-primary flex-1">
                  Criar Versão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionControlPanel;
