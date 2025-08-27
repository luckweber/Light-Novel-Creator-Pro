import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  User,
  Crown,
  Heart,
  Star,
  X,
  Search,
  BookOpen,
  Info
} from 'lucide-react';

const JapaneseHonorifics = ({ onInsert, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInfo, setShowInfo] = useState(false);
  const searchRef = useRef(null);

  const honorifics = {
    basic: [
      { suffix: '-san', usage: 'Formal, respeitoso', examples: ['Tanaka-san', 'Sensei-san'], description: 'Honorífico mais comum, usado para mostrar respeito' },
      { suffix: '-kun', usage: 'Masculino, informal', examples: ['Yamada-kun', 'Taro-kun'], description: 'Usado para meninos e homens jovens, ou colegas próximos' },
      { suffix: '-chan', usage: 'Feminino, carinhoso', examples: ['Hanako-chan', 'Mari-chan'], description: 'Usado para meninas, crianças ou pessoas próximas' },
      { suffix: '-sama', usage: 'Muito formal, respeitoso', examples: ['Ojousama', 'Goshujin-sama'], description: 'Honorífico muito formal, usado para pessoas de alto status' },
      { suffix: '-senpai', usage: 'Colega mais velho', examples: ['Sakura-senpai', 'Takashi-senpai'], description: 'Usado para colegas mais velhos na escola ou trabalho' },
      { suffix: '-kouhai', usage: 'Colega mais novo', examples: ['Yuki-kouhai', 'Ken-kouhai'], description: 'Usado para colegas mais novos' }
    ],
    family: [
      { suffix: '-otou-san', usage: 'Pai', examples: ['Otou-san'], description: 'Forma respeitosa de se referir ao pai' },
      { suffix: '-okaa-san', usage: 'Mãe', examples: ['Okaa-san'], description: 'Forma respeitosa de se referir à mãe' },
      { suffix: '-onii-san', usage: 'Irmão mais velho', examples: ['Onii-san'], description: 'Forma respeitosa de se referir ao irmão mais velho' },
      { suffix: '-onee-san', usage: 'Irmã mais velha', examples: ['Onee-san'], description: 'Forma respeitosa de se referir à irmã mais velha' },
      { suffix: '-ojii-san', usage: 'Avô', examples: ['Ojii-san'], description: 'Forma respeitosa de se referir ao avô' },
      { suffix: '-obaa-san', usage: 'Avó', examples: ['Obaa-san'], description: 'Forma respeitosa de se referir à avó' }
    ],
    professional: [
      { suffix: '-sensei', usage: 'Professor/Mestre', examples: ['Tanaka-sensei', 'Suzuki-sensei'], description: 'Usado para professores, médicos, artistas' },
      { suffix: '-shachou', usage: 'Presidente', examples: ['Yamamoto-shachou'], description: 'Usado para presidentes de empresa' },
      { suffix: '-buchou', usage: 'Chefe de departamento', examples: ['Sato-buchou'], description: 'Usado para chefes de departamento' },
      { suffix: '-kaichou', usage: 'Presidente (clube)', examples: ['Akira-kaichou'], description: 'Usado para presidentes de clubes escolares' },
      { suffix: '-taichou', usage: 'Capitão', examples: ['Kazuki-taichou'], description: 'Usado para capitães de equipes' }
    ],
    nobility: [
      { suffix: '-dono', usage: 'Nobreza', examples: ['Kazuki-dono', 'Hime-dono'], description: 'Honorífico usado para nobres' },
      { suffix: '-hime', usage: 'Princesa', examples: ['Sakura-hime', 'Yuki-hime'], description: 'Usado para princesas ou mulheres nobres' },
      { suffix: '-ouji', usage: 'Príncipe', examples: ['Takashi-ouji', 'Ken-ouji'], description: 'Usado para príncipes' },
      { suffix: '-sama', usage: 'Muito respeitoso', examples: ['Ojousama', 'Goshujin-sama'], description: 'Honorífico muito formal para pessoas de alto status' }
    ],
    special: [
      { suffix: '-senpai', usage: 'Colega mais velho', examples: ['Akira-senpai'], description: 'Usado para colegas mais velhos' },
      { suffix: '-kouhai', usage: 'Colega mais novo', examples: ['Yuki-kouhai'], description: 'Usado para colegas mais novos' },
      { suffix: '-sensei', usage: 'Professor/Mestre', examples: ['Tanaka-sensei'], description: 'Usado para professores e mestres' },
      { suffix: '-chan', usage: 'Carinhoso', examples: ['Hanako-chan'], description: 'Usado para pessoas próximas e carinhosas' }
    ]
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: Star },
    { id: 'basic', name: 'Básicos', icon: User },
    { id: 'family', name: 'Família', icon: Heart },
    { id: 'professional', name: 'Profissional', icon: Crown },
    { id: 'nobility', name: 'Nobreza', icon: Crown },
    { id: 'special', name: 'Especiais', icon: Star }
  ];

  const getFilteredHonorifics = () => {
    let filtered = [];
    
    if (selectedCategory === 'all') {
      Object.values(honorifics).forEach(category => {
        filtered = [...filtered, ...category];
      });
    } else {
      filtered = honorifics[selectedCategory] || [];
    }

    if (searchTerm) {
      filtered = filtered.filter(honorific => 
        honorific.suffix.toLowerCase().includes(searchTerm.toLowerCase()) ||
        honorific.usage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        honorific.examples.some(example => example.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleInsert = (honorific) => {
    onInsert(honorific.suffix);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const filtered = getFilteredHonorifics();
      if (filtered.length > 0) {
        handleInsert(filtered[0]);
      }
    }
  };

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const filteredHonorifics = getFilteredHonorifics();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Honoríficos Japoneses</h2>
              <p className="text-sm text-muted-foreground">Selecione um honorífico para inserir</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
              title="Informações"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar com categorias */}
          <div className="w-64 bg-muted border-r border-border p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Informações */}
            {showInfo && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Como usar:</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Clique em um honorífico para inserir</li>
                  <li>• Use a busca para encontrar rapidamente</li>
                  <li>• Pressione Enter para inserir o primeiro resultado</li>
                  <li>• Combine com nomes: "Tanaka-san"</li>
                </ul>
              </div>
            )}
          </div>

          {/* Lista de honoríficos */}
          <div className="flex-1 p-6">
            {/* Barra de busca */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Buscar honoríficos..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredHonorifics.length > 0 ? (
                filteredHonorifics.map((honorific, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleInsert(honorific)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg font-semibold text-primary">{honorific.suffix}</span>
                          <span className="text-sm text-muted-foreground">{honorific.usage}</span>
                        </div>
                        <p className="text-sm text-foreground mb-2">{honorific.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {honorific.examples.map((example, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsert(honorific);
                        }}
                        className="ml-4 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <BookOpen className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum honorífico encontrado</p>
                </div>
              )}
            </div>

            {/* Atalhos de teclado */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pressione Enter para inserir o primeiro resultado</span>
                <span>Esc para fechar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JapaneseHonorifics;
