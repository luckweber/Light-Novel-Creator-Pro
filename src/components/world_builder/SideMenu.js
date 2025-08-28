import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { mainTabs, subMenus } from '../../data/worldBuilderConstants';

const SideMenu = ({ activeTab, activeSubTab, onTabChange, onSubTabChange, worldData }) => {
  const [expandedMenus, setExpandedMenus] = useState(new Set(['overview']));

  // Efeito para expandir automaticamente o menu quando activeTab muda
  useEffect(() => {
    if (activeTab && !expandedMenus.has(activeTab)) {
      setExpandedMenus(prev => new Set([...prev, activeTab]));
    }
  }, [activeTab]); // Removida a dependência expandedMenus para evitar loop

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId);
      } else {
        newExpanded.add(menuId);
      }
      return newExpanded;
    });
  };

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    
    // Se o menu já está expandido, permitir fechá-lo
    if (expandedMenus.has(tabId)) {
      toggleMenu(tabId);
    } else {
      // Expandir automaticamente o menu quando clicado pela primeira vez
      setExpandedMenus(prev => new Set([...prev, tabId]));
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
      <div className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 truncate">Navegação</h2>
        
        <nav className="space-y-1">
          {mainTabs.map((tab) => {
            const TabIcon = tab.icon;
            const subMenu = subMenus[tab.id];
            const isExpanded = expandedMenus.has(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <div key={tab.id}>
                {/* Aba Principal */}
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? `bg-${tab.color}-100 text-${tab.color}-700 border-r-2 border-${tab.color}-500`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <TabIcon className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {subMenu && (
                    <div className="flex items-center flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {subMenu && isExpanded && (
                  <div className="ml-4 sm:ml-6 mt-1 space-y-1">
                    {subMenu.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isSubActive = activeSubTab === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => onSubTabChange(item.id)}
                          className={`w-full flex items-center px-2 sm:px-3 py-2 text-sm rounded-md transition-colors ${
                            isSubActive
                              ? `bg-${subMenu.color}-50 text-${subMenu.color}-700 border-r-2 border-${subMenu.color}-400`
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <ItemIcon className="h-3 w-3 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="truncate flex-1">{item.label}</span>
                          {worldData?.[item.id]?.length > 0 && (
                            <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                              {worldData[item.id].length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Informações Rápidas */}
      <div className="p-3 sm:p-4 border-t border-gray-200 mt-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">Informações Rápidas</h3>
        <div className="space-y-1.5 sm:space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="truncate">Total de Elementos:</span>
            <span className="font-medium flex-shrink-0 ml-2">
              {Object.values(worldData || {}).reduce((total, items) => 
                total + (Array.isArray(items) ? items.length : 0), 0
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="truncate">Locais:</span>
            <span className="font-medium flex-shrink-0 ml-2">{worldData?.locations?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="truncate">Povos:</span>
            <span className="font-medium flex-shrink-0 ml-2">{worldData?.peoples?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="truncate">Sistemas:</span>
            <span className="font-medium flex-shrink-0 ml-2">{worldData?.magicSystems?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
