import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  Zap,
  Building,
  TreePine,
  Sparkles,
  Download,
  Upload,
  Search,
  Layers,
  Clock,
  Star,
  Eye,
  EyeOff,
  Copy,
  Share,
  Gem,
  Crown,
  Sun,
  Map,
  Navigation,
  Grid,
  List,
  BookOpen,
  Heart,
  Coins,
  Calendar,
  Book,
  FileText,
  BarChart3,
  Share2
} from 'lucide-react';
import useStore from '../store/useStore';
import { AIService, getBestModelForTask } from '../utils/aiProviders';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  mainTabs, 
  locationTypes,
  subMenus
} from '../data/worldBuilderConstants';
import EconomyFormModal from '../components/world_builder/EconomyFormModal';
import LocationFormModal from '../components/world_builder/LocationFormModal';
import PeopleFormModal from '../components/world_builder/PeopleFormModal';
import ReligionFormModal from '../components/world_builder/ReligionFormModal';
import RegionFormModal from '../components/world_builder/RegionFormModal';
import LandmarkFormModal from '../components/world_builder/LandmarkFormModal';
import EventFormModal from '../components/world_builder/EventFormModal';
import MagicSystemFormModal from '../components/world_builder/MagicSystemFormModal';
import LanguageFormModal from '../components/world_builder/LanguageFormModal';
import TraditionFormModal from '../components/world_builder/TraditionFormModal';
import ResourceFormModal from '../components/world_builder/ResourceFormModal';
import TechnologyFormModal from '../components/world_builder/TechnologyFormModal';
import GovernmentFormModal from '../components/world_builder/GovernmentFormModal';
import SideMenu from '../components/world_builder/SideMenu';

const WorldBuilder = () => {
  const { 
    worldData, 
    updateWorldData, 
    addLocation,
    settings,
    characters,
    addWorldItem,
    updateWorldItem,
    deleteWorldItem
  } = useStore();

  // Estados principais
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [formType, setFormType] = useState(null); // 'location', 'people', etc.
  const [editingItem, setEditingItem] = useState(null);
  
  // Estados de filtro e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Estados de IA e geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProvider, setAiProvider] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [batchGeneration, setBatchGeneration] = useState(false);
  
  // Estados de interface
  const [showStats, setShowStats] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  // Função para obter subabas dinamicamente
  const getSubTabs = useCallback((tabId) => {
    const subMenu = subMenus[tabId];
    if (!subMenu) return [];
    
    return subMenu.items.map(item => ({
      ...item,
      count: worldData?.[item.id]?.length || 0
    }));
  }, [worldData]);

  // Função para definir a primeira subaba automaticamente
  const setActiveTabWithSubTab = useCallback((tabId) => {
    setActiveTab(tabId);
    const subTabs = getSubTabs(tabId);
    if (subTabs.length > 0 && !subTabs.find(tab => tab.id === activeSubTab)) {
      setActiveSubTab(subTabs[0].id);
    }
  }, [getSubTabs, activeSubTab]);

  // Inicialização do provedor de IA
  useEffect(() => {
    const availableProviders = Object.keys(settings?.aiProviders || {})
      .filter(key => settings.aiProviders[key]?.enabled && settings.aiProviders[key]?.apiKey);
    
    if (availableProviders.length > 0) {
      setAiProvider(availableProviders[0]);
    }
  }, [settings]);

  // Função para obter serviço de IA
  const getAIService = useCallback(() => {
    if (!aiProvider || !settings?.aiProviders?.[aiProvider]) {
      throw new Error('Nenhum provedor de IA configurado');
    }

    const providerSettings = settings.aiProviders[aiProvider];
    return new AIService(aiProvider, providerSettings.apiKey, {
      model: providerSettings.defaultModel,
      temperature: providerSettings.temperature,
      maxTokens: providerSettings.maxTokens
    });
  }, [aiProvider, settings]);

  // Função para gerar conteúdo com IA
  const generateWithAI = useCallback(async (type, prompt, context = {}) => {
    if (!aiProvider) {
      toast.error('Configure um provedor de IA nas configurações');
      return null;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const service = getAIService();
      const model = getBestModelForTask(aiProvider, 'creative_writing');
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Construir prompt contextual
      let contextualPrompt = prompt;
      
      if (context.worldName) {
        contextualPrompt = `Para o mundo "${context.worldName}":\n\n${prompt}`;
      }

      if (context.existingElements?.length > 0) {
        contextualPrompt += `\n\nElementos existentes para referência:\n${context.existingElements.map(el => `- ${el.name}: ${el.description}`).join('\n')}`;
      }

      if (context.characters?.length > 0) {
        contextualPrompt += `\n\nPersonagens relacionados:\n${context.characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}`;
      }

      const result = await service.generateText(contextualPrompt, { model });
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setGenerationProgress(0);
        setIsGenerating(false);
      }, 500);

      return result;
    } catch (error) {
      setIsGenerating(false);
      setGenerationProgress(0);
      console.error('Erro na geração:', error);
      toast.error(`Erro ao gerar conteúdo: ${error.message}`);
      return null;
    }
  }, [aiProvider, getAIService]);

  // Função para limpar e validar resposta da IA
  const cleanAIResponse = useCallback((response) => {
    if (!response) return null;
    
    let cleaned = response.trim();
    
    // Remover marcadores de código
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1]?.split('```')[0] || cleaned;
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1] || cleaned;
    }
    
    // Remover possíveis prefixos ou sufixos de texto
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }
    
    // Limpar espaços extras e quebras de linha
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }, []);

  // Função para gerar local com IA
  const generateLocation = useCallback(async (type = 'random') => {
    const prompts = {
      random: `Crie um local único e interessante para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome criativo e evocativo
- Tipo de local (cidade, floresta, castelo, etc.)
- Descrição visual detalhada
- História e significado cultural
- Habitantes típicos
- Pontos de interesse importantes
- Atmosfera e sensações únicas

Formato exato:
{
  "name": "Nome do Local",
  "type": "tipo",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,

      city: `Crie uma cidade fascinante para uma light novel com arquitetura única, distritos interessantes, e uma rica vida urbana.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings

Formato exato:
{
  "name": "Nome da Cidade",
  "type": "cidade",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,
      
      wilderness: `Crie uma área selvagem misteriosa com paisagens únicas, criaturas interessantes e segredos ocultos.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings

Formato exato:
{
  "name": "Nome da Área Selvagem",
  "type": "selvagem",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,
      
      mystical: `Crie um local mágico com propriedades sobrenaturais, energia mística e fenômenos inexplicáveis.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings

Formato exato:
{
  "name": "Nome do Local Mágico",
  "type": "mágico",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`
    };

    const context = {
      worldName: worldData?.name || 'Mundo da Light Novel',
      existingElements: worldData?.locations || [],
      characters: characters?.slice(0, 3) || []
    };

    const result = await generateWithAI('location', prompts[type] || prompts.random, context);
    
    if (result) {
      try {
        // Limpar a resposta da IA
        const cleanResult = cleanAIResponse(result);
        
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        
        // Tentar parsear como JSON
        const locationData = JSON.parse(cleanResult);
        
        console.log('Local gerado:', locationData);
        
        return {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          generatedBy: aiProvider,
          ...locationData
        };
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        
        // Fallback: tentar extrair informações usando regex
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        
        if (nameMatch && descriptionMatch) {
          return {
            id: Date.now(),
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : (type === 'random' ? 'city' : type),
            description: descriptionMatch[1],
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
        }
        
        // Último fallback: usar a resposta como descrição
        return {
          id: Date.now(),
          name: `Local Gerado ${Date.now()}`,
          type: type === 'random' ? 'city' : type,
          description: result,
          createdAt: new Date().toISOString(),
          generatedBy: aiProvider
        };
      }
    }
    
    return null;
  }, [generateWithAI, cleanAIResponse, worldData, characters, aiProvider]);

  // Função para gerar povo com IA (conectada aos botões)
  const generatePeople = useCallback(async () => {
    const prompt = `Crie um povo ou raça para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome
- Classificação (humano, elfo, etc.)
- Descrição física e cultural
- Sociedade e estrutura política
- Tradições e costumes

Formato exato:
{
  "name": "Nome",
  "classification": "Classificação",
  "description": "Descrição",
  "society": "Sociedade",
  "traditions": "Tradições",
  "appearance": "Aparência"
}`;

    const context = {
      worldName: worldData?.name,
      existingElements: worldData?.peoples || []
    };
    
    const result = await generateWithAI('people', prompt, context);

    if (result) {
      try {
        // Limpar a resposta da IA
        const cleanResult = cleanAIResponse(result);
        
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        
        // Tentar parsear como JSON
        const peopleData = JSON.parse(cleanResult);
        
        console.log('Povo gerado:', peopleData);
        
        addWorldItem('peoples', peopleData);
        toast.success(`Povo "${peopleData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        
        // Fallback: tentar extrair informações usando regex
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const classificationMatch = result.match(/"classification":\s*"([^"]+)"/);
        
        if (nameMatch && descriptionMatch) {
          const peopleData = {
            id: Date.now(),
            name: nameMatch[1],
            classification: classificationMatch ? classificationMatch[1] : 'Desconhecido',
            description: descriptionMatch[1],
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          
          addWorldItem('peoples', peopleData);
          toast.success(`Povo "${peopleData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar evento com IA
  const generateEvent = useCallback(async () => {
    const prompt = `Crie um evento histórico para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do evento
- Ano aproximado
- Tipo (político, guerra, descoberta, etc.)
- Descrição detalhada
- Impacto no mundo
- Principais participantes

Formato exato:
{
  "name": "Nome do Evento",
  "year": "Ano",
  "type": "Tipo",
  "description": "Descrição",
  "impact": "Impacto",
  "participants": "Participantes"
}`;

    const context = {
      worldName: worldData?.name,
      existingEvents: worldData?.events || []
    };
    
    const result = await generateWithAI('event', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const eventData = JSON.parse(cleanResult);
        console.log('Evento gerado:', eventData);
        addWorldItem('events', eventData);
        toast.success(`Evento "${eventData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const eventData = {
            id: Date.now(),
            name: nameMatch[1],
            year: 'Ano histórico',
            type: typeMatch ? typeMatch[1] : 'Evento Histórico',
            description: descriptionMatch[1],
            impact: 'Impacto significativo no mundo',
            participants: 'Participantes importantes',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('events', eventData);
          toast.success(`Evento "${eventData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar sistema de magia com IA
  const generateMagicSystem = useCallback(async () => {
    const prompt = `Crie um sistema de magia único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do sistema
- Descrição detalhada
- Regras e funcionamento
- Fonte de poder
- Limitações e custos

Formato exato:
{
  "name": "Nome do Sistema",
  "description": "Descrição detalhada",
  "rules": "Regras de funcionamento",
  "source": "Fonte de poder",
  "limitations": "Limitações e custos"
}`;

    const context = {
      worldName: worldData?.name,
      existingSystems: worldData?.magicSystems || []
    };
    
    const result = await generateWithAI('magicSystem', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const systemData = JSON.parse(cleanResult);
        console.log('Sistema de magia gerado:', systemData);
        addWorldItem('magicSystems', systemData);
        toast.success(`Sistema "${systemData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const rulesMatch = result.match(/"rules":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const systemData = {
            id: Date.now(),
            name: nameMatch[1],
            description: descriptionMatch[1],
            rules: rulesMatch ? rulesMatch[1] : 'Regras complexas de magia',
            source: 'Fonte mágica natural',
            limitations: 'Limitações e custos significativos',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('magicSystems', systemData);
          toast.success(`Sistema "${systemData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar idioma com IA
  const generateLanguage = useCallback(async () => {
    const prompt = `Crie um idioma único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do idioma
- Família linguística
- Descrição das características
- Principais falantes/povos
- Sistema de escrita
- Exemplos de palavras ou frases

Formato exato:
{
  "name": "Nome do Idioma",
  "family": "Família Linguística",
  "description": "Descrição detalhada",
  "speakers": "Principais falantes",
  "script": "Sistema de escrita",
  "examples": "Exemplos de palavras"
}`;

    const context = {
      worldName: worldData?.name,
      existingLanguages: worldData?.languages || [],
      peoples: worldData?.peoples || []
    };
    
    const result = await generateWithAI('language', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const languageData = JSON.parse(cleanResult);
        console.log('Idioma gerado:', languageData);
        addWorldItem('languages', languageData);
        toast.success(`Idioma "${languageData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const familyMatch = result.match(/"family":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const languageData = {
            id: Date.now(),
            name: nameMatch[1],
            family: familyMatch ? familyMatch[1] : 'Linguística Única',
            description: descriptionMatch[1],
            speakers: 'Povos locais',
            script: 'Sistema de escrita próprio',
            examples: 'Palavras e frases únicas',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('languages', languageData);
          toast.success(`Idioma "${languageData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar religião com IA
  const generateReligion = useCallback(async () => {
    const prompt = `Crie uma religião única para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome da religião
- Principais divindades ou conceitos
- Descrição das crenças centrais
- Práticas e rituais
- Seguidores principais
- Símbolos sagrados

Formato exato:
{
  "name": "Nome da Religião",
  "deities": "Divindades principais",
  "description": "Crenças centrais",
  "practices": "Práticas e rituais",
  "followers": "Principais seguidores",
  "symbols": "Símbolos sagrados"
}`;

    const context = {
      worldName: worldData?.name,
      existingReligions: worldData?.religions || [],
      peoples: worldData?.peoples || []
    };
    
    const result = await generateWithAI('religion', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const religionData = JSON.parse(cleanResult);
        console.log('Religião gerada:', religionData);
        addWorldItem('religions', religionData);
        toast.success(`Religião "${religionData.name}" gerada com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const deitiesMatch = result.match(/"deities":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const religionData = {
            id: Date.now(),
            name: nameMatch[1],
            deities: deitiesMatch ? deitiesMatch[1] : 'Divindades locais',
            description: descriptionMatch[1],
            practices: 'Rituais e cerimônias tradicionais',
            followers: 'Fiéis devotos',
            symbols: 'Símbolos sagrados únicos',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('religions', religionData);
          toast.success(`Religião "${religionData.name}" gerada com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar tradição com IA
  const generateTradition = useCallback(async () => {
    const prompt = `Crie uma tradição cultural única para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome da tradição
- Tipo (festival, ritual, costume, etc.)
- Descrição detalhada
- Origem histórica
- Como é praticada
- Frequência (anual, sazonal, etc.)

Formato exato:
{
  "name": "Nome da Tradição",
  "type": "Tipo da tradição",
  "description": "Descrição detalhada",
  "origin": "Origem histórica",
  "practice": "Como é praticada",
  "frequency": "Frequência"
}`;

    const context = {
      worldName: worldData?.name,
      existingTraditions: worldData?.traditions || [],
      peoples: worldData?.peoples || [],
      religions: worldData?.religions || []
    };
    
    const result = await generateWithAI('tradition', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const traditionData = JSON.parse(cleanResult);
        console.log('Tradição gerada:', traditionData);
        addWorldItem('traditions', traditionData);
        toast.success(`Tradição "${traditionData.name}" gerada com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const traditionData = {
            id: Date.now(),
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : 'Tradição Cultural',
            description: descriptionMatch[1],
            origin: 'Origem ancestral',
            practice: 'Praticada pela comunidade',
            frequency: 'Anual',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('traditions', traditionData);
          toast.success(`Tradição "${traditionData.name}" gerada com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar região com IA
  const generateRegion = useCallback(async () => {
    const prompt = `Crie uma região geográfica única para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome da região
- Descrição geográfica detalhada
- Tipo de clima predominante
- Terreno característico
- População estimada
- Características especiais

Formato exato:
{
  "name": "Nome da Região",
  "description": "Descrição geográfica",
  "climate": "Clima predominante",
  "terrain": "Tipo de terreno",
  "population": "População estimada",
  "features": "Características especiais"
}`;

    const context = {
      worldName: worldData?.name,
      existingRegions: worldData?.regions || [],
      locations: worldData?.locations || []
    };
    
    const result = await generateWithAI('region', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const regionData = JSON.parse(cleanResult);
        console.log('Região gerada:', regionData);
        addWorldItem('regions', regionData);
        toast.success(`Região "${regionData.name}" gerada com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const climateMatch = result.match(/"climate":\s*"([^"]+)"/);
        const terrainMatch = result.match(/"terrain":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const regionData = {
            id: Date.now(),
            name: nameMatch[1],
            description: descriptionMatch[1],
            climate: climateMatch ? climateMatch[1] : 'Temperado',
            terrain: terrainMatch ? terrainMatch[1] : 'Variado',
            population: 'Desconhecida',
            features: 'Características únicas da região',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('regions', regionData);
          toast.success(`Região "${regionData.name}" gerada com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar marco com IA
  const generateLandmark = useCallback(async () => {
    const prompt = `Crie um marco/ponto de referência único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do marco
- Tipo (montanha, ruínas, monumento, etc.)
- Descrição detalhada
- Importância histórica ou cultural
- Localização aproximada
- Características especiais

Formato exato:
{
  "name": "Nome do Marco",
  "type": "Tipo do marco",
  "description": "Descrição detalhada",
  "significance": "Importância histórica",
  "location": "Localização",
  "features": "Características especiais"
}`;

    const context = {
      worldName: worldData?.name,
      existingLandmarks: worldData?.landmarks || [],
      regions: worldData?.regions || []
    };
    
    const result = await generateWithAI('landmark', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const landmarkData = JSON.parse(cleanResult);
        console.log('Marco gerado:', landmarkData);
        addWorldItem('landmarks', landmarkData);
        toast.success(`Marco "${landmarkData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const landmarkData = {
            id: Date.now(),
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : 'Monumento',
            description: descriptionMatch[1],
            significance: 'Importante para a história local',
            location: 'Localização estratégica',
            features: 'Características únicas',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('landmarks', landmarkData);
          toast.success(`Marco "${landmarkData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar recurso com IA
  const generateResource = useCallback(async () => {
    const prompt = `Crie um recurso natural/material único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do recurso
- Tipo (mineral, vegetal, animal, mágico, etc.)
- Descrição das características
- Nível de raridade
- Principais usos e aplicações
- Onde pode ser encontrado

Formato exato:
{
  "name": "Nome do Recurso",
  "type": "Tipo do recurso",
  "description": "Características",
  "rarity": "Nível de raridade",
  "uses": "Principais usos",
  "location": "Onde é encontrado"
}`;

    const context = {
      worldName: worldData?.name,
      existingResources: worldData?.resources || [],
      regions: worldData?.regions || []
    };
    
    const result = await generateWithAI('resource', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const resourceData = JSON.parse(cleanResult);
        console.log('Recurso gerado:', resourceData);
        addWorldItem('resources', resourceData);
        toast.success(`Recurso "${resourceData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const resourceData = {
            id: Date.now(),
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : 'Mineral',
            description: descriptionMatch[1],
            rarity: 'Comum',
            uses: 'Múltiplos usos',
            location: 'Distribuído pelo mundo',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('resources', resourceData);
          toast.success(`Recurso "${resourceData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar tecnologia com IA
  const generateTechnology = useCallback(async () => {
    const prompt = `Crie uma tecnologia única para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome da tecnologia
- Nível tecnológico (ex: Medieval, Renascentista, Industrial, Futurista)
- Descrição detalhada de como funciona
- Principais aplicações e usos
- Impacto na sociedade

Formato exato:
{
  "name": "Nome da Tecnologia",
  "level": "Nível Tecnológico",
  "description": "Descrição detalhada",
  "applications": "Aplicações e usos",
  "impact": "Impacto na sociedade"
}`;

    const context = {
      worldName: worldData?.name,
      existingTechnologies: worldData?.technologies || [],
    };
    
    const result = await generateWithAI('technology', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const techData = JSON.parse(cleanResult);
        console.log('Tecnologia gerada:', techData);
        addWorldItem('technologies', techData);
        toast.success(`Tecnologia "${techData.name}" gerada com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const levelMatch = result.match(/"level":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const techData = {
            id: Date.now(),
            name: nameMatch[1],
            level: levelMatch ? levelMatch[1] : 'Avançado',
            description: descriptionMatch[1],
            applications: 'Múltiplas aplicações',
            impact: 'Impacto significativo na sociedade',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('technologies', techData);
          toast.success(`Tecnologia "${techData.name}" gerada com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar governo com IA
  const generateGovernment = useCallback(async () => {
    const prompt = `Crie um sistema político/governo único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do governo (ex: Império de Eldoria)
- Tipo de governo (ex: Monarquia, República, Teocracia)
- Descrição da estrutura de poder
- Título do líder (ex: Imperador, Presidente, Sumo Sacerdote)
- Leis e ideologias principais

Formato exato:
{
  "name": "Nome do Governo",
  "type": "Tipo de Governo",
  "description": "Estrutura de poder",
  "leaderTitle": "Título do Líder",
  "laws": "Leis e ideologias"
}`;

    const context = {
      worldName: worldData?.name,
      existingGovernments: worldData?.governments || [],
      peoples: worldData?.peoples || [],
      regions: worldData?.regions || [],
    };
    
    const result = await generateWithAI('government', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const govData = JSON.parse(cleanResult);
        console.log('Governo gerado:', govData);
        addWorldItem('governments', govData);
        toast.success(`Sistema político "${govData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const typeMatch = result.match(/"type":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const govData = {
            id: Date.now(),
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : 'Monarquia',
            description: descriptionMatch[1],
            leaderTitle: 'Líder Supremo',
            laws: 'Leis e regulamentos estabelecidos',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('governments', govData);
          toast.success(`Sistema político "${govData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para gerar economia com IA
  const generateEconomy = useCallback(async () => {
    const prompt = `Crie um sistema econômico único para uma light novel.

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Inclua:
- Nome do sistema (ex: Mercantilismo de Prata)
- Descrição do funcionamento
- Moeda principal
- Principais exportações e importações
- Nível de riqueza e distribuição

Formato exato:
{
  "name": "Nome do Sistema",
  "description": "Funcionamento da economia",
  "currency": "Moeda Principal",
  "mainExports": "Principais Exportações",
  "wealthDistribution": "Distribuição de Riqueza"
}`;

    const context = {
      worldName: worldData?.name,
      existingEconomies: worldData?.economies || [],
      resources: worldData?.resources || [],
      regions: worldData?.regions || [],
    };
    
    const result = await generateWithAI('economy', prompt, context);

    if (result) {
      try {
        const cleanResult = cleanAIResponse(result);
        if (!cleanResult) {
          throw new Error('Resposta da IA não pôde ser limpa');
        }
        const ecoData = JSON.parse(cleanResult);
        console.log('Economia gerada:', ecoData);
        addWorldItem('economies', ecoData);
        toast.success(`Sistema econômico "${ecoData.name}" gerado com sucesso!`);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        console.log('Resposta original:', result);
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const currencyMatch = result.match(/"currency":\s*"([^"]+)"/);
        if (nameMatch && descriptionMatch) {
          const ecoData = {
            id: Date.now(),
            name: nameMatch[1],
            description: descriptionMatch[1],
            currency: currencyMatch ? currencyMatch[1] : 'Moeda Local',
            mainExports: 'Produtos locais',
            wealthDistribution: 'Distribuição equilibrada',
            createdAt: new Date().toISOString(),
            generatedBy: aiProvider
          };
          addWorldItem('economies', ecoData);
          toast.success(`Sistema econômico "${ecoData.name}" gerado com sucesso!`);
        } else {
          toast.error('A IA retornou um formato inválido.');
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, addWorldItem, aiProvider]);

  // Função para geração em lote
  const generateBatch = useCallback(async (type, count = 5) => {
    setBatchGeneration(true);
    const results = [];
    
    for (let i = 0; i < count; i++) {
      toast.loading(`Gerando ${i + 1}/${count}...`, { id: 'batch-generation' });
      const result = await generateLocation(type);
      if (result) {
        results.push(result);
        addLocation(result);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setBatchGeneration(false);
    toast.success(`${results.length} locais gerados com sucesso!`, { id: 'batch-generation' });
    return results;
  }, [generateLocation, addLocation]);

  // Função para gerar informações básicas com IA
  const handleGenerateBasicInfo = useCallback(async () => {
    const prompt = `Crie informações básicas completas para um mundo de light novel. Inclua:

- Nome do mundo (criativo e memorável)
- Descrição geral detalhada (atmosfera, características principais, história geral)
- Gênero apropriado (fantasy, sci-fi, urban-fantasy, historical, modern, post-apocalyptic, steampunk, cyberpunk)
- Nível tecnológico (stone-age, bronze-age, iron-age, medieval, renaissance, industrial, modern, futuristic)

Considere criar um mundo único com:
- Elementos distintivos que o tornem memorável
- Atmosfera envolvente para uma light novel
- Possibilidades de narrativas interessantes
- Aspectos culturais e sociais ricos

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings

Formato exato:
{
  "name": "Nome do Mundo",
  "description": "Descrição detalhada do mundo...",
  "genre": "fantasy",
  "techLevel": "medieval"
}`;

    const context = {
      worldName: worldData?.name || 'Novo Mundo',
      existingElements: [],
      characters: characters?.slice(0, 3) || []
    };

    const result = await generateWithAI('basicInfo', prompt, context);
    
    if (result) {
      try {
        // Limpar o resultado usando a função utilitária
        const cleanResult = cleanAIResponse(result);
        
        if (!cleanResult) {
          throw new Error('Resposta da IA está vazia ou inválida');
        }
        
        // Tentar fazer parse do JSON
        const parsedResult = JSON.parse(cleanResult);
        
        console.log('AI Response parsed:', parsedResult); // Debug log
        
        // Atualizar as informações básicas
        updateWorldData({
          name: parsedResult.name || worldData?.name || '',
          description: parsedResult.description || worldData?.description || '',
          genre: parsedResult.genre || worldData?.genre || '',
          techLevel: parsedResult.techLevel || worldData?.techLevel || ''
        });
        
        toast.success('Informações básicas geradas com sucesso!');
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.log('Resultado bruto da IA:', result);
        
        // Tentar extrair informações usando regex como fallback
        const nameMatch = result.match(/"name":\s*"([^"]+)"/);
        const descriptionMatch = result.match(/"description":\s*"([^"]+)"/);
        const genreMatch = result.match(/"genre":\s*"([^"]+)"/);
        const techLevelMatch = result.match(/"techLevel":\s*"([^"]+)"/);
        
        if (nameMatch || descriptionMatch || genreMatch || techLevelMatch) {
          updateWorldData({
            name: nameMatch?.[1] || worldData?.name || '',
            description: descriptionMatch?.[1] || worldData?.description || '',
            genre: genreMatch?.[1] || worldData?.genre || '',
            techLevel: techLevelMatch?.[1] || worldData?.techLevel || ''
          });
          toast.success('Informações básicas extraídas com sucesso!');
        } else {
          // Tentar uma abordagem mais flexível - procurar por padrões no texto
          const lines = result.split('\n');
          let extractedName = '';
          let extractedDescription = '';
          let extractedGenre = '';
          let extractedTechLevel = '';
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.toLowerCase().includes('nome') && !extractedName) {
              extractedName = trimmedLine.replace(/^.*?[:：]\s*/, '').trim();
            } else if (trimmedLine.toLowerCase().includes('descrição') || trimmedLine.toLowerCase().includes('description')) {
              extractedDescription = trimmedLine.replace(/^.*?[:：]\s*/, '').trim();
            } else if (trimmedLine.toLowerCase().includes('gênero') || trimmedLine.toLowerCase().includes('genre')) {
              extractedGenre = trimmedLine.replace(/^.*?[:：]\s*/, '').trim();
            } else if (trimmedLine.toLowerCase().includes('tecnológico') || trimmedLine.toLowerCase().includes('tech')) {
              extractedTechLevel = trimmedLine.replace(/^.*?[:：]\s*/, '').trim();
            }
          }
          
          if (extractedName || extractedDescription || extractedGenre || extractedTechLevel) {
            updateWorldData({
              name: extractedName || worldData?.name || '',
              description: extractedDescription || worldData?.description || '',
              genre: extractedGenre || worldData?.genre || '',
              techLevel: extractedTechLevel || worldData?.techLevel || ''
            });
            toast.success('Informações básicas extraídas com sucesso!');
          } else {
            // Se não conseguir extrair nada, usar o texto como descrição
            updateWorldData({
              description: result
            });
            toast.success('Descrição do mundo gerada com sucesso!');
          }
        }
      }
    }
  }, [generateWithAI, cleanAIResponse, worldData, characters, updateWorldData]);

  // Função para obter dados da aba atual
  const getCurrentTabData = useCallback(() => {
    if (activeTab === 'geography') {
      switch (activeSubTab) {
        case 'locations': return worldData?.locations || [];
        case 'regions': return worldData?.regions || [];
        case 'climate': return worldData?.climates || [];
        case 'resources': return worldData?.resources || [];
        default: return [];
      }
    }
    if (activeTab === 'cultures') {
      switch (activeSubTab) {
        case 'peoples': return worldData?.peoples || [];
        case 'languages': return worldData?.languages || [];
        case 'religions': return worldData?.religions || [];
        case 'traditions': return worldData?.traditions || [];
        default: return [];
      }
    }
    if (activeTab === 'systems') {
      switch (activeSubTab) {
        case 'magicSystems': return worldData?.magicSystems || [];
        case 'technologies': return worldData?.technologies || [];
        case 'governments': return worldData?.governments || [];
        case 'economies': return worldData?.economies || [];
        default: return [];
      }
    }
    if (activeTab === 'history') {
      switch (activeSubTab) {
        case 'events': return worldData?.events || [];
        case 'eras': return worldData?.eras || [];
        default: return [];
      }
    }
    return [];
  }, [activeTab, activeSubTab, worldData]);

  // Filtros e ordenação
  const filteredAndSortedData = useMemo(() => {
    const currentData = getCurrentTabData();
    
    let filtered = currentData.filter(item => {
      const searchTermLower = (searchTerm || '').toLowerCase();
      const matchesSearch = item.name?.toLowerCase().includes(searchTermLower) ||
                           item.description?.toLowerCase().includes(searchTermLower);
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, filterType, sortBy, sortOrder, getCurrentTabData]);

  // Estatísticas do mundo
  const worldStats = useMemo(() => {
    const locations = worldData?.locations || [];
    const cultures = worldData?.cultures || [];
    const religions = worldData?.religions || [];
    
    return {
      totalElements: locations.length + cultures.length + religions.length,
      locations: locations.length,
      cultures: cultures.length,
      religions: religions.length,
      avgWordsPerLocation: locations.length > 0 
        ? Math.round(locations.reduce((acc, loc) => acc + (loc.description?.split(' ').length || 0), 0) / locations.length)
        : 0,
      mostCommonType: locations.reduce((acc, loc) => {
        acc[loc.type] = (acc[loc.type] || 0) + 1;
        return acc;
      }, {}),
      recentlyAdded: locations.filter(loc => {
        const created = new Date(loc.createdAt || 0);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created > weekAgo;
      }).length
    };
  }, [worldData]);

  // Handlers genéricos para salvar e deletar
  const handleSave = (category, data) => {
    const singularCategory = category.endsWith('s') ? category.slice(0, -1) : category;
    if (editingItem) {
      updateWorldItem(category, editingItem.id, data);
      toast.success(`${singularCategory.charAt(0).toUpperCase() + singularCategory.slice(1)} atualizado com sucesso!`);
    } else {
      addWorldItem(category, data);
      toast.success(`${singularCategory.charAt(0).toUpperCase() + singularCategory.slice(1)} adicionado com sucesso!`);
    }
    setFormType(null);
    setEditingItem(null);
  };

  const handleDelete = (category, id) => {
    const singularCategory = category.endsWith('s') ? category.slice(0, -1) : category;
    deleteWorldItem(category, id);
    toast.success(`${singularCategory.charAt(0).toUpperCase() + singularCategory.slice(1)} excluído com sucesso!`);
    setFormType(null);
    setEditingItem(null);
  };

  // Renderizar visão geral
  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-compact hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
                          <p className="text-sm font-medium text-muted-foreground">Total de Elementos</p>
            <p className="text-2xl font-bold text-foreground">{worldStats.totalElements}</p>
            </div>
          </div>
        </div>

        <div className="card-compact hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div>
                          <p className="text-sm font-medium text-muted-foreground">Locais</p>
            <p className="text-2xl font-bold text-foreground">{worldStats.locations}</p>
            </div>
          </div>
        </div>

        <div className="card-compact hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
                          <p className="text-sm font-medium text-muted-foreground">Culturas</p>
            <p className="text-2xl font-bold text-foreground">{worldStats.cultures}</p>
            </div>
          </div>
        </div>

        <div className="card-compact hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <div>
                          <p className="text-sm font-medium text-muted-foreground">Religiões</p>
            <p className="text-2xl font-bold text-foreground">{worldStats.religions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do mundo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações básicas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateBasicInfo}
                disabled={isGenerating}
                className="btn-secondary flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {isGenerating ? 'Gerando...' : 'IA'}
              </button>
              <button className="btn-ghost">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {isGenerating && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center text-purple-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-2"></div>
                  <span className="text-sm">Gerando informações básicas com IA...</span>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Mundo</label>
              <input
                type="text"
                value={worldData?.name || ''}
                onChange={(e) => updateWorldData({ name: e.target.value })}
                className="input-field"
                placeholder="Digite o nome do seu mundo..."
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descrição Geral</label>
              <textarea
                value={worldData?.description || ''}
                onChange={(e) => updateWorldData({ description: e.target.value })}
                className="textarea-field"
                rows="4"
                placeholder="Descreva seu mundo, sua atmosfera, características principais..."
                disabled={isGenerating}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gênero</label>
                <select
                  value={worldData?.genre || ''}
                  onChange={(e) => updateWorldData({ genre: e.target.value })}
                  className="input-field"
                  disabled={isGenerating}
                >
                  <option value="">Selecione...</option>
                  <option value="fantasy">Fantasia</option>
                  <option value="sci-fi">Ficção Científica</option>
                  <option value="urban-fantasy">Fantasia Urbana</option>
                  <option value="historical">Histórico</option>
                  <option value="modern">Moderno</option>
                  <option value="post-apocalyptic">Pós-Apocalíptico</option>
                  <option value="steampunk">Steampunk</option>
                  <option value="cyberpunk">Cyberpunk</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nível Tecnológico</label>
                <select
                  value={worldData?.techLevel || ''}
                  onChange={(e) => updateWorldData({ techLevel: e.target.value })}
                  className="input-field"
                  disabled={isGenerating}
                >
                  <option value="">Selecione...</option>
                  <option value="stone-age">Idade da Pedra</option>
                  <option value="bronze-age">Idade do Bronze</option>
                  <option value="iron-age">Idade do Ferro</option>
                  <option value="medieval">Medieval</option>
                  <option value="renaissance">Renascimento</option>
                  <option value="industrial">Industrial</option>
                  <option value="modern">Moderno</option>
                  <option value="futuristic">Futurístico</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* IA Assistant */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-foreground">Assistente IA</h3>
            </div>
            {aiProvider && (
              <span className="badge badge-success">
                {settings?.aiProviders?.[aiProvider]?.name || aiProvider}
              </span>
            )}
          </div>

          {aiProvider ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => generateLocation('city')}
                  disabled={isGenerating}
                  className="btn-outline flex items-center justify-center"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Gerar Cidade
                </button>
                
                <button
                  onClick={() => generateLocation('wilderness')}
                  disabled={isGenerating}
                  className="btn-outline flex items-center justify-center"
                >
                  <TreePine className="h-4 w-4 mr-2" />
                  Gerar Natureza
                </button>
                
                <button
                  onClick={() => generateLocation('mystical')}
                  disabled={isGenerating}
                  className="btn-outline flex items-center justify-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Místico
                </button>
                
                <button
                  onClick={() => generateBatch('random', 3)}
                  disabled={isGenerating || batchGeneration}
                  className="btn-primary flex items-center justify-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Lote (3x)
                </button>
              </div>

              {(isGenerating || batchGeneration) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {batchGeneration ? 'Geração em lote...' : 'Gerando conteúdo...'}
                    </span>
                    <span className="text-muted-foreground">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> A IA usa o contexto do seu mundo e personagens para gerar conteúdo mais coerente e interessante.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
                              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Configure um provedor de IA para usar a geração automática</p>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="btn-primary"
              >
                Configurar IA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Elementos recentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Elementos Recentes</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{worldStats.recentlyAdded} esta semana</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {worldData?.locations?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worldData.locations.slice(-6).map((location) => (
              <div key={location.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{location.name}</h4>
                  <span className={`badge ${locationTypes.find(t => t.value === location.type)?.color || 'badge-gray'}`}>
                    {locationTypes.find(t => t.value === location.type)?.label || location.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{location.description}</p>
                {location.generatedBy && (
                  <div className="mt-2 flex items-center text-xs text-purple-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Gerado por IA
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
                            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Comece a construir seu mundo</h3>
                <p className="text-muted-foreground mb-6">Crie locais, culturas e sistemas para dar vida à sua história</p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setActiveTab('geography')}
                className="btn-primary"
              >
                Adicionar Local
              </button>
              <button 
                onClick={() => setActiveTab('cultures')}
                className="btn-outline"
              >
                Criar Cultura
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar geografia
  const renderGeography = () => {
    return (
      <div className="space-y-6 animate-fade-in">

              {/* Controles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar locais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
              />
            </div>

            {/* Filtro por tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
            >
              <option value="all">Todos os tipos</option>
              {locationTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="type-asc">Tipo (A-Z)</option>
              <option value="createdAt-desc">Mais recentes</option>
              <option value="createdAt-asc">Mais antigos</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* Modo de visualização */}
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-muted' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Botão adicionar */}
            <button
              onClick={() => setFormType('location')}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Local
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {activeSubTab === 'locations' && renderLocations()}
        {activeSubTab === 'regions' && renderRegions()}
        {activeSubTab === 'landmarks' && renderLandmarks()}
        {activeSubTab === 'resources' && renderResources()}
      </div>
    );
  };

  // Renderizar locais
  const renderLocations = () => {
    if (filteredAndSortedData.length === 0) {
      return (
        <div className="text-center py-16">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterType !== 'all' ? 'Nenhum local encontrado' : 'Nenhum local criado ainda'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro local ou use a IA para gerar automaticamente'
            }
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('location')}
              className="btn-primary"
            >
              Adicionar Manualmente
            </button>
            {aiProvider && (
              <button 
                onClick={async () => {
                  setIsGenerating(true);
                  try {
                    const result = await generateLocation('random');
                    if (result) {
                      addLocation(result);
                      toast.success(`Local "${result.name}" gerado com sucesso!`);
                    }
                  } catch (error) {
                    toast.error(`Erro ao gerar local: ${error.message}`);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                className="btn-outline"
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedData.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredAndSortedData.map((location) => (
          <LocationListItem key={location.id} location={location} />
        ))}
      </div>
    );
  };

  // Componente de card de local
  const LocationCard = ({ location }) => {
    const locationTypeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[0];
    const isExpanded = expandedCards[location.id];

    return (
      <div className="card hover-lift group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${locationTypeInfo?.color?.replace('text-', 'text-white bg-')?.replace('-800', '-500')}`}>
              <locationTypeInfo.icon className="h-5 w-5" />
            </div>
            <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary-600 transition-colors">
              {location.name}
            </h3>
            <p className="text-sm text-muted-foreground">{locationTypeInfo.label}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setExpandedCards(prev => ({ ...prev, [location.id]: !prev[location.id] }))}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                setEditingItem(location);
                setFormType('location');
              }}
              className="p-1 text-gray-400 hover:text-green-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {location.description}
        </p>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-slide-up">
            {location.climate && (
              <div className="flex items-center text-sm">
                <Sun className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-gray-600">Clima: {location.climate}</span>
              </div>
            )}
            
            {location.population && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">População: {location.population}</span>
              </div>
            )}
            
            {location.pointsOfInterest?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Pontos de Interesse:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {location.pointsOfInterest.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {location.generatedBy && (
              <span className="badge badge-primary flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </span>
            )}
            {location.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(location.createdAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-600" title="Copiar">
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600" title="Compartilhar">
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente de item de lista
  const LocationListItem = ({ location }) => {
    const locationTypeInfo = locationTypes.find(t => t.value === location.type) || locationTypes[0];

    return (
      <div className="card flex items-center justify-between hover-lift">
        <div className="flex items-center flex-1 min-w-0">
          <div className={`p-2 rounded-lg mr-4 ${locationTypeInfo?.color?.replace('text-', 'text-white bg-')?.replace('-800', '-500')}`}>
            <locationTypeInfo.icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-900 truncate">{location.name}</h3>
              <span className={`badge ${locationTypeInfo.color}`}>
                {locationTypeInfo.label}
              </span>
              {location.generatedBy && (
                <span className="badge badge-primary flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm truncate mt-1">{location.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {location.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(location.createdAt).toLocaleDateString('pt-BR')}
            </span>
          )}
          <button
            onClick={() => {
              setEditingItem(location);
              setFormType('location');
            }}
            className="p-2 text-gray-400 hover:text-green-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Renderizar Regiões
  const renderRegions = () => {
    const regions = worldData?.regions || [];

    if (regions.length === 0) {
      return (
        <div className="text-center py-16">
          <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma região criada ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione regiões geográficas para organizar seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('region')}
              className="btn-primary"
            >
              Adicionar Região
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateRegion()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Regiões ({regions.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('region')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Região
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateRegion()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div
              key={region.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(region);
                setFormType('region');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-foreground">
                  {region.name}
                </h4>
                <Map className="h-5 w-5 text-primary-500" />
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {region.description}
              </p>

              {region.climate && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Clima:</span>
                  <p className="text-sm text-foreground">{region.climate}</p>
                </div>
              )}

              {region.terrain && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Terreno:</span>
                  <p className="text-sm text-foreground">{region.terrain}</p>
                </div>
              )}

              {region.population && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">População:</span>
                  <p className="text-sm text-foreground">{region.population}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Marcos/Pontos de Referência
  const renderLandmarks = () => {
    const landmarks = worldData?.landmarks || [];

    if (landmarks.length === 0) {
      return (
        <div className="text-center py-16">
          <Navigation className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum marco criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione marcos e pontos de referência importantes.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('landmark')}
              className="btn-primary"
            >
              Adicionar Marco
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateLandmark()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Marcos ({landmarks.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('landmark')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Marco
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateLandmark()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmarks.map((landmark) => (
            <div
              key={landmark.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(landmark);
                setFormType('landmark');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-foreground">
                  {landmark.name}
                </h4>
                <Navigation className="h-5 w-5 text-primary-500" />
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {landmark.description}
              </p>

              {landmark.type && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                    {landmark.type}
                  </span>
                </div>
              )}

              {landmark.significance && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Importância:</span>
                  <p className="text-sm text-foreground line-clamp-2">{landmark.significance}</p>
                </div>
              )}

              {landmark.location && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Localização:</span>
                  <p className="text-sm text-foreground">{landmark.location}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Recursos
  const renderResources = () => {
    const resources = worldData?.resources || [];

    if (resources.length === 0) {
      return (
        <div className="text-center py-16">
          <Gem className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum recurso criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione recursos naturais e materiais do seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('resource')}
              className="btn-primary"
            >
              Adicionar Recurso
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateResource()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Recursos ({resources.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('resource')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Recurso
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateResource()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(resource);
                setFormType('resource');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-foreground">
                  {resource.name}
                </h4>
                <Gem className="h-5 w-5 text-secondary-500" />
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {resource.description}
              </p>

              {resource.type && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded">
                    {resource.type}
                  </span>
                </div>
              )}

              {resource.rarity && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Raridade:</span>
                  <p className="text-sm text-foreground">{resource.rarity}</p>
                </div>
              )}

              {resource.uses && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Usos:</span>
                  <p className="text-sm text-foreground line-clamp-2">{resource.uses}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar culturas
  const renderCultures = () => {
    return (
      <div className="space-y-6 animate-fade-in">

      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar culturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Todos os tipos</option>
            {locationTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Ordenação */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="type-asc">Tipo (A-Z)</option>
            <option value="createdAt-desc">Mais recentes</option>
            <option value="createdAt-asc">Mais antigos</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* Seleção múltipla */}
          {/* {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selecionado(s)
              </span>
              <button className="btn-ghost text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
              <button className="btn-ghost">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          )} */}

          {/* Modo de visualização */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Botão adicionar */}
          <button
            onClick={() => setFormType('people')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cultura
          </button>
        </div>
      </div>

              {/* Conteúdo */}
        {activeSubTab === 'peoples' && renderPeoples()}
        {activeSubTab === 'languages' && renderLanguages()}
        {activeSubTab === 'religions' && renderReligions()}
        {activeSubTab === 'traditions' && renderTraditions()}
      </div>
    );
  };
  
  // Renderizar povos
  const renderPeoples = () => {
    if (filteredAndSortedData.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum povo criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Comece a adicionar os povos e raças que habitam seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('people')}
              className="btn-primary"
            >
              Adicionar Povo
            </button>
            {aiProvider && (
              <button 
                onClick={generatePeople}
                className="btn-outline"
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedData.map((people) => (
            <PeopleCard
              key={people.id}
              people={people}
              onClick={() => {
                setFormType('people');
                setEditingItem(people);
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Implementar List View para Povos */}
      </div>
    );
  };

  // Componente de card de povo
  const PeopleCard = ({ people, onClick }) => {
    return (
      <div className="card hover-lift group" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 bg-purple-100 text-purple-600`}>
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                {people.name}
              </h3>
              <p className="text-sm text-gray-500">{people.classification}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-gray-400 hover:text-purple-600">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className={`text-gray-600 text-sm leading-relaxed line-clamp-3`}>
          {people.description}
        </p>
      </div>
    );
  };

  // Renderizar Idiomas
  const renderLanguages = () => {
    const languages = worldData?.languages || [];

    if (languages.length === 0) {
      return (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum idioma criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione os idiomas e dialetos falados em seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('language')}
              className="btn-primary"
            >
              Adicionar Idioma
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateLanguage()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Idiomas ({languages.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('language')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Idioma
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateLanguage()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language) => (
            <div
              key={language.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(language);
                setFormType('language');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {language.name}
                </h4>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {language.description}
              </p>

              {language.family && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Família:</span>
                  <p className="text-sm text-gray-700">{language.family}</p>
                </div>
              )}

              {language.speakers && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Falantes:</span>
                  <p className="text-sm text-gray-700">{language.speakers}</p>
                </div>
              )}

              {language.script && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Escrita:</span>
                  <p className="text-sm text-gray-700">{language.script}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Religiões
  const renderReligions = () => {
    const religions = worldData?.religions || [];

    if (religions.length === 0) {
      return (
        <div className="text-center py-16">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma religião criada ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione as religiões, deuses e crenças do seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('religion')}
              className="btn-primary"
            >
              Adicionar Religião
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateReligion()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Religiões ({religions.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('religion')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Religião
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateReligion()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {religions.map((religion) => (
            <div
              key={religion.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(religion);
                setFormType('religion');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {religion.name}
                </h4>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {religion.description}
              </p>

              {religion.deities && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Divindades:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{religion.deities}</p>
                </div>
              )}

              {religion.practices && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Práticas:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{religion.practices}</p>
                </div>
              )}

              {religion.followers && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Seguidores:</span>
                  <p className="text-sm text-gray-700">{religion.followers}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Tradições
  const renderTraditions = () => {
    const traditions = worldData?.traditions || [];

    if (traditions.length === 0) {
      return (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tradição criada ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione as tradições, festivais e costumes culturais.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFormType('tradition')}
              className="btn-primary"
            >
              Adicionar Tradição
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateTradition()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Tradições ({traditions.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('tradition')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tradição
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateTradition()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traditions.map((tradition) => (
            <div
              key={tradition.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(tradition);
                setFormType('tradition');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {tradition.name}
                </h4>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {tradition.description}
              </p>

              {tradition.type && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {tradition.type}
                  </span>
                </div>
              )}

              {tradition.origin && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Origem:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{tradition.origin}</p>
                </div>
              )}

              {tradition.frequency && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Frequência:</span>
                  <p className="text-sm text-gray-700">{tradition.frequency}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Sistemas
  const renderSystems = () => {
    return (
      <div className="space-y-6 animate-fade-in">

              {/* Conteúdo */}
        {activeSubTab === 'magicSystems' && renderMagicSystems()}
        {activeSubTab === 'technologies' && renderTechnologies()}
        {activeSubTab === 'governments' && renderGovernments()}
        {activeSubTab === 'economies' && renderEconomies()}
      </div>
    );
  };

  // Renderizar Sistemas de Magia
  const renderMagicSystems = () => {
    const magicSystems = worldData?.magicSystems || [];

    if (magicSystems.length === 0) {
      return (
        <div className="text-center py-16">
          <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum Sistema de Magia criado
          </h3>
          <p className="text-gray-500 mb-6">
            Defina as regras e fontes da magia em seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button 
              className="btn-primary"
              onClick={() => setFormType('magicSystem')}
            >
              Adicionar Sistema de Magia
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateMagicSystem()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sistemas de Magia ({magicSystems.length})
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('magicSystem')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sistema
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateMagicSystem()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magicSystems.map((system) => (
            <div
              key={system.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(system);
                setFormType('magicSystem');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {system.name}
                </h4>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {system.description}
              </p>

              {system.source && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Fonte:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{system.source}</p>
                </div>
              )}

              {system.limitations && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Limitações:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{system.limitations}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Tecnologias
  const renderTechnologies = () => {
    const technologies = worldData?.technologies || [];

    if (technologies.length === 0) {
      return (
        <div className="text-center py-16">
          <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tecnologia criada ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione as tecnologias, invenções e níveis de avanço do seu mundo.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setFormType('technology')}
              className="btn-primary"
            >
              Adicionar Tecnologia
            </button>
            {aiProvider && (
              <button
                onClick={() => generateTechnology()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Tecnologias ({technologies.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFormType('technology')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tecnologia
            </button>
            {aiProvider && (
              <button
                onClick={() => generateTechnology()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(tech);
                setFormType('technology');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {tech.name}
                </h4>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {tech.description}
              </p>

              {tech.level && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Nível: {tech.level}
                  </span>
                </div>
              )}

              {tech.applications && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Aplicações:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{tech.applications}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Governos
  const renderGovernments = () => {
    const governments = worldData?.governments || [];

    if (governments.length === 0) {
      return (
        <div className="text-center py-16">
          <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum sistema político criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione reinos, impérios, repúblicas e outras formas de governo.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setFormType('government')}
              className="btn-primary"
            >
              Adicionar Sistema Político
            </button>
            {aiProvider && (
              <button
                onClick={() => generateGovernment()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sistemas Políticos ({governments.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFormType('government')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sistema
            </button>
            {aiProvider && (
              <button
                onClick={() => generateGovernment()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {governments.map((gov) => (
            <div
              key={gov.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(gov);
                setFormType('government');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {gov.name}
                </h4>
                <Crown className="h-5 w-5 text-indigo-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {gov.description}
              </p>

              {gov.type && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                    {gov.type}
                  </span>
                </div>
              )}

              {gov.leaderTitle && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Líder:</span>
                  <p className="text-sm text-gray-700">{gov.leaderTitle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar Economias
  const renderEconomies = () => {
    const economies = worldData?.economies || [];

    if (economies.length === 0) {
      return (
        <div className="text-center py-16">
          <Coins className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum sistema econômico criado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione sistemas de troca, moedas e atividades econômicas.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setFormType('economy')}
              className="btn-primary"
            >
              Adicionar Sistema Econômico
            </button>
            {aiProvider && (
              <button
                onClick={() => generateEconomy()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sistemas Econômicos ({economies.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFormType('economy')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sistema
            </button>
            {aiProvider && (
              <button
                onClick={() => generateEconomy()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {economies.map((eco) => (
            <div
              key={eco.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingItem(eco);
                setFormType('economy');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {eco.name}
                </h4>
                <Coins className="h-5 w-5 text-green-500" />
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {eco.description}
              </p>

              {eco.currency && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Moeda:</span>
                  <p className="text-sm text-gray-700">{eco.currency}</p>
                </div>
              )}

              {eco.mainExports && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Exportações:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{eco.mainExports}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar História (Timeline)
  const renderHistory = () => {
    const sortedEvents = [...(worldData?.events || [])].sort((a, b) => (a.year || 0) - (b.year || 0));

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Controles da Timeline */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Timeline Histórica</h3>
            <span className="text-sm text-gray-500">
              {sortedEvents.length} eventos
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFormType('event')}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Evento
            </button>
            {aiProvider && (
              <button 
                onClick={() => generateEvent()}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar com IA
              </button>
            )}
          </div>
        </div>

        <div className="relative pl-8">
          {/* Linha vertical */}
          <div className="absolute left-12 top-0 h-full w-0.5 bg-gray-200" />
          
          {sortedEvents.length > 0 ? sortedEvents.map((event, index) => (
            <div key={event.id} className="relative mb-8 group">
              <div className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              <div className="ml-12 pl-8 bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => {
                     setEditingItem(event);
                     setFormType('event');
                   }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-lg text-red-700">{event.year || 'Data Indefinida'}</p>
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">{event.name}</h4>
                    <p className="text-gray-600 line-clamp-3">{event.description}</p>
                    {event.type && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {event.type}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(event);
                        setFormType('event');
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-16 text-gray-500">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento histórico adicionado</h3>
              <p className="mb-6">Adicione eventos para construir a linha do tempo do seu mundo.</p>
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={() => setFormType('event')}
                  className="btn-primary"
                >
                  Adicionar Evento
                </button>
                {aiProvider && (
                  <button 
                    onClick={() => generateEvent()}
                    className="btn-outline"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar com IA
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Relações (Tree View)
  const renderRelationships = () => {
    // Criar nós baseados nos dados reais do mundo
    const nodes = [];
    const edges = [];
    let nodeId = 1;


    // Nó central do mundo
    nodes.push({
      id: '0',
      position: { x: 400, y: 50 },
      data: { 
        label: worldData?.name || 'Seu Mundo',
        style: { background: '#3B82F6', color: 'white', fontWeight: 'bold' }
      },
      style: { background: '#3B82F6', color: 'white', fontWeight: 'bold' }
    });

    // Adicionar personagens
    if (characters && characters.length > 0) {
      characters.slice(0, 5).forEach((character, index) => {
        const id = `char-${nodeId++}`;
        nodes.push({
          id,
          position: { x: 100 + (index * 150), y: 200 },
          data: { 
            label: character.name,
            subtitle: character.role || 'Personagem'
          },
          style: { background: '#10B981', color: 'white' }
        });
        edges.push({ id: `e0-${id}`, source: '0', target: id });
      });
    }

    // Adicionar locais
    if (worldData?.locations && worldData.locations.length > 0) {
      worldData.locations.slice(0, 5).forEach((location, index) => {
        const id = `loc-${nodeId++}`;
        nodes.push({
          id,
          position: { x: 600 + (index * 150), y: 200 },
          data: { 
            label: location.name,
            subtitle: location.type || 'Local'
          },
          style: { background: '#F59E0B', color: 'white' }
        });
        edges.push({ id: `e0-${id}`, source: '0', target: id });
      });
    }

    // Adicionar povos
    if (worldData?.peoples && worldData.peoples.length > 0) {
      worldData.peoples.slice(0, 3).forEach((people, index) => {
        const id = `people-${nodeId++}`;
        nodes.push({
          id,
          position: { x: 200 + (index * 200), y: 350 },
          data: { 
            label: people.name,
            subtitle: people.classification || 'Povo'
          },
          style: { background: '#8B5CF6', color: 'white' }
        });
        edges.push({ id: `e0-${id}`, source: '0', target: id });
      });
    }

    // Adicionar sistemas de magia
    if (worldData?.magicSystems && worldData.magicSystems.length > 0) {
      worldData.magicSystems.slice(0, 3).forEach((system, index) => {
        const id = `magic-${nodeId++}`;
        nodes.push({
          id,
          position: { x: 700 + (index * 200), y: 350 },
          data: { 
            label: system.name,
            subtitle: 'Sistema de Magia'
          },
          style: { background: '#EF4444', color: 'white' }
        });
        edges.push({ id: `e0-${id}`, source: '0', target: id });
      });
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mapa de Relações</h3>
            <p className="text-sm text-gray-500">
              Visualização das conexões entre elementos do seu mundo
            </p>
          </div>
          <div className="flex space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Personagens</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Locais</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Povos</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Magia</span>
            </div>
          </div>
        </div>

        <div style={{ height: '600px' }} className="border rounded-lg bg-gray-50">
          {nodes.length > 1 ? (
            <ReactFlow 
              nodes={nodes} 
              edges={edges}
              fitView
              attributionPosition="bottom-left"
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Share className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma relação para exibir
                </h3>
                <p className="mb-4">
                  Adicione personagens, locais e outros elementos para ver suas conexões.
                </p>
                <div className="flex justify-center space-x-2">
                  <button 
                    onClick={() => {
                      setActiveTab('cultures');
                      setActiveSubTab('peoples');
                    }}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                  >
                    Adicionar Personagens
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('geography');
                      setActiveSubTab('locations');
                    }}
                    className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                  >
                    Adicionar Locais
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Analytics
  const renderAnalytics = () => {
    return (
      <div className="space-y-6 animate-fade-in">

        {/* Conteúdo */}
        {activeSubTab === 'statistics' && renderStatistics()}
        {activeSubTab === 'insights' && renderInsights()}
        {activeSubTab === 'reports' && renderReports()}
      </div>
    );
  };

  // Renderizar Estatísticas
  const renderStatistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Locais</p>
              <p className="text-2xl font-bold text-gray-900">{worldData?.locations?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Povos Criados</p>
              <p className="text-2xl font-bold text-gray-900">{worldData?.peoples?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <Sparkles className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sistemas de Magia</p>
              <p className="text-2xl font-bold text-gray-900">{worldData?.magicSystems?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Eventos Históricos</p>
              <p className="text-2xl font-bold text-gray-900">{worldData?.events?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo</h3>
          <div className="space-y-3">
            {locationTypes.slice(0, 5).map((type) => {
              const count = worldData?.locations?.filter(loc => loc.type === type.value).length || 0;
              const percentage = worldData?.locations?.length > 0 ? (count / worldData.locations.length * 100).toFixed(1) : 0;
              
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{type.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Elementos criados esta semana</span>
              <span className="text-sm font-medium text-gray-900">{worldStats.recentlyAdded}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Média de palavras por local</span>
              <span className="text-sm font-medium text-gray-900">{worldStats.avgWordsPerLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total de elementos</span>
              <span className="text-sm font-medium text-gray-900">{worldStats.totalElements}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar Insights
  const renderInsights = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights do Mundo</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🌍 Mundo em Desenvolvimento</h4>
            <p className="text-blue-700 text-sm">
              Seu mundo tem {worldStats.totalElements} elementos criados. 
              {worldStats.totalElements < 10 ? ' Continue expandindo para criar um universo rico!' : ' Excelente trabalho na construção do seu universo!'}
            </p>
          </div>

          {worldData?.locations?.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🗺️ Diversidade Geográfica</h4>
              <p className="text-green-700 text-sm">
                Você criou {worldData.locations.length} locais únicos. 
                Considere adicionar mais regiões e marcos para enriquecer a geografia do seu mundo.
              </p>
            </div>
          )}

          {worldData?.peoples?.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">👥 Diversidade Cultural</h4>
              <p className="text-purple-700 text-sm">
                {worldData.peoples.length} povos habitam seu mundo. 
                Explore suas tradições, idiomas e religiões para criar culturas mais profundas.
              </p>
            </div>
          )}

          {worldData?.magicSystems?.length > 0 && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">✨ Sistemas Mágicos</h4>
              <p className="text-orange-700 text-sm">
                {worldData.magicSystems.length} sistema(s) de magia definido(s). 
                Considere como a magia afeta a sociedade, economia e política do seu mundo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar Relatórios
  const renderReports = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Relatório Completo</span>
            </div>
            <p className="text-sm text-gray-600">Exporte todos os dados do seu mundo em formato detalhado</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-gray-900">Análise de Consistência</span>
            </div>
            <p className="text-sm text-gray-600">Verifique a consistência entre elementos do mundo</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Share2 className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium text-gray-900">Mapa de Relações</span>
            </div>
            <p className="text-sm text-gray-600">Visualize as conexões entre personagens e locais</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-gray-900">Timeline Histórica</span>
            </div>
            <p className="text-sm text-gray-600">Linha do tempo completa dos eventos históricos</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar conteúdo principal
  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'geography':
        return renderGeography();
      case 'cultures':
        return renderCultures();
      case 'systems':
        return renderSystems();
      case 'history':
        return renderHistory();
      case 'relationships':
        return renderRelationships();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Menu Lateral */}
      <SideMenu
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        onTabChange={setActiveTabWithSubTab}
        onSubTabChange={setActiveSubTab}
        worldData={worldData}
      />
      
      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="truncate">Construtor de Mundo</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Crie mundos ricos e detalhados para suas histórias
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {showStats && (
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{worldStats.totalElements}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">elementos criados</div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="btn-ghost p-2"
                  >
                    {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  
                  <button className="btn-outline flex items-center text-sm">
                    <Download className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>
                  
                  <button className="btn-outline flex items-center text-sm">
                    <Upload className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Importar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          {renderMainContent()}
        </div>
      </div>

      {/* Modals */}
      {formType === 'location' && (
        <LocationFormModal
          location={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => {
            if (editingItem) {
              updateWorldItem('locations', editingItem.id, data);
            } else {
              addWorldItem('locations', data);
            }
            setFormType(null);
            setEditingItem(null);
          }}
          onDelete={(id) => {
            deleteWorldItem('locations', id);
            toast.success('Local excluído com sucesso!');
            setFormType(null);
            setEditingItem(null);
          }}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'people' && (
        <PeopleFormModal
          people={editingItem}
          onClose={() => {
            setFormType(null);
            setEditingItem(null);
          }}
          onSave={(data) => {
            if (editingItem) {
              updateWorldItem('peoples', editingItem.id, data);
            } else {
              addWorldItem('peoples', data);
            }
            setFormType(null);
            setEditingItem(null);
          }}
          onDelete={(id) => {
            deleteWorldItem('peoples', id);
            toast.success('Povo excluído com sucesso!');
            setFormType(null);
            setEditingItem(null);
          }}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'magicSystem' && (
        <MagicSystemFormModal
          system={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('magicSystems', data)}
          onDelete={(id) => handleDelete('magicSystems', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'event' && (
        <EventFormModal
          event={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('events', data)}
          onDelete={(id) => handleDelete('events', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'language' && (
        <LanguageFormModal
          language={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('languages', data)}
          onDelete={(id) => handleDelete('languages', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'religion' && (
        <ReligionFormModal
          religion={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('religions', data)}
          onDelete={(id) => handleDelete('religions', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'tradition' && (
        <TraditionFormModal
          tradition={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('traditions', data)}
          onDelete={(id) => handleDelete('traditions', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'region' && (
        <RegionFormModal
          region={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('regions', data)}
          onDelete={(id) => handleDelete('regions', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'landmark' && (
        <LandmarkFormModal
          landmark={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('landmarks', data)}
          onDelete={(id) => handleDelete('landmarks', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'resource' && (
        <ResourceFormModal
          resource={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('resources', data)}
          onDelete={(id) => handleDelete('resources', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'technology' && (
        <TechnologyFormModal
          technology={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('technologies', data)}
          onDelete={(id) => handleDelete('technologies', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'government' && (
        <GovernmentFormModal
          government={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('governments', data)}
          onDelete={(id) => handleDelete('governments', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      {formType === 'economy' && (
        <EconomyFormModal
          economy={editingItem}
          onClose={() => setFormType(null)}
          onSave={(data) => handleSave('economies', data)}
          onDelete={(id) => handleDelete('economies', id)}
          aiProvider={aiProvider}
          isGenerating={isGenerating}
          onGenerateWithAI={generateWithAI}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default WorldBuilder;
