import { useEffect } from 'react';
import useStore from '../store/useStore';

export const useTheme = () => {
  const { settings } = useStore();
  const theme = settings?.theme || 'light';

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove classes de tema anteriores
    root.classList.remove('light', 'dark');
    
    // Aplica o tema atual
    if (theme === 'auto') {
      // Detecta preferência do sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const isDark = mediaQuery.matches;
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      
      // Listener para mudanças na preferência do sistema
      const handleChange = (e) => {
        if (e.matches) {
          root.classList.remove('light');
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Aplica tema específico
      root.classList.add(theme);
    }
  }, [theme]);

  return theme;
};
