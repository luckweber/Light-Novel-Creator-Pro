import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar, 
  BarChart3, 
  Trophy,
  Plus,
  Settings
} from 'lucide-react';
import { getWritingProgress, getAnalyticsSummary, setWritingGoal } from '../../utils/analytics';
import toast from 'react-hot-toast';

const ProgressSummary = () => {
  const [summary, setSummary] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalType, setGoalType] = useState('daily');
  const [goalValue, setGoalValue] = useState('');

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSummary = () => {
    const data = getAnalyticsSummary();
    setSummary(data);
  };

  const handleSetGoal = () => {
    const value = parseInt(goalValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    setWritingGoal(goalType, value);
    setShowGoalModal(false);
    setGoalValue('');
    loadSummary();
    toast.success(`Meta ${goalType} definida: ${value} palavras`);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (!summary) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const dailyProgress = getWritingProgress('daily');
  const weeklyProgress = getWritingProgress('weekly');

  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      {dailyProgress && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Meta Diária
            </h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className={`text-sm font-medium ${getProgressColor(dailyProgress.progress)}`}>
                {dailyProgress.current} / {dailyProgress.target}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  dailyProgress.progress >= 100 ? 'bg-green-500' :
                  dailyProgress.progress >= 75 ? 'bg-blue-500' :
                  dailyProgress.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(dailyProgress.progress, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(dailyProgress.progress)}% completo</span>
              <span>{dailyProgress.remaining} palavras restantes</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      {weeklyProgress && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Meta Semanal
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className={`text-sm font-medium ${getProgressColor(weeklyProgress.progress)}`}>
                {weeklyProgress.current} / {weeklyProgress.target}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  weeklyProgress.progress >= 100 ? 'bg-green-500' :
                  weeklyProgress.progress >= 75 ? 'bg-blue-500' :
                  weeklyProgress.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(weeklyProgress.progress, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(weeklyProgress.progress)}% completo</span>
              <span>{weeklyProgress.remaining} palavras restantes</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
          Estatísticas
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Total de palavras
            </span>
            <span className="text-sm font-medium">
              {summary.totalWords.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Tempo total
            </span>
            <span className="text-sm font-medium">
              {formatTime(summary.totalTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Sessões
            </span>
            <span className="text-sm font-medium">
              {summary.totalSessions}
            </span>
          </div>
          
          {summary.averageWordsPerSession > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média por sessão</span>
              <span className="text-sm font-medium">
                {summary.averageWordsPerSession} palavras
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      {summary.totalWords > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Conquistas
          </h3>
          
          <div className="space-y-2">
            {summary.totalWords >= 1000 && (
              <div className="flex items-center text-sm text-green-600">
                <Trophy className="h-4 w-4 mr-2" />
                Primeiro Milhar - 1.000 palavras
              </div>
            )}
            {summary.totalWords >= 5000 && (
              <div className="flex items-center text-sm text-blue-600">
                <Trophy className="h-4 w-4 mr-2" />
                Escritor Dedicado - 5.000 palavras
              </div>
            )}
            {summary.totalWords >= 10000 && (
              <div className="flex items-center text-sm text-purple-600">
                <Trophy className="h-4 w-4 mr-2" />
                Autor Profissional - 10.000 palavras
              </div>
            )}
            {summary.totalSessions >= 10 && (
              <div className="flex items-center text-sm text-orange-600">
                <Trophy className="h-4 w-4 mr-2" />
                Consistência - 10 sessões
              </div>
            )}
            {dailyProgress && dailyProgress.progress >= 100 && (
              <div className="flex items-center text-sm text-green-600">
                <Trophy className="h-4 w-4 mr-2" />
                Meta Diária Atingida!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Definir Meta de Escrita
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Meta
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta (palavras)
                </label>
                <input
                  type="number"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  placeholder="Ex: 1000"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSetGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Definir Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSummary;
