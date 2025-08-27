import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Edit, 
  Trash2,
  Plus,
  Filter,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  GitBranch,
  History
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const RevisionSystem = ({ content, onRevisionUpdate }) => {
  const [revisions, setRevisions] = useState(() => {
    const saved = localStorage.getItem('text-revisions');
    return saved ? JSON.parse(saved) : [];
  });
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('text-comments');
    return saved ? JSON.parse(saved) : [];
  });
  const [markers, setMarkers] = useState(() => {
    const saved = localStorage.getItem('text-markers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showComments, setShowComments] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedText, setSelectedText] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [commentForm, setCommentForm] = useState({
    text: '',
    type: 'suggestion',
    priority: 'medium'
  });
  const [markerForm, setMarkerForm] = useState({
    type: 'review',
    description: ''
  });

  const commentTypes = [
    { value: 'suggestion', label: 'Sugestão', icon: MessageSquare, color: 'text-blue-600' },
    { value: 'question', label: 'Pergunta', icon: AlertCircle, color: 'text-yellow-600' },
    { value: 'correction', label: 'Correção', icon: Edit, color: 'text-red-600' },
    { value: 'praise', label: 'Elogio', icon: CheckCircle, color: 'text-green-600' }
  ];

  const markerTypes = [
    { value: 'review', label: 'Revisar', icon: Edit, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'rewrite', label: 'Reescrever', icon: RotateCcw, color: 'bg-red-100 text-red-800' },
    { value: 'expand', label: 'Expandir', icon: Plus, color: 'bg-blue-100 text-blue-800' },
    { value: 'check', label: 'Verificar', icon: CheckCircle, color: 'bg-green-100 text-green-800' }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'text-gray-600' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600' },
    { value: 'high', label: 'Alta', color: 'text-red-600' }
  ];

  useEffect(() => {
    localStorage.setItem('text-revisions', JSON.stringify(revisions));
  }, [revisions]);

  useEffect(() => {
    localStorage.setItem('text-comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('text-markers', JSON.stringify(markers));
  }, [markers]);

  // Capturar texto selecionado
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.toString().trim()) {
        setSelectedText(selection.toString());
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const createRevision = () => {
    const newRevision = {
      id: Date.now(),
      content: content,
      timestamp: new Date().toISOString(),
      description: `Revisão ${revisions.length + 1}`,
      comments: comments.length,
      markers: markers.length
    };

    setRevisions(prev => [newRevision, ...prev]);
    toast.success('Revisão salva!');
  };

  const addComment = () => {
    if (!commentForm.text.trim() || !selectedText.trim()) {
      toast.error('Selecione um texto e adicione um comentário');
      return;
    }

    const newComment = {
      id: Date.now(),
      selectedText: selectedText,
      text: commentForm.text,
      type: commentForm.type,
      priority: commentForm.priority,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setComments(prev => [newComment, ...prev]);
    setCommentForm({ text: '', type: 'suggestion', priority: 'medium' });
    setShowAddComment(false);
    setSelectedText('');
    toast.success('Comentário adicionado!');
  };

  const addMarker = () => {
    if (!selectedText.trim()) {
      toast.error('Selecione um texto para marcar');
      return;
    }

    const newMarker = {
      id: Date.now(),
      selectedText: selectedText,
      type: markerForm.type,
      description: markerForm.description,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setMarkers(prev => [newMarker, ...prev]);
    setMarkerForm({ type: 'review', description: '' });
    setShowAddMarker(false);
    setSelectedText('');
    toast.success('Marcador adicionado!');
  };

  const resolveComment = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    ));
  };

  const resolveMarker = (markerId) => {
    setMarkers(prev => prev.map(marker => 
      marker.id === markerId ? { ...marker, resolved: !marker.resolved } : marker
    ));
  };

  const deleteComment = (commentId) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comentário excluído!');
    }
  };

  const deleteMarker = (markerId) => {
    if (window.confirm('Tem certeza que deseja excluir este marcador?')) {
      setMarkers(prev => prev.filter(marker => marker.id !== markerId));
      toast.success('Marcador excluído!');
    }
  };

  const restoreRevision = (revision) => {
    if (window.confirm('Deseja restaurar esta revisão? O conteúdo atual será substituído.')) {
      onRevisionUpdate(revision.content);
      toast.success('Revisão restaurada!');
    }
  };

  const filteredComments = comments.filter(comment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'resolved') return comment.resolved;
    if (activeFilter === 'unresolved') return !comment.resolved;
    return comment.type === activeFilter;
  });

  const filteredMarkers = markers.filter(marker => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'resolved') return marker.resolved;
    if (activeFilter === 'unresolved') return !marker.resolved;
    return marker.type === activeFilter;
  });

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sistema de Revisão</h2>
          <p className="text-muted-foreground">Gerencie comentários, marcadores e versões do texto</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={createRevision}
            className="btn-primary flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Revisão
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revisões</p>
              <p className="text-2xl font-bold text-foreground">{revisions.length}</p>
            </div>
            <GitBranch className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Comentários</p>
              <p className="text-2xl font-bold text-foreground">{comments.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Marcadores</p>
              <p className="text-2xl font-bold text-foreground">{markers.length}</p>
            </div>
            <Tag className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-foreground">
                {comments.filter(c => !c.resolved).length + markers.filter(m => !m.resolved).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              showComments ? 'bg-blue-100 text-blue-800' : 'bg-muted text-muted-foreground'
            }`}
          >
            {showComments ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>Comentários</span>
          </button>

          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              showMarkers ? 'bg-purple-100 text-purple-800' : 'bg-muted text-muted-foreground'
            }`}
          >
            {showMarkers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>Marcadores</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Todos</option>
            <option value="unresolved">Pendentes</option>
            <option value="resolved">Resolvidos</option>
            <option value="suggestion">Sugestões</option>
            <option value="question">Perguntas</option>
            <option value="correction">Correções</option>
            <option value="praise">Elogios</option>
          </select>
        </div>
      </div>

      {/* Texto Selecionado */}
      {selectedText && (
        <div className="card p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">Texto Selecionado:</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddComment(true)}
                className="btn-outline flex items-center text-sm"
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                Comentar
              </button>
              <button
                onClick={() => setShowAddMarker(true)}
                className="btn-outline flex items-center text-sm"
              >
                <Tag className="mr-1 h-3 w-3" />
                Marcar
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">"{selectedText}"</p>
        </div>
      )}

      {/* Comentários */}
      {showComments && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Comentários</h3>
          {filteredComments.length === 0 ? (
            <div className="card p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-lg font-medium text-foreground mb-2">Nenhum comentário</h4>
              <p className="text-muted-foreground">Selecione um texto e adicione comentários para revisão</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComments.map(comment => {
                const commentType = commentTypes.find(t => t.value === comment.type);
                const priority = priorities.find(p => p.value === comment.priority);
                const CommentTypeIcon = commentType?.icon || MessageSquare;
                const PriorityIcon = priority?.value === 'high' ? AlertCircle : 
                                   priority?.value === 'medium' ? MessageSquare : CheckCircle;

                return (
                  <div key={comment.id} className={`card p-4 ${comment.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CommentTypeIcon className={`h-4 w-4 ${commentType?.color}`} />
                        <span className={`text-sm font-medium ${commentType?.color}`}>
                          {commentType?.label}
                        </span>
                        <PriorityIcon className={`h-4 w-4 ${priority?.color}`} />
                        <span className={`text-sm ${priority?.color}`}>
                          {priority?.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => resolveComment(comment.id)}
                          className={`p-1 rounded ${
                            comment.resolved 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="p-1 text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Texto:</strong> "{comment.selectedText}"
                      </p>
                      <p className="text-foreground">{comment.text}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(comment.timestamp)}</span>
                      <span>{comment.resolved ? 'Resolvido' : 'Pendente'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Marcadores */}
      {showMarkers && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Marcadores</h3>
          {filteredMarkers.length === 0 ? (
            <div className="card p-8 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-lg font-medium text-foreground mb-2">Nenhum marcador</h4>
              <p className="text-muted-foreground">Selecione um texto e adicione marcadores para revisão</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMarkers.map(marker => {
                const markerType = markerTypes.find(t => t.value === marker.type);
                const MarkerTypeIcon = markerType?.icon || Tag;

                return (
                  <div key={marker.id} className={`card p-4 ${marker.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MarkerTypeIcon className="h-4 w-4" />
                        <span className={`text-sm font-medium px-2 py-1 rounded ${markerType?.color}`}>
                          {markerType?.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => resolveMarker(marker.id)}
                          className={`p-1 rounded ${
                            marker.resolved 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMarker(marker.id)}
                          className="p-1 text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Texto:</strong> "{marker.selectedText}"
                      </p>
                      {marker.description && (
                        <p className="text-foreground">{marker.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(marker.timestamp)}</span>
                      <span>{marker.resolved ? 'Resolvido' : 'Pendente'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Histórico de Revisões */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Histórico de Revisões</h3>
        {revisions.length === 0 ? (
          <div className="card p-8 text-center">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhuma revisão salva</h4>
            <p className="text-muted-foreground">Salve revisões para manter um histórico das mudanças</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revisions.map(revision => (
              <div key={revision.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{revision.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      {revision.comments} comentários • {revision.markers} marcadores
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => restoreRevision(revision)}
                      className="btn-outline flex items-center text-sm"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restaurar
                    </button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(revision.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Adicionar Comentário */}
      {showAddComment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Adicionar Comentário</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tipo de Comentário
                </label>
                <select
                  value={commentForm.type}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  {commentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Prioridade
                </label>
                <select
                  value={commentForm.priority}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="input-field"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Comentário
                </label>
                <textarea
                  value={commentForm.text}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, text: e.target.value }))}
                  className="input-field"
                  rows="4"
                  placeholder="Digite seu comentário..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddComment(false);
                    setCommentForm({ text: '', type: 'suggestion', priority: 'medium' });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button onClick={addComment} className="btn-primary flex-1">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Marcador */}
      {showAddMarker && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Adicionar Marcador</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tipo de Marcador
                </label>
                <select
                  value={markerForm.type}
                  onChange={(e) => setMarkerForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  {markerTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={markerForm.description}
                  onChange={(e) => setMarkerForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Descrição do marcador..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddMarker(false);
                    setMarkerForm({ type: 'review', description: '' });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button onClick={addMarker} className="btn-primary flex-1">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionSystem;
