import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Settings, 
  Save, 
  Download,
  Upload,
  MessageSquare,
  Lightbulb,
  BookOpen,
  Users,
  Globe,
  FileText,
  Target,
  Heart,
  Zap,
  Clock,
  Star,
  Copy,
  Trash2
} from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { AIService, AI_PROMPTS, AI_PROVIDERS, getBestModelForTask } from '../utils/aiProviders';

const AIAssistant = () => {
  const { 
    aiConversations, 
    addAIConversation, 
    aiSettings, 
    updateAISettings,
    settings,
    updateSettings,
    characters,
    worldData,
    loreData,
    narrativeData
  } = useStore();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [currentProvider, setCurrentProvider] = useState(settings.defaultAIProvider || 'openai');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastConversationLoaded, setLastConversationLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'prompts', label: 'Prompts', icon: Lightbulb },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const quickPrompts = [
    {
      category: 'Personagens',
      icon: Users,
      prompts: [
        'Crie um personagem principal com backstory detalhado',
        'Desenvolva um antagonista complexo',
        'Gere diálogo entre dois personagens',
        'Crie um arco de desenvolvimento para um personagem'
      ]
    },
    {
      category: 'Mundo',
      icon: Globe,
      prompts: [
        'Descreva uma cidade fantástica',
        'Crie um sistema de magia único',
        'Desenvolva uma cultura com costumes interessantes',
        'Gere a história de um reino'
      ]
    },
    {
      category: 'Narrativa',
      icon: FileText,
      prompts: [
        'Crie um plot twist surpreendente',
        'Desenvolva uma cena de ação emocionante',
        'Gere um conflito interno para o protagonista',
        'Crie um final satisfatório para um arco'
      ]
    },
    {
      category: 'Lore',
      icon: BookOpen,
      prompts: [
        'Crie uma lenda antiga',
        'Desenvolva um mito de criação',
        'Gere uma profecia misteriosa',
        'Crie um artefato lendário'
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Carregar última conversa ao entrar na página
  useEffect(() => {
    if (aiConversations.length > 0 && !lastConversationLoaded && settings.autoLoadLastConversation) {
      const lastConversation = aiConversations[aiConversations.length - 1];
      setMessages(lastConversation.messages || []);
      setLastConversationLoaded(true);
      toast.success(`Última conversa carregada: "${lastConversation.title}"`);
    }
  }, [aiConversations, lastConversationLoaded, settings.autoLoadLastConversation]); // Executar quando aiConversations mudar

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = await generateAIResponse(inputMessage);
      
      // Determinar o tipo de ação baseado no prompt
      const actionType = determineActionType(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        actionType: actionType // Adicionar tipo de ação
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save conversation
      addAIConversation({
        title: inputMessage.substring(0, 50) + '...',
        messages: [...messages, userMessage, botMessage],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      toast.error('Erro ao gerar resposta');
    } finally {
      setIsTyping(false);
    }
  };

  const determineActionType = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('personagem') || lowerPrompt.includes('character')) {
      return 'character';
    } else if (lowerPrompt.includes('cidade') || lowerPrompt.includes('localização') || 
               lowerPrompt.includes('location') || lowerPrompt.includes('mundo') || 
               lowerPrompt.includes('world') || lowerPrompt.includes('cultura') || 
               lowerPrompt.includes('culture')) {
      return 'world';
    } else if (lowerPrompt.includes('lenda') || lowerPrompt.includes('mito') || 
               lowerPrompt.includes('legend') || lowerPrompt.includes('myth') || 
               lowerPrompt.includes('lore')) {
      return 'lore';
    } else if (lowerPrompt.includes('enredo') || lowerPrompt.includes('plot') || 
               lowerPrompt.includes('narrativa') || lowerPrompt.includes('story')) {
      return 'narrative';
    }
    
    return null;
  };

  const handleIncorporateToProject = async (message, actionType) => {
    try {
      if (!actionType) {
        toast.error('Tipo de ação não identificado');
        return;
      }

      // Extrair dados estruturados da resposta da IA
      const structuredData = await extractStructuredData(message.content, actionType);
      
      if (!structuredData) {
        toast.error('Não foi possível extrair dados estruturados da resposta');
        return;
      }

      // Incorporar no projeto baseado no tipo
      switch (actionType) {
        case 'character':
          await incorporateCharacter(structuredData);
          break;
        case 'world':
          await incorporateWorldElement(structuredData);
          break;
        case 'lore':
          await incorporateLore(structuredData);
          break;
        case 'narrative':
          await incorporateNarrative(structuredData);
          break;
        default:
          toast.error('Tipo de ação não suportado');
      }

      const categoryNames = {
        'character': 'Personagens',
        'world': 'Mundo',
        'lore': 'Lore',
        'narrative': 'Narrativa'
      };
      
      toast.success(`Elemento incorporado ao ${categoryNames[actionType]} com sucesso!`);
    } catch (error) {
      console.error('Erro ao incorporar ao projeto:', error);
      toast.error('Erro ao incorporar ao projeto');
    }
  };

  const extractStructuredData = async (content, actionType) => {
    try {
      // Usar IA para extrair dados estruturados da resposta
      const extractionPrompt = `Extraia dados estruturados do seguinte texto e retorne apenas um JSON válido:

${content}

Para ${actionType === 'character' ? 'personagem' : actionType === 'world' ? 'elemento do mundo' : actionType === 'lore' ? 'lore' : 'narrativa'}, extraia:
${actionType === 'character' ? `
- name: nome do personagem
- description: descrição física e personalidade
- background: história de fundo
- personality: traços de personalidade
- goals: objetivos
- relationships: relacionamentos
- abilities: habilidades especiais` : actionType === 'world' ? `
- name: nome da localização/cultura
- type: tipo (cidade, reino, cultura, etc.)
- description: descrição detalhada
- location: localização geográfica
- population: população
- culture: aspectos culturais
- history: história` : actionType === 'lore' ? `
- title: título da lenda/mito
- type: tipo (lenda, mito, profecia, etc.)
- content: conteúdo completo
- origin: origem
- significance: significado` : `
- title: título do enredo
- type: tipo (plot, cena, diálogo, etc.)
- content: conteúdo
- characters: personagens envolvidos
- setting: cenário`}

Retorne apenas o JSON, sem texto adicional.`;

      const aiService = new AIService(currentProvider, settings.aiProviders[currentProvider].apiKey, {
        temperature: 0.3,
        maxTokens: 1000
      });

      const response = await aiService.generateText(extractionPrompt, {
        model: settings.aiProviders[currentProvider].defaultModel
      });

      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return null;
    } catch (error) {
      console.error('Erro ao extrair dados estruturados:', error);
      return null;
    }
  };

  const incorporateCharacter = async (characterData) => {
    const { addCharacter } = useStore.getState();
    
    const newCharacter = {
      id: Date.now().toString(),
      name: characterData.name || 'Novo Personagem',
      description: characterData.description || '',
      background: characterData.background || '',
      personality: characterData.personality || '',
      goals: characterData.goals || '',
      relationships: characterData.relationships || '',
      abilities: characterData.abilities || '',
      appearance: '',
      role: 'supporting',
      status: 'alive',
      createdAt: new Date().toISOString()
    };

    addCharacter(newCharacter);
  };

  const incorporateWorldElement = async (worldData) => {
    const { addWorldItem } = useStore.getState();
    
    // Determinar o tipo de elemento baseado no conteúdo
    let category = 'locations'; // padrão
    
    if (worldData.type) {
      // Mapear tipos para categorias do worldData
      const typeMapping = {
        'cidade': 'locations',
        'city': 'locations',
        'reino': 'regions',
        'kingdom': 'regions',
        'cultura': 'peoples',
        'culture': 'peoples',
        'religião': 'religions',
        'religion': 'religions',
        'idioma': 'languages',
        'language': 'languages',
        'tradição': 'traditions',
        'tradition': 'traditions',
        'sistema de magia': 'magicSystems',
        'magic system': 'magicSystems',
        'tecnologia': 'technologies',
        'technology': 'technologies',
        'governo': 'governments',
        'government': 'governments',
        'economia': 'economies',
        'economy': 'economies',
        'evento': 'events',
        'event': 'events',
        'era': 'eras'
      };
      
      const lowerType = worldData.type.toLowerCase();
      category = typeMapping[lowerType] || 'locations';
    }
    
    const newElement = {
      name: worldData.name || 'Novo Elemento',
      type: worldData.type || 'location',
      description: worldData.description || '',
      location: worldData.location || '',
      population: worldData.population || '',
      culture: worldData.culture || '',
      history: worldData.history || '',
      details: worldData.content || worldData.description || '',
      createdAt: new Date().toISOString()
    };

    // Usar addWorldItem que já existe no store
    addWorldItem(category, newElement);
  };

  const incorporateLore = async (loreData) => {
    const { addLoreItem } = useStore.getState();
    
    // Determinar a categoria baseada no tipo
    let category = 'myths'; // padrão
    
    if (loreData.type) {
      const typeMapping = {
        'lenda': 'legends',
        'legend': 'legends',
        'mito': 'myths',
        'myth': 'myths',
        'profecia': 'prophecies',
        'prophecy': 'prophecies',
        'artefato': 'artifacts',
        'artifact': 'artifacts',
        'ritual': 'rituals',
        'costume': 'customs'
      };
      
      const lowerType = loreData.type.toLowerCase();
      category = typeMapping[lowerType] || 'myths';
    }
    
    const newLore = {
      title: loreData.title || 'Nova Lenda',
      type: loreData.type || 'legend',
      content: loreData.content || '',
      origin: loreData.origin || '',
      significance: loreData.significance || '',
      description: loreData.description || loreData.content || '',
      createdAt: new Date().toISOString()
    };

    // Usar addLoreItem que já existe no store
    addLoreItem(category, newLore);
  };

  const incorporateNarrative = async (narrativeData) => {
    const { addNarrativeItem } = useStore.getState();
    
    // Determinar a categoria baseada no tipo
    let category = 'plotPoints'; // padrão
    
    if (narrativeData.type) {
      const typeMapping = {
        'plot': 'plotPoints',
        'enredo': 'plotPoints',
        'arco': 'storyArcs',
        'arc': 'storyArcs',
        'tema': 'themes',
        'theme': 'themes',
        'conflito': 'conflicts',
        'conflict': 'conflicts',
        'resolução': 'resolutions',
        'resolution': 'resolutions',
        'diálogo': 'plotPoints',
        'dialogue': 'plotPoints',
        'cena': 'plotPoints',
        'scene': 'plotPoints'
      };
      
      const lowerType = narrativeData.type.toLowerCase();
      category = typeMapping[lowerType] || 'plotPoints';
    }
    
    const newNarrative = {
      title: narrativeData.title || 'Novo Enredo',
      type: narrativeData.type || 'plot',
      content: narrativeData.content || '',
      characters: narrativeData.characters || '',
      setting: narrativeData.setting || '',
      description: narrativeData.description || narrativeData.content || '',
      createdAt: new Date().toISOString()
    };

    // Usar addNarrativeItem que já existe no store
    addNarrativeItem(category, newNarrative);
  };

  const generateAIResponse = async (prompt) => {
    try {
      // Verificar se aiProviders existe nas settings (como no CharacterGenerator)
      if (!settings.aiProviders) {
        throw new Error('Configuração de IA não encontrada. Configure nas configurações gerais.');
      }
      
      // Verificar se há configuração de IA
      const providerConfig = settings.aiProviders[currentProvider];
      if (!providerConfig || !providerConfig.apiKey || !providerConfig.enabled) {
        throw new Error('Provedor de IA não configurado ou desabilitado');
      }

      // Criar contexto do projeto
      const projectContext = buildProjectContext();
      
      // Preparar prompt com contexto
      const enhancedPrompt = `${prompt}

${projectContext ? `CONTEXTO DO PROJETO:
${projectContext}` : ''}

Por favor, responda de forma detalhada e criativa, considerando o contexto fornecido.`;

      // Criar serviço de IA
      const aiService = new AIService(currentProvider, providerConfig.apiKey, {
        temperature: providerConfig.temperature || 0.7,
        maxTokens: providerConfig.maxTokens || 2000
      });

      // Obter melhor modelo para a tarefa
      const model = getBestModelForTask(currentProvider, 'creative_writing');
      
      // Gerar resposta
      const response = await aiService.generateText(enhancedPrompt, {
        model: providerConfig.defaultModel || model
      });

      return response;
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      throw new Error(`Erro na IA: ${error.message}`);
    }
  };

  const buildProjectContext = () => {
    const context = [];
    
    // Adicionar informações do mundo
    if (worldData.name) {
      context.push(`Mundo: ${worldData.name}`);
      if (worldData.description) context.push(`Descrição: ${worldData.description}`);
      if (worldData.genre) context.push(`Gênero: ${worldData.genre}`);
    }
    
    // Adicionar personagens principais
    if (characters.length > 0) {
      const mainCharacters = characters.slice(0, 3);
      context.push(`Personagens principais: ${mainCharacters.map(c => c.name).join(', ')}`);
    }
    
    // Adicionar elementos de lore
    if (loreData.myths.length > 0) {
      context.push(`Mitos conhecidos: ${loreData.myths.length} mitos`);
    }
    
    return context.length > 0 ? context.join('\n') : null;
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    setActiveTab('chat');
  };

  const handleSaveConversation = () => {
    if (messages.length > 0) {
      addAIConversation({
        title: `Conversa ${new Date().toLocaleString()}`,
        messages: messages,
        timestamp: new Date().toISOString()
      });
      toast.success('Conversa salva!');
    }
  };

  const handleLoadConversation = (conversation) => {
    setMessages(conversation.messages);
    toast.success('Conversa carregada!');
  };

  const handleClearChat = () => {
    if (window.confirm('Tem certeza que deseja limpar o chat?')) {
      setMessages([]);
      setLastConversationLoaded(false);
      toast.success('Chat limpo!');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const testConnection = async () => {
    // Verificar se aiProviders existe nas settings (como no CharacterGenerator)
    if (!settings.aiProviders) {
      toast.error('Configuração de IA não encontrada. Configure nas configurações gerais.');
      return;
    }
    
    const providerConfig = settings.aiProviders[currentProvider];
    if (!providerConfig || !providerConfig.apiKey) {
      toast.error('API Key não configurada');
      return;
    }

    setConnectionStatus('testing');
    try {
      const model = getBestModelForTask(currentProvider, 'fast_generation');
      const result = await AIService.testConnection(currentProvider, providerConfig.apiKey, model);
      
      if (result.success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        toast.success('Conexão com IA estabelecida!');
      } else {
        setIsConnected(false);
        setConnectionStatus('error');
        toast.error(`Erro na conexão: ${result.error}`);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('error');
      toast.error('Erro ao testar conexão');
    }
  };

  const handleProviderChange = (provider) => {
    setCurrentProvider(provider);
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'testing': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Conectado';
      case 'testing': return 'Testando...';
      case 'error': return 'Erro';
      default: return 'Desconectado';
    }
  };

  const getActionTypeLabel = (actionType) => {
    switch (actionType) {
      case 'character': return 'Personagem';
      case 'world': return 'Mundo';
      case 'lore': return 'Lore';
      case 'narrative': return 'Narrativa';
      default: return 'Projeto';
    }
  };

  const getActionTypeIcon = (actionType) => {
    switch (actionType) {
      case 'character': return <Users className="h-3 w-3 mr-1" />;
      case 'world': return <Globe className="h-3 w-3 mr-1" />;
      case 'lore': return <BookOpen className="h-3 w-3 mr-1" />;
      case 'narrative': return <FileText className="h-3 w-3 mr-1" />;
      default: return <Save className="h-3 w-3 mr-1" />;
    }
  };

  const renderChat = () => (
    <div className="flex flex-col h-[600px]">
      {/* Header with Connection Status */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Assistente AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor().replace('text-', 'bg-')}`}></div>
              <span className={`text-sm ${getConnectionStatusColor()}`}>
                {getConnectionStatusText()}
              </span>
              {lastConversationLoaded && messages.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Última conversa carregada</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={currentProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {Object.keys(AI_PROVIDERS).map(provider => (
                <option key={provider} value={provider}>
                  {AI_PROVIDERS[provider].name}
                </option>
              ))}
            </select>
            <button
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {connectionStatus === 'testing' ? 'Testando...' : 'Testar'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bem-vindo ao Assistente AI
            </h3>
            <p className="text-gray-500">
              Peça ajuda com personagens, mundo, narrativa ou lore
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                             <div
                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                   message.type === 'user'
                     ? 'bg-primary-600 text-white'
                     : 'bg-gray-100 text-gray-900'
                 }`}
               >
                 <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                 <div className="flex items-center justify-between mt-2">
                   <span className="text-xs opacity-70">
                     {new Date(message.timestamp).toLocaleTimeString()}
                   </span>
                   {message.type === 'bot' && (
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => copyToClipboard(message.content)}
                         className="text-xs opacity-70 hover:opacity-100"
                         title="Copiar resposta"
                       >
                         <Copy className="h-3 w-3" />
                       </button>
                       {message.actionType && (
                         <button
                           onClick={() => handleIncorporateToProject(message, message.actionType)}
                           className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                           title={`Incorporar ao ${getActionTypeLabel(message.actionType)}`}
                         >
                           {getActionTypeIcon(message.actionType)}
                           {getActionTypeLabel(message.actionType)}
                         </button>
                       )}
                     </div>
                   )}
                 </div>
               </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="animate-pulse">●</div>
                <div className="animate-pulse delay-100">●</div>
                <div className="animate-pulse delay-200">●</div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 input-field"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !inputMessage.trim()}
            className="btn-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrompts = () => (
    <div className="space-y-6">
             {/* Advanced AI Prompts */}
       <div className="card">
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-gray-900">
             Prompts Avançados da IA
           </h3>
           <div className="flex items-center space-x-2 text-sm text-blue-600">
             <Sparkles className="h-4 w-4" />
             <span>Respostas podem ser incorporadas automaticamente ao projeto</span>
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Personagens</h4>
            <div className="space-y-2">
                             <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.character.basic)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar personagem básico - será adicionado automaticamente ao CharacterGenerator"
               >
                 Criar Personagem Básico
               </button>
               <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.character.detailed)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar personagem detalhado - será adicionado automaticamente ao CharacterGenerator"
               >
                 Criar Personagem Detalhado
               </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Mundo</h4>
            <div className="space-y-2">
                             <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.world.location)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar localização - será adicionada automaticamente ao WorldBuilder"
               >
                 Criar Localização
               </button>
               <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.world.culture)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar cultura/civilização - será adicionada automaticamente ao WorldBuilder"
               >
                 Criar Cultura/Civilização
               </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Narrativa</h4>
            <div className="space-y-2">
                             <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.story.plot)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Gerar ponto de enredo - será adicionado automaticamente à seção de narrativa"
               >
                 Gerar Ponto de Enredo
               </button>
               <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.story.dialogue)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar diálogo - será adicionado automaticamente à seção de narrativa"
               >
                 Criar Diálogo
               </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Lore</h4>
            <div className="space-y-2">
                             <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.lore.legend)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar lenda - será adicionada automaticamente à seção de lore"
               >
                 Criar Lenda
               </button>
               <button
                 onClick={() => handleQuickPrompt(AI_PROMPTS.lore.artifact)}
                 className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300"
                 title="Criar artefato - será adicionado automaticamente à seção de lore"
               >
                 Criar Artefato
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickPrompts.map((category) => (
          <div key={category.category} className="card">
            <div className="flex items-center mb-4">
              <category.icon className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {category.category}
              </h3>
            </div>
            <div className="space-y-2">
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* AI Providers Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Provedores de IA
        </h3>
                 <div className="space-y-4">
           {Object.keys(AI_PROVIDERS).map(provider => {
             const providerConfig = settings.aiProviders?.[provider];
             const isEnabled = providerConfig?.enabled || false;
            
            return (
              <div key={provider} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                                             onChange={(e) => {
                         const newSettings = {
                           ...settings,
                           aiProviders: {
                             ...settings.aiProviders,
                             [provider]: {
                               ...settings.aiProviders[provider],
                               enabled: e.target.checked
                             }
                           }
                         };
                         updateSettings(newSettings);
                       }}
                      className="rounded"
                    />
                    <span className="font-medium">{AI_PROVIDERS[provider].name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{AI_PROVIDERS[provider].description}</span>
                </div>
                
                {isEnabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={providerConfig?.apiKey || ''}
                                                 onChange={(e) => {
                           const newSettings = {
                             ...settings,
                             aiProviders: {
                               ...settings.aiProviders,
                               [provider]: {
                                 ...settings.aiProviders[provider],
                                 apiKey: e.target.value
                               }
                             }
                           };
                           updateSettings(newSettings);
                         }}
                        placeholder={`Ex: ${AI_PROVIDERS[provider].keyFormat}`}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo Padrão
                      </label>
                      <select
                        value={providerConfig?.defaultModel || Object.keys(AI_PROVIDERS[provider].models)[0]}
                                                 onChange={(e) => {
                           const newSettings = {
                             ...settings,
                             aiProviders: {
                               ...settings.aiProviders,
                               [provider]: {
                                 ...settings.aiProviders[provider],
                                 defaultModel: e.target.value
                               }
                             }
                           };
                           updateSettings(newSettings);
                         }}
                        className="input-field"
                      >
                        {Object.keys(AI_PROVIDERS[provider].models).map(model => (
                          <option key={model} value={model}>
                            {AI_PROVIDERS[provider].models[model].name} 
                            ({AI_PROVIDERS[provider].models[model].cost})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperatura: {providerConfig?.temperature || 0.7}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={providerConfig?.temperature || 0.7}
                                                 onChange={(e) => {
                           const newSettings = {
                             ...settings,
                             aiProviders: {
                               ...settings.aiProviders,
                               [provider]: {
                                 ...settings.aiProviders[provider],
                                 temperature: parseFloat(e.target.value)
                               }
                             }
                           };
                           updateSettings(newSettings);
                         }}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Máximo de Tokens
                      </label>
                      <input
                        type="number"
                        value={providerConfig?.maxTokens || 2000}
                                                 onChange={(e) => {
                           const newSettings = {
                             ...settings,
                             aiProviders: {
                               ...settings.aiProviders,
                               [provider]: {
                                 ...settings.aiProviders[provider],
                                 maxTokens: parseInt(e.target.value)
                               }
                             }
                           };
                           updateSettings(newSettings);
                         }}
                        className="input-field"
                        min="100"
                        max="8000"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setCurrentProvider(provider);
                          testConnection();
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Testar Conexão
                      </button>
                      <a
                        href={AI_PROVIDERS[provider].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Obter API Key
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configurações do Chat
        </h3>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Carregar última conversa automaticamente
              </label>
              <p className="text-xs text-gray-500">
                Ao entrar na página, carrega automaticamente a conversa mais recente
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoLoadLastConversation}
              onChange={(e) => {
                const newSettings = {
                  ...settings,
                  autoLoadLastConversation: e.target.checked
                };
                updateSettings(newSettings);
              }}
              className="rounded"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversas Salvas
        </h3>
        <div className="space-y-2">
          {aiConversations.slice(-5).reverse().map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {conversation.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(conversation.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLoadConversation(conversation)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Carregar
                </button>
                <button
                  onClick={() => copyToClipboard(conversation.messages.map(m => `${m.type}: ${m.content}`).join('\n'))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return renderChat();
      case 'prompts':
        return renderPrompts();
      case 'settings':
        return renderSettings();
      default:
        return renderChat();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assistente AI</h1>
          <p className="text-gray-600 mt-2">
            Seu parceiro criativo para desenvolvimento de light novels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveConversation}
            className="btn-outline flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </button>
          <button
            onClick={handleClearChat}
            className="btn-outline flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="card">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AIAssistant;
