import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Calendar,
  Search,
  Filter,
  BookOpen,
  Users,
  MapPin,
  MessageSquare
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const QuickNotes = () => {
  const { currentProject } = useStore();
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('quick-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    relatedTo: 'project',
    relatedId: currentProject?.id || null
  });

  const categories = [
    { value: 'general', label: 'Geral', icon: StickyNote },
    { value: 'plot', label: 'Enredo', icon: BookOpen },
    { value: 'character', label: 'Personagem', icon: Users },
    { value: 'world', label: 'Mundo', icon: MapPin },
    { value: 'dialogue', label: 'Diálogo', icon: MessageSquare },
    { value: 'idea', label: 'Ideia', icon: Plus }
  ];

  const relatedTypes = [
    { value: 'project', label: 'Projeto', icon: BookOpen },
    { value: 'character', label: 'Personagem', icon: Users },
    { value: 'location', label: 'Local', icon: MapPin },
    { value: 'general', label: 'Geral', icon: StickyNote }
  ];

  useEffect(() => {
    localStorage.setItem('quick-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (currentProject) {
      setNoteForm(prev => ({ ...prev, relatedId: currentProject.id }));
    }
  }, [currentProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!noteForm.title || !noteForm.content) {
      toast.error('Preencha título e conteúdo');
      return;
    }

    const newNote = {
      id: editingNote?.id || Date.now(),
      ...noteForm,
      tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? newNote : n));
      toast.success('Anotação atualizada!');
    } else {
      setNotes(prev => [newNote, ...prev]);
      toast.success('Anotação criada!');
    }

    setShowForm(false);
    setEditingNote(null);
    setNoteForm({
      title: '',
      content: '',
      category: 'general',
      tags: '',
      relatedTo: 'project',
      relatedId: currentProject?.id || null
    });
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Anotação excluída!');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || note.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
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
          <h2 className="text-2xl font-bold text-foreground">Anotações Rápidas</h2>
          <p className="text-muted-foreground">Capture ideias e observações rapidamente</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Anotação
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar anotações..."
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setActiveFilter(category.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === category.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full card p-8 text-center">
            <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação criada'}
            </h4>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Tente usar termos diferentes na busca' 
                : 'Crie sua primeira anotação para começar'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Criar Primeira Anotação
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => {
            const category = categories.find(c => c.value === note.category);
            const CategoryIcon = category?.icon || StickyNote;
            
            return (
              <div key={note.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="h-4 w-4 text-primary-600" />
                    <div>
                      <h4 className="font-medium text-foreground">{note.title}</h4>
                      <p className="text-xs text-muted-foreground">{category?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setNoteForm(note);
                        setShowForm(true);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-foreground line-clamp-3">
                    {note.content}
                  </p>
                </div>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(note.updatedAt)}</span>
                  <span>{note.relatedTo}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Título da anotação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Categoria
                  </label>
                  <select
                    value={noteForm.category}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Conteúdo
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  className="input-field"
                  rows="8"
                  placeholder="Digite o conteúdo da anotação..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={noteForm.tags}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="input-field"
                    placeholder="ideia, personagem, enredo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Relacionado a
                  </label>
                  <select
                    value={noteForm.relatedTo}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, relatedTo: e.target.value }))}
                    className="input-field"
                  >
                    {relatedTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNote(null);
                    setNoteForm({
                      title: '',
                      content: '',
                      category: 'general',
                      tags: '',
                      relatedTo: 'project',
                      relatedId: currentProject?.id || null
                    });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingNote ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickNotes;
