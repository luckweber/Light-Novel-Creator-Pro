import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorldBuilderNavigation } from '../hooks/useWorldBuilderNavigation';
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
  Share2,
  Brain
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
import AIAgent from '../components/AI/AIAgent';
import { useAIAgent } from '../hooks/useAIAgent';
import { createUnifiedPromptIntegration } from '../utils/unifiedPromptIntegration';

const WorldBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hook de navegação híbrida
  const {
    getCurrentRouteState,
    navigateToSection,
    navigateWithParams,
    updateParams,
    isCurrentRoute
  } = useWorldBuilderNavigation();
  
  const { 
    worldData, 
    updateWorldData, 
    addLocation,
    settings,
    characters,
    addWorldItem,
    updateWorldItem,
    deleteWorldItem,
    volumes,
    chapters
  } = useStore();

  // Estados principais - agora sincronizados com o hook de navegação
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [formType, setFormType] = useState(null); // 'location', 'people', etc.
  const [editingItem, setEditingItem] = useState(null);
  
  // Agente de IA
  const aiProvider = settings?.defaultAIProvider || 'openai';
  const {
    isAgentOpen,
    setIsAgentOpen,
    isAnalyzing,
    generateWithContext,
    analyzeProject,
    generateElementPrompt,
    getQualityTips,
    getVolumeInsights,
    generateSmartElement
  } = useAIAgent(aiProvider, settings);
  
  // Função para renderizar descrições com segurança
  const renderDescription = (description) => {
    if (typeof description === 'string') {
      return description;
    } else if (description && typeof description === 'object') {
      return JSON.stringify(description);
    } else {
      return 'Descrição não disponível';
    }
  };

  // Função para renderizar campos com segurança
  const renderField = (value) => {
    if (typeof value === 'string') {
      return value;
    } else if (value && typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return 'Valor não disponível';
    }
  };

  // Função para renderizar campos de objeto com segurança
  const renderObjectFields = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <div key={key} className="mb-2">
            <span className="text-xs font-medium text-muted-foreground">{key}:</span>
            <p className="text-sm text-foreground">{JSON.stringify(value)}</p>
          </div>
        );
      }
      return null;
    });
  };
  
  // Função para ler parâmetros da URL (mantida para compatibilidade)
  const getUrlParams = useCallback(() => {
    return getCurrentRouteState();
  }, [getCurrentRouteState]);

  // Função para atualizar parâmetros da URL (mantida para compatibilidade)
  const updateUrlParams = useCallback((params) => {
    updateParams(params);
  }, [updateParams]);
  
  // Estados de filtro e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Estados de IA e geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [batchGeneration, setBatchGeneration] = useState(false);

  // Unified Prompt Integration
  const [unifiedPromptIntegration, setUnifiedPromptIntegration] = useState(null);

  // Estados de interface
  const [showStats, setShowStats] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  // Inicializar Unified Prompt Integration
  useEffect(() => {
    if (aiProvider && settings?.aiProviders?.[aiProvider]) {
      const providerSettings = settings.aiProviders[aiProvider];
      const aiService = new AIService(aiProvider, providerSettings.apiKey, {
        model: providerSettings.defaultModel,
        temperature: providerSettings.temperature,
        maxTokens: providerSettings.maxTokens
      });
      
      const integration = createUnifiedPromptIntegration(worldData, aiService);
      setUnifiedPromptIntegration(integration);
    }
  }, [aiProvider, settings, worldData]);

  // Sincronizar estado com parâmetros da URL
  useEffect(() => {
    const urlParams = getCurrentRouteState();
    
    // Atualiza aba ativa se diferente da URL
    if (urlParams.tab !== activeTab) {
      setActiveTab(urlParams.tab);
    }
    
    // Atualiza subaba ativa se diferente da URL
    if (urlParams.subTab !== activeSubTab) {
      setActiveSubTab(urlParams.subTab);
    }
    
    // Atualiza modo de visualização se diferente da URL
    if (urlParams.viewMode !== viewMode) {
      setViewMode(urlParams.viewMode);
    }
    
    // Atualiza termo de busca se diferente da URL
    if (urlParams.search !== searchTerm) {
      setSearchTerm(urlParams.search);
    }
    
    // Atualiza filtro se diferente da URL
    if (urlParams.filterType !== filterType) {
      setFilterType(urlParams.filterType);
    }
    
    // Atualiza ordenação se diferente da URL
    if (urlParams.sortBy !== sortBy || urlParams.sortOrder !== sortOrder) {
      setSortBy(urlParams.sortBy);
      setSortOrder(urlParams.sortOrder);
    }
  }, [location.pathname, location.search, getCurrentRouteState, activeTab, activeSubTab, viewMode, searchTerm, filterType, sortBy, sortOrder]);

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
    
    // Navegar para a seção usando o novo sistema
    navigateToSection(tabId, subTabs[0]?.id || '');
  }, [getSubTabs, activeSubTab, navigateToSection]);

  // Função para definir subaba ativa
  const setActiveSubTabWithUrl = useCallback((subTabId) => {
    setActiveSubTab(subTabId);
    navigateToSection(activeTab, subTabId);
  }, [activeTab, navigateToSection]);

  // Função para definir modo de visualização
  const setViewModeWithUrl = useCallback((mode) => {
    setViewMode(mode);
    updateParams({ viewMode: mode });
  }, [updateParams]);

  // Função para definir termo de busca
  const setSearchTermWithUrl = useCallback((term) => {
    setSearchTerm(term);
    updateParams({ search: term });
  }, [updateParams]);

  // Função para definir filtro
  const setFilterTypeWithUrl = useCallback((type) => {
    setFilterType(type);
    updateParams({ filterType: type });
  }, [updateParams]);

  // Função para definir ordenação
  const setSortWithUrl = useCallback((sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    updateParams({ sortBy: sortByValue, sortOrder: sortOrderValue });
  }, [updateParams]);

  // Função para gerar local com IA usando Unified Prompt Integration
  const generateLocation = useCallback(async (type = 'random') => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return null;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await unifiedPromptIntegration.generateLocation(type);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setGenerationProgress(0);
        setIsGenerating(false);
      }, 500);

      if (result) {
        console.log('Local gerado:', result);
        return result;
      }
      
      return null;
    } catch (error) {
      setIsGenerating(false);
      setGenerationProgress(0);
      console.error('Erro na geração:', error);
      toast.error(`Erro ao gerar local: ${error.message}`);
      return null;
    }
  }, [unifiedPromptIntegration]);

  // Função para gerar povo com IA usando Unified Prompt Integration
  const generatePeople = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generatePeople();
      
      if (result) {
        addWorldItem('peoples', result);
        toast.success(`Povo "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar povo:', error);
      toast.error(`Erro ao gerar povo: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar evento com IA usando Unified Prompt Integration
  const generateEvent = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateEvent();
      
      if (result) {
        addWorldItem('events', result);
        toast.success(`Evento "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar evento:', error);
      toast.error(`Erro ao gerar evento: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar sistema de magia com IA usando Unified Prompt Integration
  const generateMagicSystem = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateMagicSystem();
      
      if (result) {
        addWorldItem('magicSystems', result);
        toast.success(`Sistema "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar sistema de magia:', error);
      toast.error(`Erro ao gerar sistema de magia: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função genérica para processar elementos gerados com contexto inteligente
  const processGeneratedElement = useCallback(async (elementType, elementKey) => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return null;
    }

    try {
      const result = await unifiedPromptIntegration.generateSmartElement(elementType, worldData, { volumes, chapters, characters });
      
      if (result) {
        // Verifica se já existe um elemento com o mesmo nome
        const existingElements = worldData?.[elementKey] || [];
        const isDuplicate = existingElements.some(existing => 
          existing.name?.toLowerCase() === result.name?.toLowerCase()
        );
        
        if (isDuplicate) {
          toast.error(`Já existe um ${elementType} com o nome "${result.name}". Tentando gerar novamente...`);
          // Tenta gerar novamente
          return await processGeneratedElement(elementType, elementKey);
        }
        
        addWorldItem(elementKey, result);
        toast.success(`${elementType} "${result.name}" gerado com sucesso!`);
        return result;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao gerar ${elementType}:`, error);
      toast.error(`Erro ao gerar ${elementType}`);
      return null;
    }
  }, [unifiedPromptIntegration, worldData, volumes, chapters, characters, addWorldItem]);

  // Função para gerar idioma com IA
  const generateLanguage = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateLanguage();
      
      if (result) {
        addWorldItem('languages', result);
        toast.success(`Idioma "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar idioma:', error);
      toast.error(`Erro ao gerar idioma: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar religião com IA
  const generateReligion = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateReligion();
      
      if (result) {
        addWorldItem('religions', result);
        toast.success(`Religião "${result.name}" gerada com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar religião:', error);
      toast.error(`Erro ao gerar religião: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar tradição com IA
  const generateTradition = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateTradition();
      
      if (result) {
        addWorldItem('traditions', result);
        toast.success(`Tradição "${result.name}" gerada com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar tradição:', error);
      toast.error(`Erro ao gerar tradição: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar região com IA
  const generateRegion = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateRegion();
      
      if (result) {
        addWorldItem('regions', result);
        toast.success(`Região "${result.name}" gerada com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar região:', error);
      toast.error(`Erro ao gerar região: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar marco com IA
  const generateLandmark = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateLandmark();
      
      if (result) {
        addWorldItem('landmarks', result);
        toast.success(`Marco "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar marco:', error);
      toast.error(`Erro ao gerar marco: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar recurso com IA
  const generateResource = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateResource();
      
      if (result) {
        addWorldItem('resources', result);
        toast.success(`Recurso "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar recurso:', error);
      toast.error(`Erro ao gerar recurso: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar tecnologia com IA
  const generateTechnology = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateTechnology();
      
      if (result) {
        addWorldItem('technologies', result);
        toast.success(`Tecnologia "${result.name}" gerada com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar tecnologia:', error);
      toast.error(`Erro ao gerar tecnologia: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar governo com IA usando Unified Prompt Integration
  const generateGovernment = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateGovernment();
      
      if (result) {
        addWorldItem('governments', result);
        toast.success(`Sistema político "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar governo:', error);
      toast.error(`Erro ao gerar governo: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

  // Função para gerar economia com IA usando Unified Prompt Integration
  const generateEconomy = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateEconomy();
      
      if (result) {
        addWorldItem('economies', result);
        toast.success(`Sistema econômico "${result.name}" gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar economia:', error);
      toast.error(`Erro ao gerar economia: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, addWorldItem]);

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

  // Função para gerar informações básicas com IA usando Unified Prompt Integration
  const handleGenerateBasicInfo = useCallback(async () => {
    if (!unifiedPromptIntegration) {
      toast.error('Sistema de IA não inicializado');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await unifiedPromptIntegration.generateBasicInfo();
      
      if (result) {
        // Atualizar as informações básicas
        updateWorldData({
          name: result.name || worldData?.name || '',
          description: result.description || worldData?.description || '',
          genre: result.genre || worldData?.genre || '',
          techLevel: result.techLevel || worldData?.techLevel || ''
        });
        
        toast.success('Informações básicas geradas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar informações básicas:', error);
      toast.error(`Erro ao gerar informações básicas: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [unifiedPromptIntegration, worldData, updateWorldData]);

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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {typeof location.description === 'string' ? location.description : 'Descrição não disponível'}
                </p>
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
                onClick={() => setActiveTabWithSubTab('geography')}
                className="btn-primary"
              >
                Adicionar Local
              </button>
              <button 
                onClick={() => setActiveTabWithSubTab('cultures')}
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
              onChange={(e) => setSearchTermWithUrl(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterTypeWithUrl(e.target.value)}
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
              setSortWithUrl(field, order);
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
              onClick={() => setViewModeWithUrl('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewModeWithUrl('list')}
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
          {typeof location.description === 'string' ? location.description : 'Descrição não disponível'}
        </p>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-slide-up">
            {location.climate && typeof location.climate === 'string' && (
              <div className="flex items-center text-sm">
                <Sun className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-gray-600">Clima: {location.climate}</span>
              </div>
            )}
            
            {location.population && typeof location.population === 'string' && (
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
                      {typeof point === 'string' ? point : JSON.stringify(point)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Renderizar campos que podem ser objetos */}
            {renderObjectFields(location)}
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
            <p className="text-gray-600 text-sm truncate mt-1">
              {typeof location.description === 'string' ? location.description : 'Descrição não disponível'}
            </p>
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
                {renderDescription(region.description)}
              </p>

              {region.climate && typeof region.climate === 'string' && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Clima:</span>
                  <p className="text-sm text-foreground">{region.climate}</p>
                </div>
              )}

              {region.terrain && typeof region.terrain === 'string' && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Terreno:</span>
                  <p className="text-sm text-foreground">{region.terrain}</p>
                </div>
              )}

              {region.population && typeof region.population === 'string' && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">População:</span>
                  <p className="text-sm text-foreground">{region.population}</p>
                </div>
              )}

              {/* Renderizar campos que podem ser objetos */}
              {renderObjectFields(region)}
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
                {renderDescription(landmark.description)}
              </p>

              {landmark.type && typeof landmark.type === 'string' && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                    {landmark.type}
                  </span>
                </div>
              )}

              {landmark.significance && typeof landmark.significance === 'string' && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Importância:</span>
                  <p className="text-sm text-foreground line-clamp-2">{landmark.significance}</p>
                </div>
              )}

              {landmark.location && typeof landmark.location === 'string' && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Localização:</span>
                  <p className="text-sm text-foreground">{landmark.location}</p>
                </div>
              )}

              {/* Renderizar campos que podem ser objetos */}
              {renderObjectFields(landmark)}
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
                {renderDescription(resource.description)}
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
              onChange={(e) => setSearchTermWithUrl(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterTypeWithUrl(e.target.value)}
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
              setSortWithUrl(field, order);
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
              onClick={() => setViewModeWithUrl('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewModeWithUrl('list')}
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
          {renderDescription(people.description)}
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
                {renderDescription(language.description)}
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
                {renderDescription(religion.description)}
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
                {renderDescription(tradition.description)}
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
                {typeof system.description === 'string' ? system.description : 'Descrição não disponível'}
              </p>

              {system.source && typeof system.source === 'string' && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Fonte:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{system.source}</p>
                </div>
              )}

              {system.limitations && typeof system.limitations === 'string' && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Limitações:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{system.limitations}</p>
                </div>
              )}

              {/* Renderizar campos que podem ser objetos */}
              {system.rules && typeof system.rules === 'string' && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Regras:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">{system.rules}</p>
                </div>
              )}

              {/* Renderizar campos que podem ser objetos */}
              {renderObjectFields(system)}
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
                {renderDescription(tech.description)}
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
                {renderDescription(gov.description)}
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
                {renderDescription(eco.description)}
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
                    <p className="text-gray-600 line-clamp-3">{renderDescription(event.description)}</p>
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
                      setActiveTabWithSubTab('cultures');
                      setActiveSubTabWithUrl('peoples');
                    }}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                  >
                    Adicionar Personagens
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTabWithSubTab('geography');
                      setActiveSubTabWithUrl('locations');
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
        onSubTabChange={setActiveSubTabWithUrl}
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
                    onClick={() => setIsAgentOpen(true)}
                    className="btn-primary flex items-center text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Brain className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Agente IA</span>
                  </button>
              
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

        {/* Componente de teste de navegação */}
        <NavigationTest />
        
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateLocation.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generatePeople.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateMagicSystem.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateEvent.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateLanguage.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateReligion.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateTradition.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateRegion.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateLandmark.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateResource.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateTechnology.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateGovernment.bind(unifiedPromptIntegration) : null}
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
          onGenerateWithAI={unifiedPromptIntegration ? unifiedPromptIntegration.generateEconomy.bind(unifiedPromptIntegration) : null}
        />
      )}

      {/* Agente de IA */}
      <AIAgent
        worldData={worldData}
        projectData={{ volumes, chapters, characters }}
        onGenerateWithContext={generateWithContext}
        onGetInsights={analyzeProject}
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default WorldBuilder;
