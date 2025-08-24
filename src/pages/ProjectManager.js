import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  FileText,
  Users,
  Globe,
  BookOpen,
  Settings,
  Download,
  Upload,
  Eye,
  Star,
  Clock,
  Target,
  BarChart3,
  MoreVertical
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const ProjectManager = () => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    setCurrentProject,
    currentProject 
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    genre: '',
    targetAudience: '',
    targetWordCount: '',
    status: 'active',
    tags: ''
  });

  const genres = [
    'Fantasia',
    'Ficção Científica',
    'Romance',
    'Ação/Aventura',
    'Mistério/Suspense',
    'Terror',
    'Drama',
    'Comédia',
    'Histórico',
    'Contemporâneo',
    'Isekai',
    'Slice of Life',
    'Outro'
  ];

  const statuses = [
    { value: 'planning', label: 'Planejamento', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
    { value: 'paused', label: 'Pausado', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Concluído', color: 'bg-green-100 text-green-800' },
    { value: 'abandoned', label: 'Abandonado', color: 'bg-red-100 text-red-800' }
  ];

  const handleFormChange = (field, value) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!projectForm.name.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, {
        ...projectForm,
        updatedAt: new Date().toISOString()
      });
      toast.success('Projeto atualizado!');
    } else {
      addProject({
        ...projectForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: 0,
        chapters: []
      });
      toast.success('Projeto criado!');
    }

    resetForm();
  };

  const resetForm = () => {
    setProjectForm({
      name: '',
      description: '',
      genre: '',
      targetAudience: '',
      targetWordCount: '',
      status: 'active',
      tags: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setProjectForm(project);
    setShowForm(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      deleteProject(projectId);
      toast.success('Projeto excluído!');
    }
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    toast.success(`Projeto "${project.name}" selecionado!`);
  };

  const exportProject = (project) => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Projeto exportado!');
  };

  const importProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedProject = JSON.parse(e.target.result);
            addProject(importedProject);
            toast.success('Projeto importado!');
          } catch (error) {
            toast.error('Erro ao importar projeto');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !filterGenre || project.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'wordCount':
          return (b.wordCount || 0) - (a.wordCount || 0);
        default:
          return 0;
      }
    });

  const getProjectStats = (project) => {
    const wordCount = project.wordCount || 0;
    const targetWords = project.targetWordCount || 0;
    const progress = targetWords > 0 ? Math.min((wordCount / targetWords) * 100, 100) : 0;
    const chapters = project.chapters?.length || 0;
    
    return { wordCount, targetWords, progress, chapters };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Projetos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os seus projetos de light novel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={importProject}
            className="btn-outline flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="input-field w-48"
          >
            <option value="">Todos os gêneros</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-48"
          >
            <option value="updated">Mais Recentes</option>
            <option value="created">Data de Criação</option>
            <option value="name">Nome</option>
            <option value="wordCount">Palavras</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Nome do projeto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Descrição do projeto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero
                  </label>
                  <select
                    value={projectForm.genre}
                    onChange={(e) => handleFormChange('genre', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Selecione um gênero</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Público-Alvo
                    </label>
                    <input
                      type="text"
                      value={projectForm.targetAudience}
                      onChange={(e) => handleFormChange('targetAudience', e.target.value)}
                      className="input-field"
                      placeholder="Jovens adultos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta de Palavras
                    </label>
                    <input
                      type="number"
                      value={projectForm.targetWordCount}
                      onChange={(e) => handleFormChange('targetWordCount', e.target.value)}
                      className="input-field"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="input-field"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => handleFormChange('tags', e.target.value)}
                    className="input-field"
                    placeholder="fantasia, aventura, magia"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {editingProject ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const stats = getProjectStats(project);
              const statusInfo = statuses.find(s => s.value === project.status);
              const isCurrentProject = currentProject?.id === project.id;
              
              return (
                <div
                  key={project.id}
                  className={`card hover:shadow-md transition-shadow ${
                    isCurrentProject ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {statusInfo && (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        )}
                        {isCurrentProject && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Ativo
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleSelectProject(project)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                        title="Selecionar Projeto"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => exportProject(project)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Exportar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progresso:</span>
                      <span className="font-medium">
                        {stats.wordCount.toLocaleString()} / {stats.targetWords.toLocaleString() || '∞'}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{stats.chapters} capítulos</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {project.genre && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{project.genre}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500">
                {projects.length === 0 
                  ? 'Crie seu primeiro projeto para começar'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
