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

const AIAssistant = () => {
  const { 
    aiConversations, 
    addAIConversation, 
    aiSettings, 
    updateAISettings,
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
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date().toISOString()
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

  const generateAIResponse = async (prompt) => {
    // Simulate AI response based on prompt content
    const responses = {
      'personagem': 'Aqui está uma sugestão para um personagem interessante: Um jovem artesão que descobriu que pode dar vida aos objetos que cria, mas cada criação consome um pouco de sua própria vitalidade. Ele deve equilibrar seu dom com o custo pessoal.',
      'mundo': 'Para um mundo fantástico, considere: Um continente flutuante onde as ilhas são conectadas por pontes de cristal que mudam de cor conforme a estação. A magia é alimentada pela luz solar refletida nessas pontes.',
      'narrativa': 'Um plot twist interessante seria: O mentor do protagonista revela que na verdade é uma versão futura do próprio protagonista, que voltou no tempo para evitar um erro trágico que ainda não aconteceu.',
      'lore': 'Uma lenda antiga: Os primeiros habitantes do mundo eram feitos de luz pura, mas ao descobrir a escuridão, alguns escolheram abraçá-la, criando a primeira divisão entre os povos da luz e das sombras.'
    };

    // Simple keyword matching
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('personagem')) return responses.personagem;
    if (lowerPrompt.includes('mundo') || lowerPrompt.includes('cidade')) return responses.mundo;
    if (lowerPrompt.includes('narrativa') || lowerPrompt.includes('plot')) return responses.narrativa;
    if (lowerPrompt.includes('lore') || lowerPrompt.includes('lenda')) return responses.lore;

    return 'Entendo sua solicitação. Posso ajudar com desenvolvimento de personagens, criação de mundo, elementos narrativos e lore. Que aspecto específico você gostaria de explorar?';
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
      toast.success('Chat limpo!');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const renderChat = () => (
    <div className="flex flex-col h-[600px]">
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
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.type === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="text-xs opacity-70 hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
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
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configurações do AI
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <select
              value={aiSettings.model}
              onChange={(e) => updateAISettings({ model: e.target.value })}
              className="input-field"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude-3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura: {aiSettings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiSettings.temperature}
              onChange={(e) => updateAISettings({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mais Focado</span>
              <span>Mais Criativo</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Tokens
            </label>
            <input
              type="number"
              value={aiSettings.maxTokens}
              onChange={(e) => updateAISettings({ maxTokens: parseInt(e.target.value) })}
              className="input-field"
              min="100"
              max="4000"
            />
          </div>
        </div>
      </div>

      <div className="card">
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
