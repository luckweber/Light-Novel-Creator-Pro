import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Users, 
  Globe, 
  BookOpen,
  MessageSquare,
  MapPin,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import useStore from '../../store/useStore';
import { Link } from 'react-router-dom';

const GlobalSearch = () => {
  const { 
    projects, 
    characters, 
    worldData, 
    loreData, 
    narrativeData,
    aiConversations 
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInputRef = useRef(null);

  const filters = [
    { id: 'all', label: 'Tudo', icon: Search },
    { id: 'projects', label: 'Projetos', icon: FileText },
    { id: 'characters', label: 'Personagens', icon: Users },
    { id: 'locations', label: 'Locais', icon: MapPin },
    { id: 'lore', label: 'Lore', icon: BookOpen },
    { id: 'conversations', label: 'Conversas AI', icon: MessageSquare }
  ];

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const term = searchTerm.toLowerCase();

    // Buscar em projetos
    if (activeFilter === 'all' || activeFilter === 'projects') {
      projects.forEach(project => {
        if (project.name.toLowerCase().includes(term) ||
            project.description?.toLowerCase().includes(term) ||
            project.genre?.toLowerCase().includes(term)) {
          results.push({
            type: 'project',
            id: project.id,
            title: project.name,
            subtitle: project.genre || 'Sem gênero',
            description: project.description || 'Sem descrição',
            icon: FileText,
            href: '/projects'
          });
        }
      });
    }

    // Buscar em personagens
    if (activeFilter === 'all' || activeFilter === 'characters') {
      characters.forEach(character => {
        if (character.name.toLowerCase().includes(term) ||
            character.description?.toLowerCase().includes(term) ||
            character.role?.toLowerCase().includes(term)) {
          results.push({
            type: 'character',
            id: character.id,
            title: character.name,
            subtitle: character.role || 'Sem papel definido',
            description: character.description || 'Sem descrição',
            icon: Users,
            href: '/character-generator'
          });
        }
      });
    }

    // Buscar em locais
    if (activeFilter === 'all' || activeFilter === 'locations') {
      worldData.locations.forEach(location => {
        if (location.name.toLowerCase().includes(term) ||
            location.description?.toLowerCase().includes(term)) {
          results.push({
            type: 'location',
            id: location.id,
            title: location.name,
            subtitle: location.type || 'Local',
            description: location.description || 'Sem descrição',
            icon: MapPin,
            href: '/world-builder'
          });
        }
      });
    }

    // Buscar em lore
    if (activeFilter === 'all' || activeFilter === 'lore') {
      Object.entries(loreData).forEach(([category, items]) => {
        items.forEach(item => {
          if (item.name?.toLowerCase().includes(term) ||
              item.description?.toLowerCase().includes(term)) {
            results.push({
              type: 'lore',
              id: item.id,
              title: item.name || 'Item de Lore',
              subtitle: category,
              description: item.description || 'Sem descrição',
              icon: BookOpen,
              href: '/lore-generator'
            });
          }
        });
      });
    }

    // Buscar em conversas AI
    if (activeFilter === 'all' || activeFilter === 'conversations') {
      aiConversations.forEach(conversation => {
        if (conversation.title?.toLowerCase().includes(term) ||
            conversation.messages?.some(msg => 
              msg.content.toLowerCase().includes(term)
            )) {
          results.push({
            type: 'conversation',
            id: conversation.id,
            title: conversation.title || 'Conversa AI',
            subtitle: `${conversation.messages?.length || 0} mensagens`,
            description: conversation.messages?.[0]?.content?.substring(0, 100) || 'Sem conteúdo',
            icon: MessageSquare,
            href: '/ai-assistant'
          });
        }
      });
    }

    setSearchResults(results.slice(0, 10)); // Limitar a 10 resultados
  }, [searchTerm, activeFilter, projects, characters, worldData, loreData, aiConversations]);

  const handleResultClick = (result) => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'project': return FileText;
      case 'character': return Users;
      case 'location': return MapPin;
      case 'lore': return BookOpen;
      case 'conversation': return MessageSquare;
      default: return Search;
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-2 sm:px-3 py-2 bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:block">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-background border border-border rounded">
          Ctrl+K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-4 sm:pt-20 px-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
            {/* Search Header */}
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar em projetos, personagens, locais, lore..."
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm sm:text-base"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-3 sm:px-4 py-2 border-b border-border">
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
                {filters.map(filter => {
                  const FilterIcon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                        activeFilter === filter.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <FilterIcon className="h-3 w-3" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-64 sm:max-h-96">
              {searchTerm && searchResults.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente usar termos diferentes ou verificar a ortografia
                  </p>
                </div>
              ) : searchTerm ? (
                <div className="divide-y divide-border">
                  {searchResults.map((result, index) => {
                    const ResultIcon = result.icon;
                    return (
                      <Link
                        key={`${result.type}-${result.id}-${index}`}
                        to={result.href}
                        onClick={handleResultClick}
                        className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 hover:bg-accent transition-colors"
                      >
                        <div className="p-1.5 sm:p-2 rounded-lg bg-muted flex-shrink-0">
                          <ResultIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate text-sm sm:text-base">
                            {result.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                          <p className="text-xs text-muted-foreground truncate hidden sm:block">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Busca Global</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Encontre rapidamente qualquer conteúdo em sua aplicação
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="text-left">
                      <p className="font-medium text-foreground mb-2">Dicas de busca:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Use Ctrl+K para abrir rapidamente</li>
                        <li>• Filtre por categoria</li>
                        <li>• Busque por nome ou descrição</li>
                      </ul>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground mb-2">Categorias:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Projetos e capítulos</li>
                        <li>• Personagens</li>
                        <li>• Locais e mundo</li>
                        <li>• Lore e história</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-border bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground space-y-2 sm:space-y-0">
                <span>{searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
                  <span className="hidden sm:inline">↑↓ para navegar</span>
                  <span>Enter para selecionar</span>
                  <span>Esc para fechar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
