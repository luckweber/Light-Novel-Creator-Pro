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
  HelpCircle
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
    color: 'yellow'
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
    id: 'assistant', 
    label: 'Assistente IA', 
    icon: Bot, 
    description: 'Converse com a IA para ideias',
    color: 'purple'
  },
  { 
    id: 'settings', 
    label: 'Configurações', 
    icon: Settings, 
    description: 'Ajustes do projeto e da IA',
    color: 'gray'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral dos projetos',
    color: 'teal'
  },
  {
    id: 'editor',
    label: 'Editor',
    icon: FileText,
    description: 'Escreva sua light novel',
    color: 'cyan'
  },
  {
    id: 'themes',
    label: 'Temas',
    icon: Palette,
    description: 'Temas e estilos visuais',
    color: 'pink'
  }
];

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
