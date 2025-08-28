import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import WorldBuilder from './pages/WorldBuilder';
import CharacterGenerator from './pages/CharacterGenerator';
import LoreGenerator from './pages/LoreGenerator';
import NarrativeGenerator from './pages/NarrativeGenerator';
import AIAssistant from './pages/AIAssistant';
import ProjectManager from './pages/ProjectManager';
import VolumeManager from './pages/VolumeManager';
import Settings from './pages/Settings';
import { useTheme } from './hooks/useTheme';
import backupManager from './utils/backupUtils';

function App() {
  // Aplica o tema automaticamente
  useTheme();

  // Inicializar sistema de backup
  React.useEffect(() => {
    backupManager.init();
    
    // Cleanup ao desmontar
    return () => {
      backupManager.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            
            {/* WorldBuilder com rotas aninhadas */}
            <Route path="/world-builder" element={<WorldBuilder />} />
            <Route path="/world-builder/overview" element={<WorldBuilder />} />
            <Route path="/world-builder/geography" element={<WorldBuilder />} />
            <Route path="/world-builder/geography/locations" element={<WorldBuilder />} />
            <Route path="/world-builder/geography/regions" element={<WorldBuilder />} />
            <Route path="/world-builder/geography/landmarks" element={<WorldBuilder />} />
            <Route path="/world-builder/geography/resources" element={<WorldBuilder />} />
            <Route path="/world-builder/cultures" element={<WorldBuilder />} />
            <Route path="/world-builder/cultures/peoples" element={<WorldBuilder />} />
            <Route path="/world-builder/cultures/languages" element={<WorldBuilder />} />
            <Route path="/world-builder/cultures/religions" element={<WorldBuilder />} />
            <Route path="/world-builder/cultures/traditions" element={<WorldBuilder />} />
            <Route path="/world-builder/systems" element={<WorldBuilder />} />
            <Route path="/world-builder/systems/magic" element={<WorldBuilder />} />
            <Route path="/world-builder/systems/technology" element={<WorldBuilder />} />
            <Route path="/world-builder/systems/government" element={<WorldBuilder />} />
            <Route path="/world-builder/systems/economy" element={<WorldBuilder />} />
            <Route path="/world-builder/history" element={<WorldBuilder />} />
            <Route path="/world-builder/history/events" element={<WorldBuilder />} />
            <Route path="/world-builder/history/eras" element={<WorldBuilder />} />
            <Route path="/world-builder/analytics" element={<WorldBuilder />} />
            <Route path="/world-builder/analytics/statistics" element={<WorldBuilder />} />
            <Route path="/world-builder/analytics/relationships" element={<WorldBuilder />} />
            
            <Route path="/character-generator" element={<CharacterGenerator />} />
            <Route path="/lore-generator" element={<LoreGenerator />} />
            <Route path="/narrative-generator" element={<NarrativeGenerator />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/volume-manager" element={<VolumeManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
