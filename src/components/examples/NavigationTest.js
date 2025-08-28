import React from 'react';
import { useWorldBuilderNavigation } from '../../hooks/useWorldBuilderNavigation';

const NavigationTest = () => {
  const {
    getCurrentRouteState,
    navigateToSection,
    navigateWithParams,
    updateParams,
    isCurrentRoute,
    currentPath
  } = useWorldBuilderNavigation();

  const currentState = getCurrentRouteState();

  return (
    <div className="p-6 space-y-4">
      <div className="bg-card border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Teste de Navegação Híbrida</h2>
        
        <div className="space-y-2 mb-4">
          <div><strong>Rota Atual:</strong> {currentPath}</div>
          <div><strong>Tab:</strong> {currentState.tab}</div>
          <div><strong>SubTab:</strong> {currentState.subTab || 'Nenhuma'}</div>
          <div><strong>Modo:</strong> {currentState.viewMode}</div>
          <div><strong>Busca:</strong> {currentState.search || 'Nenhuma'}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => navigateToSection('systems', 'magicSystems')}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sistemas Mágicos
          </button>
          
          <button
            onClick={() => navigateToSection('geography', 'locations')}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Locais
          </button>
          
          <button
            onClick={() => navigateToSection('cultures', 'peoples')}
            className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Povos
          </button>
          
          <button
            onClick={() => navigateToSection('overview')}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Overview
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => updateParams({ viewMode: 'grid' })}
            className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Modo Grid
          </button>
          
          <button
            onClick={() => updateParams({ viewMode: 'list' })}
            className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Modo Lista
          </button>
          
          <button
            onClick={() => updateParams({ search: 'teste' })}
            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Buscar "teste"
          </button>
          
          <button
            onClick={() => updateParams({ search: '' })}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Limpar Busca
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Status das Rotas:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className={`p-2 rounded ${isCurrentRoute('systems', 'magicSystems') ? 'bg-green-200' : 'bg-gray-200'}`}>
              Sistemas Mágicos: {isCurrentRoute('systems', 'magicSystems') ? 'Ativo' : 'Inativo'}
            </div>
            <div className={`p-2 rounded ${isCurrentRoute('geography', 'locations') ? 'bg-green-200' : 'bg-gray-200'}`}>
              Locais: {isCurrentRoute('geography', 'locations') ? 'Ativo' : 'Inativo'}
            </div>
            <div className={`p-2 rounded ${isCurrentRoute('cultures', 'peoples') ? 'bg-green-200' : 'bg-gray-200'}`}>
              Povos: {isCurrentRoute('cultures', 'peoples') ? 'Ativo' : 'Inativo'}
            </div>
            <div className={`p-2 rounded ${isCurrentRoute('overview') ? 'bg-green-200' : 'bg-gray-200'}`}>
              Overview: {isCurrentRoute('overview') ? 'Ativo' : 'Inativo'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTest;
