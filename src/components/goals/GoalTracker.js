import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Flame
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const GoalTracker = () => {
  const { currentProject, settings } = useStore();
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('writing-goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    type: 'daily',
    target: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [dailyStats, setDailyStats] = useState(() => {
    const saved = localStorage.getItem('daily-writing-stats');
    return saved ? JSON.parse(saved) : {};
  });

  const goalTypes = [
    { value: 'daily', label: 'Diária', icon: Calendar },
    { value: 'weekly', label: 'Semanal', icon: TrendingUp },
    { value: 'monthly', label: 'Mensal', icon: BarChart3 },
    { value: 'project', label: 'Por Projeto', icon: Target }
  ];

  useEffect(() => {
    localStorage.setItem('writing-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('daily-writing-stats', JSON.stringify(dailyStats));
  }, [dailyStats]);

  const getCurrentStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date();
    
    while (dailyStats[currentDate.toISOString().split('T')[0]]?.wordsWritten > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getGoalProgress = (goal) => {
    const today = new Date().toISOString().split('T')[0];
    const currentWords = dailyStats[today]?.wordsWritten || 0;
    
    switch (goal.type) {
      case 'daily':
        return Math.min((currentWords / goal.target) * 100, 100);
      case 'weekly':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        let weeklyWords = 0;
        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          weeklyWords += dailyStats[dateStr]?.wordsWritten || 0;
        }
        return Math.min((weeklyWords / goal.target) * 100, 100);
      default:
        return 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!goalForm.title || !goalForm.target) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newGoal = {
      id: editingGoal?.id || Date.now(),
      ...goalForm,
      target: parseInt(goalForm.target),
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? newGoal : g));
      toast.success('Meta atualizada!');
    } else {
      setGoals(prev => [...prev, newGoal]);
      toast.success('Meta criada!');
    }

    setShowForm(false);
    setEditingGoal(null);
    setGoalForm({
      title: '',
      type: 'daily',
      target: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
  };

  const deleteGoal = (goalId) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast.success('Meta excluída!');
    }
  };

  const recordTodayWords = (words) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyStats(prev => ({
      ...prev,
      [today]: {
        wordsWritten: words,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const getWeeklyStats = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let totalWords = 0;
    let daysWithWriting = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayWords = dailyStats[dateStr]?.wordsWritten || 0;
      totalWords += dayWords;
      if (dayWords > 0) daysWithWriting++;
    }
    
    return { totalWords, daysWithWriting, averageWords: daysWithWriting > 0 ? Math.round(totalWords / daysWithWriting) : 0 };
  };

  const weeklyStats = getWeeklyStats();
  const currentStreak = getCurrentStreak();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Metas de Escrita</h2>
          <p className="text-muted-foreground">Acompanhe seu progresso e mantenha a motivação</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Streak Atual</p>
              <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Palavras Esta Semana</p>
              <p className="text-2xl font-bold text-foreground">{weeklyStats.totalWords.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Média Diária</p>
              <p className="text-2xl font-bold text-foreground">{weeklyStats.averageWords.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dias Ativos</p>
              <p className="text-2xl font-bold text-foreground">{weeklyStats.daysWithWriting}/7</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Suas Metas</h3>
        {goals.length === 0 ? (
          <div className="card p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhuma meta criada</h4>
            <p className="text-muted-foreground mb-4">Crie sua primeira meta para começar a acompanhar seu progresso</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Criar Primeira Meta
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map(goal => {
              const progress = getGoalProgress(goal);
              const GoalTypeIcon = goalTypes.find(t => t.value === goal.type)?.icon || Target;
              
              return (
                <div key={goal.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <GoalTypeIcon className="h-5 w-5 text-primary-600" />
                      <div>
                        <h4 className="font-medium text-foreground">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setGoalForm(goal);
                          setShowForm(true);
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.type === 'daily' ? 'Meta diária' : 'Meta semanal'}</span>
                      <span>{goal.target.toLocaleString()} palavras</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Word Counter */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Registrar Palavras de Hoje</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            placeholder="Quantas palavras você escreveu hoje?"
            className="input-field flex-1"
            onChange={(e) => {
              const words = parseInt(e.target.value) || 0;
              recordTodayWords(words);
            }}
          />
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const words = dailyStats[today]?.wordsWritten || 0;
              toast.success(`${words.toLocaleString()} palavras registradas para hoje!`);
            }}
            className="btn-primary"
          >
            Registrar
          </button>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingGoal ? 'Editar Meta' : 'Nova Meta'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Título da Meta
                </label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Ex: Escrever 1000 palavras por dia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tipo de Meta
                </label>
                <select
                  value={goalForm.type}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Meta de Palavras
                </label>
                <input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, target: e.target.value }))}
                  className="input-field"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Descreva sua meta..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setGoalForm({
                      title: '',
                      type: 'daily',
                      target: '',
                      description: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: ''
                    });
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingGoal ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
