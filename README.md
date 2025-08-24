# 🌟 Light Novel Creator Pro

**A ferramenta definitiva para criação de light novels com IA integrada**

Um criador completo e profissional de light novels com editor de texto avançado, integração multi-provedor de IA, geradores inteligentes de mundo, personagens, lore e narrativa.

## ✨ Funcionalidades Principais

### ✍️ Editor de Texto Avançado
- Editor rico com React Quill
- Auto-save automático
- Contagem de palavras e tempo de leitura
- Modo de visualização
- Exportação em múltiplos formatos (TXT, HTML)
- Integração com personagens e locais criados

### 🤖 Integração AI Multi-Provedor
- **Suporte a múltiplos provedores**: OpenAI, Anthropic, Google AI, Groq
- **Configuração avançada**: Temperatura, tokens, modelos personalizáveis
- **Teste de conexão**: Validação automática das API keys
- **Prompts inteligentes**: Templates otimizados para cada tipo de conteúdo
- **Geração contextual**: IA que entende seu mundo e personagens
- **Modelos gratuitos**: Suporte ao Groq com modelos Llama 3 gratuitos

### 👥 Gerador de Personagens
- Criação detalhada de personagens com AI
- Campos para aparência, personalidade, histórico, objetivos
- Sistema de papéis (protagonista, antagonista, etc.)
- Busca e filtros avançados
- Exportação e importação de personagens

### 🌍 Construtor de Mundo
- Criação de locais, culturas, religiões
- Sistemas de magia e tecnologia
- Histórico e geografia do mundo
- Geração com AI para descrições
- Organização por categorias

### 📚 Gerador de Lore
- Mitos, lendas e profecias
- Artefatos e rituais
- Costumes e tradições
- Geração automática com AI
- Sistema de categorização

### 📖 Gerador de Narrativa
- Plot points e arcos de história
- Temas e conflitos
- Resoluções e desenvolvimento
- Tipos de conflito (Homem vs Homem, Homem vs Natureza, etc.)
- Cronologia e consequências

### 📁 Gerenciador de Projetos
- Criação e organização de projetos
- Status de progresso (Planejamento, Em Andamento, Concluído)
- Metas de palavras e cronologia
- Exportação e backup completo
- Filtros e busca avançada

### ⚙️ Configurações Personalizáveis
- Temas (claro, escuro, automático)
- Configurações do editor (fonte, tamanho, verificação ortográfica)
- Configurações de AI
- Backup e restauração de dados
- Preferências de interface

## 🛠️ Tecnologias e Arquitetura

### Frontend
- **React 18** - Interface moderna com hooks avançados
- **React Router 6** - Navegação SPA otimizada
- **Zustand** - Gerenciamento de estado performático
- **Tailwind CSS 3** - Design system profissional
- **React Quill** - Editor WYSIWYG avançado
- **Lucide React** - Biblioteca de ícones consistente

### Integração AI
- **Multi-provider support** - OpenAI, Anthropic, Google, Groq
- **Context management** - Gerenciamento inteligente de contexto
- **Error handling** - Tratamento robusto de erros
- **Rate limiting** - Controle de requisições

### Armazenamento
- **LocalStorage** - Persistência local segura
- **Zustand Persist** - Estado persistente
- **JSON Export/Import** - Backup e restauração
- **React Hot Toast** - Notificações
- **Framer Motion** - Animações

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/light-novel-creator.git
cd light-novel-creator
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   └── Layout/
│       └── Layout.js          # Layout principal com sidebar
├── pages/
│   ├── Dashboard.js           # Página inicial
│   ├── Editor.js              # Editor de texto
│   ├── CharacterGenerator.js  # Gerador de personagens
│   ├── WorldBuilder.js        # Construtor de mundo
│   ├── LoreGenerator.js       # Gerador de lore
│   ├── NarrativeGenerator.js  # Gerador de narrativa
│   ├── AIAssistant.js         # Assistente AI
│   ├── ProjectManager.js      # Gerenciador de projetos
│   └── Settings.js            # Configurações
├── store/
│   └── useStore.js            # Store global com Zustand
├── App.js                     # Componente principal
└── index.js                   # Ponto de entrada
```

## 🔧 Configuração das APIs de IA

### 🤖 OpenAI (Recomendado para iniciantes)
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta e vá para "API Keys"
3. Clique em "Create new secret key"
4. Cole a chave nas Configurações > Integração AI

### ⚡ Groq (Gratuito e Ultra-rápido)
1. Acesse [console.groq.com](https://console.groq.com)
2. Faça login e vá para "API Keys"
3. Crie uma nova chave
4. **Vantagem**: Modelos Llama 3 gratuitos e muito rápidos!

### 🧠 Anthropic Claude (Melhor para textos longos)
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma conta e gere uma API key
3. **Ideal para**: Análises profundas e textos extensos

### 🔍 Google AI (Modelos Gemini)
1. Acesse [ai.google.dev](https://ai.google.dev)
2. Obtenha uma API key gratuita
3. **Destaque**: Contexto muito longo (até 2M tokens)

> 💡 **Dica**: Comece com o Groq (gratuito) ou Google AI para testar, depois considere OpenAI ou Anthropic para uso profissional.

## 🎯 Como Usar

### 1. Criando um Projeto
- Acesse "Projetos" no menu lateral
- Clique em "Novo Projeto"
- Preencha as informações básicas (nome, gênero, público-alvo)
- Defina uma meta de palavras

### 2. Desenvolvendo Personagens
- Vá para "Gerador de Personagens"
- Use o botão "AI" para gerar descrições automaticamente
- Preencha detalhes como aparência, personalidade, objetivos
- Organize por papéis na história

### 3. Construindo o Mundo
- Acesse "Construtor de Mundo"
- Crie locais, culturas e sistemas
- Use a geração com AI para descrições detalhadas
- Organize por categorias (geografia, política, economia)

### 4. Escrevendo a História
- Vá para o "Editor de Texto"
- Use o assistente AI para ideias e sugestões
- Insira referências a personagens e locais criados
- Acompanhe o progresso em tempo real

### 5. Usando o Assistente AI
- Acesse "Assistente AI"
- Use prompts pré-definidos ou faça perguntas personalizadas
- Configure o modelo e temperatura conforme necessário
- Salve conversas importantes

## 🔧 Configuração de AI

Para usar funcionalidades de AI reais, você precisará:

1. Configurar uma API key de um provedor de AI (OpenAI, Anthropic, etc.)
2. Implementar as chamadas de API nos métodos de geração
3. Ajustar os prompts conforme necessário

Atualmente, o projeto usa simulações de AI para demonstração.

## 📊 Recursos de Dados

O projeto salva automaticamente:
- Projetos e configurações
- Personagens e suas características
- Elementos do mundo e lore
- Conversas com AI
- Configurações personalizadas

Todos os dados são salvos localmente no navegador usando localStorage.

## 🚀 Deploy

Para fazer o build de produção:

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `build/`.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se de que está usando Node.js 16+ 
3. Abra uma issue no GitHub com detalhes do problema

## 🎨 Personalização

O projeto é altamente personalizável:

- **Temas**: Modifique as cores no arquivo `tailwind.config.js`
- **Componentes**: Todos os componentes são modulares e reutilizáveis
- **Store**: Adicione novos campos e funcionalidades no `useStore.js`
- **AI**: Implemente novos provedores de AI conforme necessário

## 🔮 Roadmap

- [ ] Integração com APIs de AI reais
- [ ] Sistema de colaboração em tempo real
- [ ] Exportação para formatos de publicação
- [ ] Sistema de versionamento de capítulos
- [ ] Análise de sentimento e feedback
- [ ] Integração com redes sociais
- [ ] App mobile (React Native)

---

**Desenvolvido com ❤️ para escritores de light novels**
