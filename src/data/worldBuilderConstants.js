import {
  Globe,
  Map as MapIcon,
  Users,
  Sparkles,
  Book,
  Bot,
  Settings,
  LayoutDashboard,
  FileText,
  Palette,
  Shield,
  MessageSquare,
  GitMerge,
  HelpCircle,
  Share2,
  BarChart3,
  Calendar,
  Clock,
  Target,
  Layers,
  Navigation,
  Gem,
  Heart,
  Star,
  Crown,
  Coins,
  Zap,
  Brain
} from 'lucide-react';

export const mainTabs = [
  { 
    id: 'overview', 
    label: 'Visão Geral', 
    icon: Globe, 
    description: 'Resumo do mundo criado',
    color: 'blue'
  },
  { 
    id: 'geography', 
    label: 'Geografia', 
    icon: MapIcon, 
    description: 'Mapa, locais, regiões e clima',
    color: 'green'
  },
  { 
    id: 'cultures', 
    label: 'Culturas', 
    icon: Users, 
    description: 'Povos, idiomas e tradições',
    color: 'purple'
  },
  { 
    id: 'systems', 
    label: 'Sistemas', 
    icon: Sparkles, 
    description: 'Magia, tecnologia e política',
    color: 'orange'
  },
  { 
    id: 'history', 
    label: 'História', 
    icon: Book, 
    description: 'Linha do tempo, eventos e eras',
    color: 'red'
  },
  { 
    id: 'relationships', 
    label: 'Relações', 
    icon: Share2, 
    description: 'Mapa de conexões entre elementos',
    color: 'indigo'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    description: 'Estatísticas e insights do mundo',
    color: 'teal'
  }
];

// Submenus organizados por categoria
export const subMenus = {
  geography: {
    label: 'Geografia',
    icon: MapIcon,
    color: 'green',
    items: [
      { id: 'locations', label: 'Locais', icon: Target, description: 'Cidades, vilas, pontos de interesse' },
      { id: 'regions', label: 'Regiões', icon: Layers, description: 'Áreas geográficas e territórios' },
      { id: 'landmarks', label: 'Marcos', icon: Navigation, description: 'Pontos de referência importantes' },
      { id: 'resources', label: 'Recursos', icon: Gem, description: 'Materiais e recursos naturais' }
    ]
  },
  cultures: {
    label: 'Culturas',
    icon: Users,
    color: 'purple',
    items: [
      { id: 'peoples', label: 'Povos', icon: Users, description: 'Raças, etnias e grupos sociais' },
      { id: 'languages', label: 'Idiomas', icon: MessageSquare, description: 'Línguas e dialetos' },
      { id: 'religions', label: 'Religiões', icon: Star, description: 'Crenças e sistemas religiosos' },
      { id: 'traditions', label: 'Tradições', icon: Heart, description: 'Costumes e práticas culturais' }
    ]
  },
  systems: {
    label: 'Sistemas',
    icon: Sparkles,
    color: 'orange',
    items: [
      { id: 'magicSystems', label: 'Magia', icon: Sparkles, description: 'Sistemas mágicos e poderes' },
      { id: 'technologies', label: 'Tecnologia', icon: Zap, description: 'Invenções e avanços tecnológicos' },
      { id: 'governments', label: 'Política', icon: Crown, description: 'Sistemas de governo e poder' },
      { id: 'economies', label: 'Economia', icon: Coins, description: 'Sistemas econômicos e comércio' }
    ]
  },
  history: {
    label: 'História',
    icon: Book,
    color: 'red',
    items: [
      { id: 'events', label: 'Eventos', icon: Calendar, description: 'Acontecimentos históricos importantes' },
      { id: 'eras', label: 'Eras', icon: Clock, description: 'Períodos históricos e épocas' }
    ]
  },
  analytics: {
    label: 'Analytics',
    icon: BarChart3,
    color: 'teal',
    items: [
      { id: 'statistics', label: 'Estatísticas', icon: BarChart3, description: 'Dados e métricas do mundo' },
      { id: 'insights', label: 'Insights', icon: Brain, description: 'Análises e descobertas' },
      { id: 'reports', label: 'Relatórios', icon: FileText, description: 'Relatórios detalhados' }
    ]
  }
};

export const locationTypes = [
  { 
    value: 'city', 
    label: 'Cidade',
    description: 'Grande assentamento urbano com governo próprio.',
    icon: 'Building'
  },
  { 
    value: 'town', 
    label: 'Vila',
    description: 'Assentamento menor que uma cidade, geralmente focado em comércio local.',
    icon: 'Home'
  },
  { 
    value: 'village', 
    label: 'Aldeia',
    description: 'Pequeno agrupamento de casas em uma área rural.',
    icon: 'Tent'
  },
  { 
    value: 'capital', 
    label: 'Capital',
    description: 'Centro administrativo de uma nação ou império.',
    icon: 'Crown'
  },
  { 
    value: 'fortress', 
    label: 'Fortaleza',
    description: 'Estrutura militar fortificada para defesa.',
    icon: 'Castle'
  },
  { 
    value: 'ruins', 
    label: 'Ruínas',
    description: 'Restos de uma estrutura ou cidade antiga.',
    icon: 'Landmark'
  },
  { 
    value: 'dungeon', 
    label: 'Masmorra',
    description: 'Local subterrâneo perigoso, cheio de monstros e tesouros.',
    icon: 'Key'
  },
  { 
    value: 'forest', 
    label: 'Floresta',
    description: 'Grande área coberta por árvores e vegetação densa.',
    icon: 'Trees'
  },
  { 
    value: 'mountain', 
    label: 'Montanha',
    description: 'Grande elevação natural da superfície terrestre.',
    icon: 'Mountain'
  },
  { 
    value: 'river', 
    label: 'Rio',
    description: 'Curso de água natural que flui para um oceano, lago ou outro rio.',
    icon: 'Waves'
  },
  { 
    value: 'ocean', 
    label: 'Oceano',
    description: 'Vasta extensão de água salgada que cobre a maior parte da Terra.',
    icon: 'Sailboat'
  },
  { 
    value: 'other', 
    label: 'Outro',
    description: 'Qualquer outro tipo de local não listado acima.',
    icon: 'MapPin'
  }
];

export const magicSystemTypes = [
  { value: 'elemental', label: 'Elemental' },
  { value: 'arcane', label: 'Arcana' },
  { value: 'divine', label: 'Divina' },
  { value: 'psionic', label: 'Psiônica' },
  { value: 'nature', label: 'Natureza' },
  { value: 'necromancy', label: 'Necromancia' },
  { value: 'illusion', label: 'Ilusão' },
  { value: 'summoning', label: 'Invocação' },
  { value: 'alchemy', label: 'Alquimia' },
  { value: 'other', label: 'Outro' }
];

export const traditionTypes = [
  { value: 'festival', label: 'Festival' },
  { value: 'ritual', label: 'Ritual' },
  { value: 'ceremony', label: 'Cerimônia' },
  { value: 'custom', label: 'Costume' },
  { value: 'celebration', label: 'Celebração' },
  { value: 'rite', label: 'Rito de Passagem' },
  { value: 'tradition', label: 'Tradição Familiar' },
  { value: 'observance', label: 'Observância Religiosa' }
];

export const landmarkTypes = [
  { value: 'natural', label: 'Natural' },
  { value: 'ruins', label: 'Ruínas' },
  { value: 'monument', label: 'Monumento' },
  { value: 'structure', label: 'Estrutura' },
  { value: 'magical', label: 'Mágico' },
  { value: 'religious', label: 'Religioso' },
  { value: 'historical', label: 'Histórico' },
  { value: 'mysterious', label: 'Misterioso' }
];

export const resourceTypes = [
  { value: 'mineral', label: 'Mineral' },
  { value: 'vegetal', label: 'Vegetal' },
  { value: 'animal', label: 'Animal' },
  { value: 'magical', label: 'Mágico' },
  { value: 'energy', label: 'Energia' },
  { value: 'liquid', label: 'Líquido' },
  { value: 'gas', label: 'Gasoso' },
  { value: 'artifact', label: 'Artefato' }
];

export const rarityLevels = [
  { value: 'comum', label: 'Comum' },
  { value: 'incomum', label: 'Incomum' },
  { value: 'raro', label: 'Raro' },
  { value: 'muito_raro', label: 'Muito Raro' },
  { value: 'lendario', label: 'Lendário' },
  { value: 'unico', label: 'Único' }
];

export const governmentTypes = [
  { value: 'monarchy', label: 'Monarquia' },
  { value: 'republic', label: 'República' },
  { value: 'teocracy', label: 'Teocracia' },
  { value: 'democracy', label: 'Democracia' },
  { value: 'dictatorship', label: 'Ditadura' },
  { value: 'federation', label: 'Federação' },
  { value: 'confederation', label: 'Confederação' },
  { value: 'communism', label: 'Comunismo' }
];
