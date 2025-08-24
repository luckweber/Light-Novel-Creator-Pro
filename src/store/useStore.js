import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Projetos
      projects: [],
      currentProject: null,
      
      // Editor
      editorContent: '',
      editorHistory: [],
      currentChapter: null,
      
      // Mundo
      worldData: {
        name: '',
        description: '',
        locations: [],
        cultures: [],
        religions: [],
        magic: [],
        technology: [],
        history: [],
        politics: [],
        economy: [],
        geography: []
      },
      
      // Personagens
      characters: [],
      selectedCharacter: null,
      
      // Lore
      loreData: {
        myths: [],
        legends: [],
        prophecies: [],
        artifacts: [],
        rituals: [],
        customs: []
      },
      
      // Narrativa
      narrativeData: {
        plotPoints: [],
        storyArcs: [],
        themes: [],
        conflicts: [],
        resolutions: []
      },
      
      // AI Assistant
      aiConversations: [],
      aiSettings: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000
      },
      
      // Configurações
      settings: {
        // Geral
        theme: 'light',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: true,
        autoSave: true,
        autoSaveInterval: 30,
        undoHistorySize: 50,
        analytics: false,
        spellCheck: true,
        
        // AI
        defaultAIProvider: 'openai',
        aiTimeout: 30,
        autoSuggestions: false,
        autoRetry: true,
        aiProviders: {
          openai: {
            apiKey: '',
            defaultModel: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 2000,
            enabled: true
          },
          anthropic: {
            apiKey: '',
            defaultModel: 'claude-3-5-sonnet-20241022',
            temperature: 0.7,
            maxTokens: 2000,
            enabled: false
          },
          google: {
            apiKey: '',
            defaultModel: 'gemini-1.5-flash',
            temperature: 0.7,
            maxTokens: 2000,
            enabled: false
          },
          groq: {
            apiKey: '',
            defaultModel: 'llama3-70b-8192',
            temperature: 0.7,
            maxTokens: 2000,
            enabled: false
          },
          custom: {
            apiKey: '',
            baseUrl: '',
            defaultModel: 'custom-model',
            temperature: 0.7,
            maxTokens: 2000,
            enabled: false
          }
        },
        
        // Editor
        fontFamily: 'serif',
        fontSize: 16,
        lineHeight: 1.6,
        focusMode: false,
        wordWrap: true,
        showStats: true,
        syntaxHighlight: true,
        
        // Aparência
        primaryColor: 'blue',
        density: 'normal',
        animations: true,
        visualEffects: true,
        
        // Notificações
        notificationSounds: true,
        notificationTypes: {
          auto_save: true,
          ai_responses: true,
          reminders: false,
          updates: true,
          errors: true
        },
        dailyReminders: false,
        reminderTime: '19:00',
        dailyWordGoal: 500,
        
        // Segurança
        encryptLocalData: false,
        maskApiKeys: true,
        activityLog: true,
        autoBackup: false,
        backupFrequency: 'daily',
        maxBackups: 10,
        
        // Avançado
        devMode: false,
        verboseLogging: false,
        betaFeatures: false,
        renderLimit: 1000,
        cacheTTL: 60,
        lazyLoading: true
      },
      
      // Actions
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: Date.now(), createdAt: new Date().toISOString() }]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      
      setEditorContent: (content) => set({ editorContent: content }),
      
      addToHistory: (content) => set((state) => ({
        editorHistory: [...state.editorHistory.slice(-9), content]
      })),
      
      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
      
      updateWorldData: (updates) => set((state) => ({
        worldData: { ...state.worldData, ...updates }
      })),
      
      addLocation: (location) => set((state) => ({
        worldData: {
          ...state.worldData,
          locations: [...state.worldData.locations, { ...location, id: Date.now() }]
        }
      })),
      
      addCharacter: (character) => set((state) => ({
        characters: [...state.characters, { ...character, id: Date.now() }]
      })),
      
      updateCharacter: (id, updates) => set((state) => ({
        characters: state.characters.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      
      deleteCharacter: (id) => set((state) => ({
        characters: state.characters.filter(c => c.id !== id)
      })),
      
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      
      addLoreItem: (category, item) => set((state) => ({
        loreData: {
          ...state.loreData,
          [category]: [...state.loreData[category], { ...item, id: Date.now() }]
        }
      })),
      
      addNarrativeItem: (category, item) => set((state) => ({
        narrativeData: {
          ...state.narrativeData,
          [category]: [...state.narrativeData[category], { ...item, id: Date.now() }]
        }
      })),
      
      addAIConversation: (conversation) => set((state) => ({
        aiConversations: [...state.aiConversations, { ...conversation, id: Date.now() }]
      })),
      
      updateAISettings: (settings) => set((state) => ({
        aiSettings: { ...state.aiSettings, ...settings }
      })),
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      
      // Computed values
      getProjectById: (id) => get().projects.find(p => p.id === id),
      
      getCharactersByRole: (role) => get().characters.filter(c => c.role === role),
      
      getLocationsByType: (type) => get().worldData.locations.filter(l => l.type === type),
      
      getLoreByCategory: (category) => get().loreData[category] || [],
      
      getNarrativeByCategory: (category) => get().narrativeData[category] || [],
      
      // Export/Import
      exportProject: () => {
        const state = get();
        const exportData = {
          project: state.currentProject,
          worldData: state.worldData,
          characters: state.characters,
          loreData: state.loreData,
          narrativeData: state.narrativeData,
          editorContent: state.editorContent,
          exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.currentProject?.name || 'project'}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
      
      importProject: (data) => {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          set({
            worldData: parsedData.worldData || get().worldData,
            characters: parsedData.characters || [],
            loreData: parsedData.loreData || get().loreData,
            narrativeData: parsedData.narrativeData || get().narrativeData,
            editorContent: parsedData.editorContent || ''
          });
          return true;
        } catch (error) {
          console.error('Erro ao importar projeto:', error);
          return false;
        }
      }
    }),
    {
      name: 'light-novel-creator-storage',
      partialize: (state) => ({
        projects: state.projects,
        worldData: state.worldData,
        characters: state.characters,
        loreData: state.loreData,
        narrativeData: state.narrativeData,
        aiConversations: state.aiConversations,
        aiSettings: state.aiSettings,
        settings: state.settings
      })
    }
  )
);

export default useStore;
