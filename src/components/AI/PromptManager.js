import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  BookOpen,
  Sparkles,
  Settings,
  BarChart3,
  History,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { PromptManager, PromptTemplate, PromptValidator, PromptOptimizer } from '../../utils/promptTools';
import { BASE_PROMPTS } from '../../utils/promptBank';

const PromptManagerComponent = ({ worldData, aiService, onPromptExecute }) => {
  const [promptManager] = useState(() => new PromptManager());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detail
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptValidation, setPromptValidation] = useState(null);

  // Categorias de prompts
  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'geography', name: 'Geografia', icon: Sparkles },
    { id: 'cultures', name: 'Culturas', icon: Sparkles },
    { id: 'systems', name: 'Sistemas', icon: Sparkles },
    { id: 'history', name: 'História', icon: Sparkles },
    { id: 'worldInfo', name: 'Informações do Mundo', icon: Sparkles }
  ];

  // Inicializa o gerenciador com prompts padrão
  useEffect(() => {
    // Registra prompts de geografia
    Object.entries(BASE_PROMPTS.geography).forEach(([key, prompt]) => {
      if (typeof prompt === 'string') {
        const template = new PromptTemplate(`geography_${key}`, prompt)
          .withMetadata({
            category: 'geography',
            difficulty: 'medium',
            tags: ['geografia', key]
          });
        promptManager.registerTemplate(template);
      } else if (typeof prompt === 'object') {
        Object.entries(prompt).forEach(([subKey, subPrompt]) => {
          const template = new PromptTemplate(`geography_${key}_${subKey}`, subPrompt)
            .withMetadata({
              category: 'geography',
              difficulty: 'medium',
              tags: ['geografia', key, subKey]
            });
          promptManager.registerTemplate(template);
        });
      }
    });

    // Registra prompts de culturas
    Object.entries(BASE_PROMPTS.cultures).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`cultures_${key}`, prompt)
        .withMetadata({
          category: 'cultures',
          difficulty: 'medium',
          tags: ['culturas', key]
        });
      promptManager.registerTemplate(template);
    });

    // Registra prompts de sistemas
    Object.entries(BASE_PROMPTS.systems).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`systems_${key}`, prompt)
        .withMetadata({
          category: 'systems',
          difficulty: 'medium',
          tags: ['sistemas', key]
        });
      promptManager.registerTemplate(template);
    });

    // Registra prompts de história
    Object.entries(BASE_PROMPTS.history).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`history_${key}`, prompt)
        .withMetadata({
          category: 'history',
          difficulty: 'medium',
          tags: ['história', key]
        });
      promptManager.registerTemplate(template);
    });

    // Registra prompts de informações do mundo
    Object.entries(BASE_PROMPTS.worldInfo).forEach(([key, prompt]) => {
      const template = new PromptTemplate(`worldInfo_${key}`, prompt)
        .withMetadata({
          category: 'worldInfo',
          difficulty: 'easy',
          tags: ['mundo', key]
        });
      promptManager.registerTemplate(template);
    });
  }, [promptManager]);

  // Filtra prompts baseado na categoria e busca
  const filteredPrompts = useMemo(() => {
    let prompts = promptManager.listTemplates();
    
    if (selectedCategory !== 'all') {
      prompts = prompts.filter(p => p.metadata.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      prompts = prompts.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.metadata.tags.some(tag => tag.toLowerCase().includes(term)) ||
        p.basePrompt.toLowerCase().includes(term)
      );
    }
    
    return prompts;
  }, [promptManager, selectedCategory, searchTerm]);

  // Valida prompt customizado
  const validateCustomPrompt = () => {
    if (customPrompt.trim()) {
      const validation = PromptValidator.validatePrompt(customPrompt);
      setPromptValidation(validation);
      return validation.isValid;
    }
    return false;
  };

  // Executa um prompt
  const executePrompt = async (templateName, context = {}) => {
    try {
      const result = await promptManager.executePrompt(templateName, context, aiService);
      if (onPromptExecute) {
        onPromptExecute(result, templateName);
      }
      return result;
    } catch (error) {
      console.error('Erro ao executar prompt:', error);
      throw error;
    }
  };

  // Renderiza card de prompt
  const PromptCard = ({ prompt }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{prompt.name}</h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs rounded ${
              prompt.metadata.category === 'geography' ? 'bg-blue-100 text-blue-800' :
              prompt.metadata.category === 'cultures' ? 'bg-purple-100 text-purple-800' :
              prompt.metadata.category === 'systems' ? 'bg-green-100 text-green-800' :
              prompt.metadata.category === 'history' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {categories.find(c => c.id === prompt.metadata.category)?.name || prompt.metadata.category}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${
              prompt.metadata.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              prompt.metadata.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {prompt.metadata.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedPrompt(prompt)}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setCustomPrompt(prompt.basePrompt);
              setIsEditing(true);
            }}
            className="p-1 text-gray-400 hover:text-green-600"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(prompt.basePrompt)}
            className="p-1 text-gray-400 hover:text-purple-600"
            title="Copiar"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {prompt.basePrompt.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {prompt.metadata.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
          {prompt.metadata.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{prompt.metadata.tags.length - 3}
            </span>
          )}
        </div>
        
        <button
          onClick={() => executePrompt(prompt.name, { worldData })}
          className="btn-primary text-sm"
        >
          Executar
        </button>
      </div>
    </div>
  );

  // Renderiza detalhes do prompt
  const PromptDetail = ({ prompt }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{prompt.name}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPrompt(null)}
            className="btn-ghost"
          >
            Fechar
          </button>
          <button
            onClick={() => executePrompt(prompt.name, { worldData })}
            className="btn-primary"
          >
            Executar Prompt
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Metadados</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Categoria:</span>
              <span className="font-medium">{categories.find(c => c.id === prompt.metadata.category)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dificuldade:</span>
              <span className="font-medium capitalize">{prompt.metadata.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {prompt.metadata.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Prompt Completo</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {prompt.basePrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderiza analytics
  const AnalyticsView = () => {
    const analytics = promptManager.getAnalytics();
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Estatísticas dos Prompts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalPrompts}</div>
            <div className="text-sm text-gray-600">Total de Prompts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.successfulPrompts}</div>
            <div className="text-sm text-gray-600">Sucessos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{analytics.failedPrompts}</div>
            <div className="text-sm text-gray-600">Falhas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.successRate}%</div>
            <div className="text-sm text-gray-600">Taxa de Sucesso</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Tempo Médio de Resposta</h3>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(analytics.averageResponseTime)}ms
          </div>
        </div>
      </div>
    );
  };

  // Renderiza histórico
  const HistoryView = () => {
    const history = promptManager.getHistory(20);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Execuções</h2>
        
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{entry.template}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    entry.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.success ? 'Sucesso' : 'Falha'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(entry.timestamp).toLocaleString('pt-BR')} • {entry.responseTime}ms
                </div>
              </div>
              <button
                onClick={() => setCustomPrompt(entry.prompt)}
                className="btn-ghost text-sm"
              >
                Ver Prompt
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Prompts</h1>
          <p className="text-gray-600">Gerencie e execute prompts para geração de conteúdo</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="btn-outline flex items-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-outline flex items-center"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Prompt
          </button>
        </div>
      </div>

      {/* Analytics */}
      {showAnalytics && <AnalyticsView />}

      {/* Histórico */}
      {showHistory && <HistoryView />}

      {/* Detalhes do prompt */}
      {selectedPrompt && <PromptDetail prompt={selectedPrompt} />}

      {/* Editor de prompt customizado */}
      {isEditing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Editor de Prompt</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCustomPrompt('');
                  setPromptValidation(null);
                }}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (validateCustomPrompt()) {
                    // Salvar prompt customizado
                    setIsEditing(false);
                  }
                }}
                className="btn-primary"
              >
                Salvar
              </button>
            </div>
          </div>
          
          <textarea
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              if (promptValidation) {
                setPromptValidation(null);
              }
            }}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite seu prompt aqui..."
          />
          
          {promptValidation && (
            <div className={`mt-4 p-4 rounded-lg ${
              promptValidation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-medium mb-2 ${
                promptValidation.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {promptValidation.isValid ? 'Prompt Válido' : 'Problemas Encontrados'}
              </h3>
              {!promptValidation.isValid && (
                <ul className="text-red-700 text-sm space-y-1">
                  {promptValidation.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              )}
              {promptValidation.suggestions && promptValidation.suggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-green-800 mb-1">Sugestões:</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    {promptValidation.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* Modo de visualização */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-gray-600"></div>
                <div className="bg-gray-600"></div>
                <div className="bg-gray-600"></div>
                <div className="bg-gray-600"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <div className="w-4 h-4 space-y-1">
                <div className="h-0.5 bg-gray-600"></div>
                <div className="h-0.5 bg-gray-600"></div>
                <div className="h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {filteredPrompts.length} prompt(s) encontrado(s)
        </div>
      </div>

      {/* Lista de prompts */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.name} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.name} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{prompt.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {prompt.basePrompt.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    prompt.metadata.category === 'geography' ? 'bg-blue-100 text-blue-800' :
                    prompt.metadata.category === 'cultures' ? 'bg-purple-100 text-purple-800' :
                    prompt.metadata.category === 'systems' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {categories.find(c => c.id === prompt.metadata.category)?.name}
                  </span>
                  <button
                    onClick={() => executePrompt(prompt.name, { worldData })}
                    className="btn-primary text-sm"
                  >
                    Executar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum prompt encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros de busca ou criar um novo prompt.
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptManagerComponent;
