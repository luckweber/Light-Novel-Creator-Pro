import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Brain, MessageCircle, X, Send, Sparkles, Target, BookOpen, Lightbulb, Settings, ChevronUp, ChevronDown, Users, Save, TrendingUp } from 'lucide-react';
import useStore from '../../store/useStore';
import { useAIAgent } from '../../hooks/useAIAgent';
import toast from 'react-hot-toast';

const FloatingAIAgent = () => {
  const { worldData, volumes, chapters, characters, settings } = useStore();
  const aiProvider = settings?.defaultAIProvider || 'openai';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    generateWithContext,
    analyzeProject,
    generateElementPrompt,
    getQualityTips,
    getVolumeInsights
  } = useAIAgent(aiProvider, settings);

  // Generate context for AI responses
  const generateContext = useCallback(() => {
    return {
      worldName: worldData?.name || 'Mundo não definido',
      genre: worldData?.genre || 'Fantasia',
      techLevel: worldData?.techLevel || 'Medieval',
      elements: {
        locations: worldData?.locations?.length || 0,
        peoples: worldData?.peoples?.length || 0,
        regions: worldData?.regions?.length || 0,
        landmarks: worldData?.landmarks?.length || 0,
        resources: worldData?.resources?.length || 0,
        languages: worldData?.languages?.length || 0,
        religions: worldData?.religions?.length || 0,
        traditions: worldData?.traditions?.length || 0,
        technologies: worldData?.technologies?.length || 0,
        governments: worldData?.governments?.length || 0,
        economies: worldData?.economies?.length || 0,
        events: worldData?.events?.length || 0,
        magicSystems: worldData?.magicSystems?.length || 0
      },
      project: {
        volumes: volumes?.length || 0,
        chapters: chapters?.length || 0,
        characters: characters?.length || 0
      }
    };
  }, [worldData, volumes, chapters, characters]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const context = generateContext();
      const hasProject = context.worldName !== 'Mundo não definido' || context.project.volumes > 0;
      
      let welcomeMessage = `Olá! Sou seu assistente de IA especializado em criação de light novels. Posso ajudar você com:

🎯 **Análise de Projeto**: Avaliar coerência e qualidade
📚 **Geração de Conteúdo**: Criar elementos do mundo com contexto
💡 **Insights Inteligentes**: Dicas personalizadas para seu projeto
🔍 **Análise Contextual**: Manter consistência em todo o universo

Como posso ajudar você hoje?`;

      if (hasProject) {
        welcomeMessage += `\n\n📊 **Status do Projeto**: ${context.worldName} (${context.genre}, ${context.techLevel})
📈 **Progresso**: ${context.project.volumes} volumes, ${context.project.chapters} capítulos, ${context.project.characters} personagens
🎯 **Elementos**: ${Object.entries(context.elements).filter(([k, v]) => v > 0).length} tipos de elementos criados`;
      }

      setMessages([
        {
          id: 1,
          type: 'agent',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, generateContext]);

  // Handle quick actions
  const handleQuickAction = useCallback(async (action) => {
    const context = generateContext();
    let prompt = '';
    let actionName = '';

    switch (action) {
      case 'analyze':
        actionName = 'Análise de Projeto';
        prompt = `Analise este projeto de light novel e forneça insights detalhados:

CONTEXTO:
- Mundo: ${context.worldName} (${context.genre}, ${context.techLevel})
- Elementos: ${Object.entries(context.elements).filter(([k, v]) => v > 0).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Projeto: ${context.project.volumes} volumes, ${context.project.chapters} capítulos, ${context.project.characters} personagens

Forneça:
1. Análise de coerência (1-10)
2. Pontos fortes e fracos
3. Sugestões de melhoria
4. Próximos passos recomendados
5. Análise de mercado e público-alvo
6. Comparação com obras similares

Formato: Resposta estruturada e detalhada.`;
        break;

      case 'generate_element':
        actionName = 'Gerar Elemento';
        prompt = `Com base no contexto do projeto "${context.worldName}", sugira qual elemento seria mais útil gerar agora:

ELEMENTOS EXISTENTES:
${Object.entries(context.elements).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

ANÁLISE DE PRIORIDADE:
1. Sugira 3 elementos prioritários para desenvolvimento
2. Explique por que cada um seria importante para o projeto
3. Forneça um prompt específico para gerar o elemento mais prioritário
4. Sugira conexões com elementos existentes

Formato: Análise detalhada com prompt pronto para uso.`;
        break;

      case 'quality_tips':
        actionName = 'Dicas de Qualidade';
        prompt = `Forneça dicas específicas de qualidade para este projeto:

CONTEXTO: ${context.worldName} - ${context.genre} ${context.techLevel}

Foque em:
- Estrutura narrativa e arcos de história
- Desenvolvimento de personagens e arcos de personagem
- Consistência do mundo e regras internas
- Técnicas de escrita e estilo narrativo
- Pacing, ritmo e tensão
- Diálogos e desenvolvimento de voz dos personagens
- Descrições e imersão do leitor
- Foreshadowing e revelações

Forneça 8 dicas práticas e específicas, com exemplos quando possível.`;
        break;

      case 'volume_insights':
        actionName = 'Insights para Volumes';
        prompt = `Analise a estrutura de volumes e capítulos deste projeto:

ESTRUTURA ATUAL:
- Volumes: ${context.project.volumes}
- Capítulos: ${context.project.chapters}
- Personagens: ${context.project.characters}

Forneça insights sobre:
- Estrutura narrativa ideal para o gênero
- Desenvolvimento de arcos principais e secundários
- Pacing entre volumes e capítulos
- Elementos do mundo a explorar em cada volume
- Pontos de tensão e clímax
- Desenvolvimento de personagens ao longo da série
- Estratégias de engajamento do leitor
- Preparação para volumes futuros

Seja específico, prático e considere o gênero ${context.genre}.`;
        break;

      case 'market_analysis':
        actionName = 'Análise de Mercado';
        prompt = `Forneça uma análise de mercado para este projeto de light novel:

CONTEXTO: ${context.worldName} - ${context.genre} ${context.techLevel}

Analise:
1. Público-alvo e demografia
2. Tendências atuais do mercado
3. Obras similares e competição
4. Pontos de diferenciação
5. Estratégias de marketing
6. Plataformas de publicação
7. Monetização e receitas
8. Crescimento de audiência

Forneça insights práticos e estratégicos.`;
        break;

      case 'character_development':
        actionName = 'Desenvolvimento de Personagens';
        prompt = `Analise o desenvolvimento de personagens para este projeto:

CONTEXTO: ${context.worldName} - ${context.genre} ${context.techLevel}
PERSONAGENS: ${context.project.characters} personagens criados

Foque em:
1. Arcos de personagem principais e secundários
2. Desenvolvimento de motivações e conflitos
3. Relacionamentos e dinâmicas entre personagens
4. Evolução ao longo da história
5. Voz única para cada personagem
6. Backstories e desenvolvimento de história
7. Conflitos internos e externos
8. Satisfação do leitor com os personagens

Forneça estratégias específicas e exemplos práticos.`;
        break;

      default:
        return;
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `Executar: ${actionName}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await generateWithContext(prompt, context);
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      toast.success(`${actionName} concluída!`);
    } catch (error) {
      console.error('Erro na ação:', error);
      toast.error('Erro ao executar ação');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [generateContext, generateWithContext]);

  // Handle chat message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const context = generateContext();
      const enhancedPrompt = `Como assistente especializado em criação de light novels, responda à seguinte pergunta do usuário:

PERGUNTA: ${inputMessage}

CONTEXTO DO PROJETO:
- Mundo: ${context.worldName} (${context.genre}, ${context.techLevel})
- Elementos: ${Object.entries(context.elements).filter(([k, v]) => v > 0).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Projeto: ${context.project.volumes} volumes, ${context.project.chapters} capítulos, ${context.project.characters} personagens

Forneça uma resposta útil, específica e contextualizada para o projeto do usuário. Seja detalhado e prático.`;

      const response = await generateWithContext(enhancedPrompt, context);
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      toast.error('Erro ao processar mensagem');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping, generateContext, generateWithContext]);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Save conversation to localStorage
  const saveConversation = useCallback(() => {
    if (messages.length > 1) {
      const conversation = {
        id: Date.now(),
        timestamp: new Date(),
        messages: messages,
        projectContext: generateContext()
      };
      
      const savedConversations = JSON.parse(localStorage.getItem('aiAgentConversations') || '[]');
      savedConversations.unshift(conversation);
      
      // Keep only last 10 conversations
      const trimmedConversations = savedConversations.slice(0, 10);
      localStorage.setItem('aiAgentConversations', JSON.stringify(trimmedConversations));
      setConversationHistory(trimmedConversations);
      
      toast.success('Conversa salva!');
    }
  }, [messages, generateContext]);

  // Load conversation from localStorage
  const loadConversation = useCallback((conversation) => {
    setMessages(conversation.messages);
    toast.success('Conversa carregada!');
  }, []);

  // Load saved conversations on mount
  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem('aiAgentConversations') || '[]');
    setConversationHistory(savedConversations);
  }, []);

  // Auto-suggestions based on project changes
  const generateAutoSuggestions = useCallback(async () => {
    const context = generateContext();
    const hasProject = context.worldName !== 'Mundo não definido' || context.project.volumes > 0;
    
    if (!hasProject || isTyping) return;

    try {
      const suggestionPrompt = `Com base no estado atual do projeto "${context.worldName}", forneça 2-3 sugestões específicas e práticas para o próximo passo:

CONTEXTO ATUAL:
- Elementos criados: ${Object.entries(context.elements).filter(([k, v]) => v > 0).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Progresso: ${context.project.volumes} volumes, ${context.project.chapters} capítulos, ${context.project.characters} personagens

Forneça sugestões específicas como:
- "Considere criar mais [tipo de elemento] para expandir [aspecto do mundo]"
- "Seria útil desenvolver [aspecto] para melhorar [qualidade]"
- "Próximo passo recomendado: [ação específica]"

Seja conciso e prático.`;

      const suggestions = await generateWithContext(suggestionPrompt, context);
      
      // Only add if not already in messages
      const hasSuggestions = messages.some(msg => msg.content.includes('Sugestões automáticas'));
      if (!hasSuggestions) {
        const suggestionMessage = {
          id: Date.now(),
          type: 'agent',
          content: `🤖 **Sugestões automáticas para seu projeto:**

${suggestions}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Erro ao gerar sugestões automáticas:', error);
    }
  }, [generateContext, generateWithContext, messages, isTyping]);

  // Generate auto-suggestions when project changes significantly
  useEffect(() => {
    const context = generateContext();
    const hasProject = context.worldName !== 'Mundo não definido' || context.project.volumes > 0;
    
    if (hasProject && isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const timeSinceLastMessage = Date.now() - lastMessage.timestamp.getTime();
      
      // Generate suggestions if no recent activity (5 minutes)
      if (timeSinceLastMessage > 5 * 60 * 1000) {
        generateAutoSuggestions();
      }
    }
  }, [worldData, volumes, chapters, characters, isOpen, messages, generateAutoSuggestions, generateContext]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Abrir Assistente de IA"
        >
          <Brain className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-96 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">Assistente IA</span>
              {isTyping && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-white/80">
                {messages.length > 1 ? `${messages.length - 1} mensagens` : 'Novo'}
              </div>
              {messages.length > 1 && (
                <button
                  onClick={saveConversation}
                  className="text-white/80 hover:text-white"
                  title="Salvar Conversa"
                >
                  <Save className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
                title="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickAction('analyze')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                  title="Análise Completa do Projeto"
                >
                  <Target className="h-3 w-3" />
                  <span>Analisar</span>
                </button>
                <button
                  onClick={() => handleQuickAction('generate_element')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                  title="Sugerir Elementos"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Gerar</span>
                </button>
                <button
                  onClick={() => handleQuickAction('quality_tips')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors disabled:opacity-50"
                  title="Dicas de Qualidade"
                >
                  <Lightbulb className="h-3 w-3" />
                  <span>Dicas</span>
                </button>
                <button
                  onClick={() => handleQuickAction('volume_insights')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50"
                  title="Insights para Volumes"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Volumes</span>
                </button>
                <button
                  onClick={() => handleQuickAction('market_analysis')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors disabled:opacity-50"
                  title="Análise de Mercado"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>Mercado</span>
                </button>
                <button
                  onClick={() => handleQuickAction('character_development')}
                  disabled={isTyping}
                  className="flex items-center justify-center space-x-1 px-2 py-2 text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors disabled:opacity-50"
                  title="Desenvolvimento de Personagens"
                >
                  <Users className="h-3 w-3" />
                  <span>Personagens</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingAIAgent;
