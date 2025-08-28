import React, { useState } from 'react';
import {
  BookOpen,
  Sword,
  Heart,
  School,
  Castle,
  Zap,
  Users,
  Map,
  Star,
  Plus,
  X,
  Check,
  Target,
  Brain,
  Search,
  Trophy
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const LightNovelTemplates = ({ onClose, onTemplateApplied }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customization, setCustomization] = useState({});
  const { addProject, setCurrentProject } = useStore();

  const templates = [
    {
      id: 'isekai',
      name: 'Isekai',
      description: 'Reencarnação/transporte para outro mundo',
      icon: Sword,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      features: [
        'Sistema de níveis e habilidades',
        'Mundo de fantasia',
        'Protagonista com conhecimento moderno',
        'Sistema de magia',
        'Rankings e classes'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Novo Mundo',
            description: 'Introdução ao mundo e estabelecimento do protagonista',
            chapters: [
              { title: 'Capítulo 1: A Transição', wordCount: 3000 },
              { title: 'Capítulo 2: Primeiros Passos', wordCount: 3000 },
              { title: 'Capítulo 3: Descobertas', wordCount: 3000 },
              { title: 'Capítulo 4: Primeiro Encontro', wordCount: 3000 },
              { title: 'Capítulo 5: A Jornada Começa', wordCount: 3000 }
            ]
          }
        ],
        worldData: {
          name: 'Mundo de Fantasia',
          genre: 'Isekai/Fantasia',
          techLevel: 'Medieval com magia',
          magicSystems: [
            {
              name: 'Sistema de Magia Elemental',
              description: 'Magia baseada nos elementos naturais',
              rules: ['Cada pessoa tem afinidade com 1-2 elementos', 'Magia consome energia mental']
            }
          ],
          locations: [
            { name: 'Vila Inicial', type: 'vila', description: 'Primeira vila onde o protagonista chega' },
            { name: 'Floresta Misteriosa', type: 'floresta', description: 'Floresta cheia de criaturas mágicas' }
          ]
        },
        characters: [
          {
            name: 'Protagonista',
            role: 'protagonista',
            description: 'Pessoa transportada para outro mundo',
            personality: 'Inteligente, adaptável, com conhecimento moderno',
            abilities: ['Conhecimento moderno', 'Habilidade especial única']
          },
          {
            name: 'Guia Local',
            role: 'mentor',
            description: 'Personagem que ajuda o protagonista',
            personality: 'Sábio, paciente, conhecedor do mundo'
          }
        ]
      }
    },
    {
      id: 'romance-escolar',
      name: 'Romance Escolar',
      description: 'Histórias de amor no ambiente escolar',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      features: [
        'Ambiente escolar japonês',
        'Desenvolvimento de relacionamentos',
        'Clube escolar',
        'Festival cultural',
        'Conflitos emocionais'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: Primeiro Ano',
            description: 'Início da vida escolar e primeiros sentimentos',
            chapters: [
              { title: 'Capítulo 1: Primeiro Dia', wordCount: 2500 },
              { title: 'Capítulo 2: Encontro Casual', wordCount: 2500 },
              { title: 'Capítulo 3: Clube de Literatura', wordCount: 2500 },
              { title: 'Capítulo 4: Primeira Conversa', wordCount: 2500 },
              { title: 'Capítulo 5: Sentimentos Confusos', wordCount: 2500 }
            ]
          }
        ],
        worldData: {
          name: 'Academia Japonesa',
          genre: 'Romance/Escolar',
          techLevel: 'Moderno',
          locations: [
            { name: 'Sala de Aula 2-A', type: 'sala', description: 'Sala principal dos personagens' },
            { name: 'Clube de Literatura', type: 'clube', description: 'Local onde os personagens se reúnem' },
            { name: 'Telhado da Escola', type: 'escola', description: 'Local para conversas privadas' }
          ]
        },
        characters: [
          {
            name: 'Protagonista',
            role: 'protagonista',
            description: 'Estudante comum',
            personality: 'Tímido, honesto, com sentimentos profundos'
          },
          {
            name: 'Interest Romântico',
            role: 'interesse-romantico',
            description: 'Objeto dos sentimentos do protagonista',
            personality: 'Misterioso, atraente, com segredos'
          }
        ]
      }
    },
    {
      id: 'fantasia',
      name: 'Fantasia',
      description: 'Mundo de fantasia com magia e aventuras',
      icon: Castle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      features: [
        'Sistema de magia complexo',
        'Reinos e nobreza',
        'Criaturas mágicas',
        'Missões e aventuras',
        'Conflitos políticos'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Aprendiz',
            description: 'Início da jornada do protagonista',
            chapters: [
              { title: 'Capítulo 1: O Despertar', wordCount: 3500 },
              { title: 'Capítulo 2: Primeira Lição', wordCount: 3500 },
              { title: 'Capítulo 3: A Missão', wordCount: 3500 },
              { title: 'Capítulo 4: O Encontro', wordCount: 3500 },
              { title: 'Capítulo 5: A Escolha', wordCount: 3500 }
            ]
          }
        ],
        worldData: {
          name: 'Reino de Fantasia',
          genre: 'Fantasia/Aventura',
          techLevel: 'Medieval com magia avançada',
          magicSystems: [
            {
              name: 'Magia Arcana',
              description: 'Sistema de magia baseado em runas e elementos',
              rules: ['Magia requer estudo e prática', 'Cada mago tem especialização']
            }
          ],
          locations: [
            { name: 'Torre dos Magos', type: 'torre', description: 'Centro de aprendizado mágico' },
            { name: 'Floresta Encantada', type: 'floresta', description: 'Floresta cheia de criaturas mágicas' }
          ]
        },
        characters: [
          {
            name: 'Aprendiz de Mago',
            role: 'protagonista',
            description: 'Jovem com talento mágico',
            personality: 'Curioso, determinado, com potencial oculto'
          },
          {
            name: 'Mestre Mago',
            role: 'mentor',
            description: 'Professor de magia',
            personality: 'Sábio, rigoroso, com segredos do passado'
          }
        ]
      }
    },
    {
      id: 'acao-aventura',
      name: 'Ação/Aventura',
      description: 'Histórias de ação e aventuras emocionantes',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      features: [
        'Cenas de ação dinâmicas',
        'Missões e objetivos',
        'Aliados e rivais',
        'Progredir em força',
        'Conflitos épicos'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Início da Jornada',
            description: 'Primeiras aventuras e descobertas',
            chapters: [
              { title: 'Capítulo 1: O Chamado', wordCount: 4000 },
              { title: 'Capítulo 2: Primeira Batalha', wordCount: 4000 },
              { title: 'Capítulo 3: Aliados', wordCount: 4000 },
              { title: 'Capítulo 4: O Antagonista', wordCount: 4000 },
              { title: 'Capítulo 5: A Escolha Final', wordCount: 4000 }
            ]
          }
        ],
        worldData: {
          name: 'Mundo de Aventuras',
          genre: 'Ação/Aventura',
          techLevel: 'Variado',
          locations: [
            { name: 'Cidade Portuária', type: 'cidade', description: 'Ponto de partida das aventuras' },
            { name: 'Ruínas Antigas', type: 'ruinas', description: 'Local de tesouros e perigos' }
          ]
        },
        characters: [
          {
            name: 'Aventureiro',
            role: 'protagonista',
            description: 'Herói em busca de aventuras',
            personality: 'Corajoso, determinado, com senso de justiça'
          },
          {
            name: 'Companheiro de Jornada',
            role: 'aliado',
            description: 'Parceiro de aventuras',
            personality: 'Leal, habilidoso, com história própria'
          }
        ]
      }
    },
    {
      id: 'slice-of-life',
      name: 'Slice of Life',
      description: 'Histórias do cotidiano e momentos especiais',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      features: [
        'Vida cotidiana',
        'Relacionamentos',
        'Crescimento pessoal',
        'Momentos especiais',
        'Reflexões sobre a vida'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: Dias Comuns',
            description: 'Histórias do dia a dia',
            chapters: [
              { title: 'Capítulo 1: Manhã Normal', wordCount: 2000 },
              { title: 'Capítulo 2: Encontro Inesperado', wordCount: 2000 },
              { title: 'Capítulo 3: Conversa Casual', wordCount: 2000 },
              { title: 'Capítulo 4: Pequena Mudança', wordCount: 2000 },
              { title: 'Capítulo 5: Reflexão', wordCount: 2000 }
            ]
          }
        ],
        worldData: {
          name: 'Cidade Japonesa',
          genre: 'Slice of Life',
          techLevel: 'Moderno',
          locations: [
            { name: 'Apartamento', type: 'casa', description: 'Casa do protagonista' },
            { name: 'Café Local', type: 'cafe', description: 'Local de encontros' }
          ]
        },
        characters: [
          {
            name: 'Protagonista',
            role: 'protagonista',
            description: 'Pessoa comum vivendo sua vida',
            personality: 'Observador, reflexivo, com pequenos sonhos'
          },
          {
            name: 'Vizinho',
            role: 'amigo',
            description: 'Pessoa que entra na vida do protagonista',
            personality: 'Amigável, misterioso, com histórias para contar'
          }
        ]
      }
    },
           {
         id: 'harem',
         name: 'Harem',
         description: 'Protagonista cercado por múltiplos interesses românticos',
         icon: Users,
         color: 'text-pink-600',
         bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      features: [
        'Múltiplos interesses românticos',
        'Desenvolvimento de relacionamentos',
        'Conflitos emocionais',
        'Comédia romântica',
        'Escolhas difíceis'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Início do Harem',
            description: 'Primeiros encontros e desenvolvimento dos relacionamentos',
            chapters: [
              { title: 'Capítulo 1: A Transferência', wordCount: 3000 },
              { title: 'Capítulo 2: Primeira Garota', wordCount: 3000 },
              { title: 'Capítulo 3: Segunda Garota', wordCount: 3000 },
              { title: 'Capítulo 4: Conflitos', wordCount: 3000 },
              { title: 'Capítulo 5: A Escolha', wordCount: 3000 }
            ]
          }
        ],
        worldData: {
          name: 'Academia Japonesa',
          genre: 'Harem/Romance',
          techLevel: 'Moderno',
          locations: [
            { name: 'Sala de Aula', type: 'sala', description: 'Local principal dos encontros' },
            { name: 'Clube de Literatura', type: 'clube', description: 'Local de atividades' },
            { name: 'Café da Escola', type: 'cafe', description: 'Local para conversas' }
          ]
        },
        characters: [
          {
            name: 'Protagonista',
            role: 'protagonista',
            description: 'Estudante transferido',
            personality: 'Gentil, confuso, com dificuldade em escolher'
          },
          {
            name: 'Tsundere',
            role: 'interesse-romantico',
            description: 'Primeira garota do harem',
            personality: 'Orgulhosa, mas carinhosa por dentro'
          },
          {
            name: 'Yandere',
            role: 'interesse-romantico',
            description: 'Segunda garota do harem',
            personality: 'Doce, mas possessiva e perigosa'
          },
          {
            name: 'Kuudere',
            role: 'interesse-romantico',
            description: 'Terceira garota do harem',
            personality: 'Fria e distante, mas com sentimentos profundos'
          }
        ]
      }
    },
    {
      id: 'mecha',
      name: 'Mecha',
      description: 'Robôs gigantes e batalhas espaciais',
      icon: Target,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      features: [
        'Robôs gigantes (Mechas)',
        'Batalhas espaciais',
        'Tecnologia avançada',
        'Conflitos militares',
        'Pilotos especiais'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Piloto',
            description: 'Descoberta do talento e primeiras batalhas',
            chapters: [
              { title: 'Capítulo 1: O Despertar', wordCount: 4000 },
              { title: 'Capítulo 2: Primeira Batalha', wordCount: 4000 },
              { title: 'Capítulo 3: O Mecha', wordCount: 4000 },
              { title: 'Capítulo 4: Aliados', wordCount: 4000 },
              { title: 'Capítulo 5: A Missão', wordCount: 4000 }
            ]
          }
        ],
        worldData: {
          name: 'Colônia Espacial',
          genre: 'Mecha/Ação',
          techLevel: 'Futurista',
          technologies: [
            {
              name: 'Sistema de Mecha',
              description: 'Robôs gigantes controlados por pilotos',
              rules: ['Pilotos especiais necessários', 'Sincronização neural']
            }
          ],
          locations: [
            { name: 'Base Militar', type: 'base', description: 'Centro de operações' },
            { name: 'Hangar de Mechas', type: 'hangar', description: 'Local dos robôs' }
          ]
        },
        characters: [
          {
            name: 'Piloto de Mecha',
            role: 'protagonista',
            description: 'Jovem com talento natural',
            personality: 'Determinado, corajoso, com senso de justiça'
          },
          {
            name: 'Comandante',
            role: 'mentor',
            description: 'Líder militar',
            personality: 'Rigoroso, experiente, com segredos'
          }
        ]
      }
    },
    {
      id: 'misterio',
      name: 'Mistério/Suspense',
      description: 'Histórias de investigação e suspense',
      icon: Search,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      features: [
        'Investigação de crimes',
        'Pistas e enigmas',
        'Suspense psicológico',
        'Revelações surpreendentes',
        'Detetives e investigadores'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Primeiro Caso',
            description: 'Início da carreira de investigação',
            chapters: [
              { title: 'Capítulo 1: O Crime', wordCount: 3500 },
              { title: 'Capítulo 2: Primeiras Pistas', wordCount: 3500 },
              { title: 'Capítulo 3: A Investigação', wordCount: 3500 },
              { title: 'Capítulo 4: Suspeitos', wordCount: 3500 },
              { title: 'Capítulo 5: A Revelação', wordCount: 3500 }
            ]
          }
        ],
        worldData: {
          name: 'Cidade Metropolitana',
          genre: 'Mistério/Suspense',
          techLevel: 'Moderno',
          locations: [
            { name: 'Delegacia', type: 'policia', description: 'Centro de investigações' },
            { name: 'Cena do Crime', type: 'local', description: 'Local do primeiro caso' }
          ]
        },
        characters: [
          {
            name: 'Detetive',
            role: 'protagonista',
            description: 'Investigador talentoso',
            personality: 'Observador, inteligente, com instinto apurado'
          },
          {
            name: 'Parceiro',
            role: 'aliado',
            description: 'Companheiro de investigação',
            personality: 'Leal, experiente, com métodos diferentes'
          }
        ]
      }
    },
    {
      id: 'esporte',
      name: 'Esporte',
      description: 'Histórias de competição e superação',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      features: [
        'Competições esportivas',
        'Treinamento e superação',
        'Rivalidades',
        'Trabalho em equipe',
        'Vitórias e derrotas'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Início',
            description: 'Primeiros passos no esporte',
            chapters: [
              { title: 'Capítulo 1: O Despertar', wordCount: 3000 },
              { title: 'Capítulo 2: Primeiro Treino', wordCount: 3000 },
              { title: 'Capítulo 3: A Equipe', wordCount: 3000 },
              { title: 'Capítulo 4: Primeira Competição', wordCount: 3000 },
              { title: 'Capítulo 5: A Derrota', wordCount: 3000 }
            ]
          }
        ],
        worldData: {
          name: 'Academia Esportiva',
          genre: 'Esporte',
          techLevel: 'Moderno',
          locations: [
            { name: 'Ginásio', type: 'esporte', description: 'Local de treinos' },
            { name: 'Quadra', type: 'esporte', description: 'Local de competições' }
          ]
        },
        characters: [
          {
            name: 'Atleta',
            role: 'protagonista',
            description: 'Jovem com talento natural',
            personality: 'Determinado, competitivo, com espírito esportivo'
          },
          {
            name: 'Treinador',
            role: 'mentor',
            description: 'Guia do protagonista',
            personality: 'Experiente, rigoroso, com métodos únicos'
          }
        ]
      }
    },
    {
      id: 'comedia',
      name: 'Comédia',
      description: 'Histórias engraçadas e situações hilárias',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      features: [
        'Situações engraçadas',
        'Personagens excêntricos',
        'Gags e piadas',
        'Comédia romântica',
        'Momentos hilários'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: O Caos Começa',
            description: 'Início das situações engraçadas',
            chapters: [
              { title: 'Capítulo 1: O Encontro', wordCount: 2500 },
              { title: 'Capítulo 2: Primeira Confusão', wordCount: 2500 },
              { title: 'Capítulo 3: O Mal-entendido', wordCount: 2500 },
              { title: 'Capítulo 4: A Trapalhada', wordCount: 2500 },
              { title: 'Capítulo 5: A Resolução', wordCount: 2500 }
            ]
          }
        ],
        worldData: {
          name: 'Escola Comum',
          genre: 'Comédia',
          techLevel: 'Moderno',
          locations: [
            { name: 'Sala de Aula', type: 'escola', description: 'Local das confusões' },
            { name: 'Corredor', type: 'escola', description: 'Cenário de gags' }
          ]
        },
        characters: [
          {
            name: 'Protagonista',
            role: 'protagonista',
            description: 'Pessoa normal em situações engraçadas',
            personality: 'Desastrado, mas bem-intencionado'
          },
          {
            name: 'Amigo Trapalhão',
            role: 'amigo',
            description: 'Fonte de confusões',
            personality: 'Engraçado, desastrado, leal'
          }
        ]
      }
    },
    {
      id: 'psicologico',
      name: 'Psicológico',
      description: 'Histórias com foco em psicologia e mente humana',
      icon: Brain,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      features: [
        'Análise psicológica',
        'Conflitos internos',
        'Realidade vs Ilusão',
        'Traumas e superação',
        'Mente humana'
      ],
      structure: {
        volumes: [
          {
            title: 'Volume 1: A Mente',
            description: 'Exploração da psicologia humana',
            chapters: [
              { title: 'Capítulo 1: O Despertar', wordCount: 4000 },
              { title: 'Capítulo 2: Memórias', wordCount: 4000 },
              { title: 'Capítulo 3: O Trauma', wordCount: 4000 },
              { title: 'Capítulo 4: A Terapia', wordCount: 4000 },
              { title: 'Capítulo 5: A Cura', wordCount: 4000 }
            ]
          }
        ],
        worldData: {
          name: 'Mente Humana',
          genre: 'Psicológico',
          techLevel: 'Moderno',
          locations: [
            { name: 'Consultório', type: 'terapia', description: 'Local de terapia' },
            { name: 'Memórias', type: 'psicologico', description: 'Mundo interior' }
          ]
        },
        characters: [
          {
            name: 'Paciente',
            role: 'protagonista',
            description: 'Pessoa em busca de cura',
            personality: 'Complexo, traumatizado, em busca de respostas'
          },
          {
            name: 'Terapeuta',
            role: 'mentor',
            description: 'Guia psicológico',
            personality: 'Sábio, paciente, com métodos únicos'
          }
        ]
      }
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomization({
      projectName: '',
      authorName: '',
      description: '',
      targetWordCount: template.structure.volumes[0].chapters[0].wordCount
    });
  };

  const handleApplyTemplate = () => {
    if (!customization.projectName.trim()) {
      toast.error('Por favor, insira um nome para o projeto');
      return;
    }

    try {
      // Criar projeto com template
      const project = {
        name: customization.projectName,
        genre: selectedTemplate.structure.worldData.genre,
        description: customization.description || selectedTemplate.description,
        author: customization.authorName || 'Autor',
        createdAt: new Date().toISOString(),
        template: selectedTemplate.id
      };

      // Adicionar projeto
      addProject(project);
      setCurrentProject(project);

      // Aplicar estrutura do template
      const store = useStore.getState();
      
      // Definir estrutura do projeto
      store.setState({
        projectStructure: selectedTemplate.structure,
        worldData: selectedTemplate.structure.worldData,
        characters: selectedTemplate.structure.characters
      });

      toast.success(`Template ${selectedTemplate.name} aplicado com sucesso!`);
      onTemplateApplied && onTemplateApplied(project);
      onClose();
    } catch (error) {
      toast.error('Erro ao aplicar template: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Templates de Light Novel</h2>
            <p className="text-sm text-muted-foreground">Escolha um template específico para seu gênero</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Lista de Templates */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-border">
            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => {
                const TemplateIcon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${template.bgColor}`}>
                        <TemplateIcon className={`h-6 w-6 ${template.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-foreground mb-2">Características:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {template.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalhes do Template */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Informações do Template */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{selectedTemplate.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Estrutura Incluída:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• {selectedTemplate.structure.volumes.length} volume(s)</li>
                        <li>• {selectedTemplate.structure.volumes[0].chapters.length} capítulos</li>
                        <li>• {selectedTemplate.structure.characters.length} personagens</li>
                        <li>• {selectedTemplate.structure.worldData.locations.length} locais</li>
                        {selectedTemplate.structure.worldData.magicSystems && (
                          <li>• {selectedTemplate.structure.worldData.magicSystems.length} sistema(s) de magia</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Características:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedTemplate.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personalização */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Personalizar Projeto:</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Nome do Projeto *
                    </label>
                    <input
                      type="text"
                      value={customization.projectName}
                      onChange={(e) => setCustomization({...customization, projectName: e.target.value})}
                      placeholder="Ex: Minha Light Novel"
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Nome do Autor
                    </label>
                    <input
                      type="text"
                      value={customization.authorName}
                      onChange={(e) => setCustomization({...customization, authorName: e.target.value})}
                      placeholder="Seu nome"
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={customization.description}
                      onChange={(e) => setCustomization({...customization, description: e.target.value})}
                      placeholder="Breve descrição da sua história..."
                      rows="3"
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>

                {/* Botão Aplicar */}
                <button
                  onClick={handleApplyTemplate}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Aplicar Template e Criar Projeto
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Selecione um template para ver os detalhes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightNovelTemplates;
