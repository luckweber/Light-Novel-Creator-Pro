import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  MapPin, 
  Users, 
  Zap, 
  Copy,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  BookOpen,
  Heart,
  Sword,
  Castle,
  TreePine
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const WritingTemplates = () => {
  const { currentProject } = useStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'scene',
    content: '',
    description: '',
    tags: ''
  });

  const templateCategories = [
    { 
      value: 'scene', 
      label: 'Cenas', 
      icon: FileText,
      description: 'Templates para diferentes tipos de cena'
    },
    { 
      value: 'dialogue', 
      label: 'Diálogos', 
      icon: MessageSquare,
      description: 'Estruturas de diálogo'
    },
    { 
      value: 'description', 
      label: 'Descrições', 
      icon: MapPin,
      description: 'Descrições de lugares e personagens'
    },
    { 
      value: 'character', 
      label: 'Personagens', 
      icon: Users,
      description: 'Desenvolvimento de personagens'
    },
    { 
      value: 'action', 
      label: 'Ação', 
      icon: Sword,
      description: 'Cenas de ação e combate'
    },
    { 
      value: 'romance', 
      label: 'Romance', 
      icon: Heart,
      description: 'Cenas românticas'
    }
  ];

  const defaultTemplates = [
    {
      id: 1,
      name: 'Abertura de Capítulo',
      category: 'scene',
      content: `[Nome do Capítulo]

O sol se erguia sobre [local], lançando raios dourados através das [descrição do ambiente]. [Nome do personagem] [ação do personagem], seus [característica física] [movimento/expressão].

[Desenvolver a cena...]`,
      description: 'Template para iniciar um novo capítulo',
      tags: 'abertura, capítulo, introdução'
    },
    {
      id: 2,
      name: 'Diálogo de Confronto',
      category: 'dialogue',
      content: `"[Nome do personagem 1]," [Nome do personagem 2] disse, sua voz carregada de [emoção]. "Você sabe o que isso significa?"

[Nome do personagem 1] [ação/reação], seus olhos [descrição dos olhos]. "Sim," respondeu, [tom de voz]. "Mas isso não muda nada."

[Desenvolver o diálogo...]`,
      description: 'Estrutura para diálogos tensos',
      tags: 'confronto, tensão, diálogo'
    },
    {
      id: 3,
      name: 'Descrição de Personagem',
      category: 'description',
      content: `[Nome do personagem] era [altura] e [constituição física], com [características faciais] que [efeito/impressão]. Seus [cor dos olhos] olhos [característica dos olhos], e seu [tipo de cabelo] cabelo [descrição do cabelo].

[Descrever roupas, postura, etc...]`,
      description: 'Template para descrever personagens',
      tags: 'personagem, descrição, aparência'
    },
    {
      id: 4,
      name: 'Cena de Ação',
      category: 'action',
      content: `[Nome do personagem] [ação de movimento], [descrever o movimento]. [Nome do oponente] [reação do oponente], mas [resultado da ação].

[Desenvolver a sequência de ação...]`,
      description: 'Template para cenas de ação',
      tags: 'ação, combate, movimento'
    },
    {
      id: 5,
      name: 'Momento Romântico',
      category: 'romance',
      content: `[Nome do personagem 1] e [Nome do personagem 2] [posição/contexto], seus olhos se encontrando no [ambiente]. O [elemento ambiental] [descrição do ambiente] criava uma atmosfera [tipo de atmosfera].

[Desenvolver o momento romântico...]`,
      description: 'Template para cenas românticas',
      tags: 'romance, amor, intimidade'
    },
    {
      id: 6,
      name: 'Descrição de Local',
      category: 'description',
      content: `[Nome do local] se estendia [posição/contexto], suas [características principais] [descrição das características]. [Elementos visuais] [descrição dos elementos] criavam um cenário [tipo de cenário].

[Desenvolver a descrição do local...]`,
      description: 'Template para descrever locais',
      tags: 'local, ambiente, cenário'
    }
  ];

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('writing-templates');
    return saved ? JSON.parse(saved) : defaultTemplates;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!templateForm.name || !templateForm.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newTemplate = {
      id: editingTemplate?.id || Date.now(),
      ...templateForm,
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? newTemplate : t));
      toast.success('Template atualizado!');
    } else {
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template criado!');
    }

    setShowForm(false);
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      category: 'scene',
      content: '',
      description: '',
      tags: ''
    });
  };

  const deleteTemplate = (templateId) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template excluído!');
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Template copiado para a área de transferência!');
  };

  const insertIntoEditor = (content) => {
    // Aqui você pode integrar com o editor
    toast.success('Template inserido no editor!');
  };

  const filteredTemplates = templates.filter(template => 
    !selectedTemplate || template.category === selectedTemplate
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Templates de Escrita</h2>
          <p className="text-muted-foreground">Templates específicos para light novels</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTemplate(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedTemplate 
              ? 'bg-primary-600 text-white' 
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          Todos
        </button>
        {templateCategories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedTemplate(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedTemplate === category.value 
                ? 'bg-primary-600 text-white' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <category.icon className="h-4 w-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const category = templateCategories.find(c => c.value === template.category);
          
          return (
            <div key={template.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {category?.icon && <category.icon className="h-5 w-5 text-primary-600" />}
                  <div>
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{category?.label}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => copyToClipboard(template.content)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Copiar template"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertIntoEditor(template.content)}
                    className="p-1 text-muted-foreground hover:text-primary-600"
                    title="Inserir no editor"
                  >
                    <Zap className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setTemplateForm(template);
                      setShowForm(true);
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Editar template"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 text-muted-foreground hover:text-red-600"
                    title="Excluir template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              
              <div className="bg-muted rounded-lg p-3 mb-3">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                  {template.content.substring(0, 150)}...
                </pre>
              </div>
              
              {template.tags && (
                <div className="flex flex-wrap gap-1">
                  {template.tags.split(',').map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const template = templates.find(t => t.name === 'Abertura de Capítulo');
              if (template) copyToClipboard(template.content);
            }}
            className="btn-outline flex items-center justify-center"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Abertura de Capítulo
          </button>
          <button
            onClick={() => {
              const template = templates.find(t => t.name === 'Descrição de Personagem');
              if (template) copyToClipboard(template.content);
            }}
            className="btn-outline flex items-center justify-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Descrição de Personagem
          </button>
          <button
            onClick={() => {
              const template = templates.find(t => t.name === 'Cena de Ação');
              if (template) copyToClipboard(template.content);
            }}
            className="btn-outline flex items-center justify-center"
          >
            <Sword className="mr-2 h-4 w-4" />
            Cena de Ação
          </button>
        </div>
      </div>

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nome do Template
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Ex: Abertura de Capítulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Categoria
                  </label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {templateCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Descreva o propósito deste template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Conteúdo do Template
                </label>
                <textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                  className="input-field"
                  rows="10"
                  placeholder="Digite o conteúdo do template com placeholders entre colchetes..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use [placeholder] para indicar onde o usuário deve inserir conteúdo específico
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={templateForm.tags}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="input-field"
                  placeholder="abertura, capítulo, introdução"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTemplate(null);
                    setTemplateForm({
                      name: '',
                      category: 'scene',
                      content: '',
                      description: '',
                      tags: ''
                    });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingTemplate ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingTemplates;
