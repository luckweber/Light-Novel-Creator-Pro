// Analytics and performance monitoring for Light Novel Creator Pro

class Analytics {
  constructor() {
    this.events = [];
    this.performance = {};
    this.writingStats = {
      totalWords: 0,
      totalTime: 0,
      sessions: [],
      goals: {}
    };
    this.isEnabled = localStorage.getItem('analytics_enabled') !== 'false';
  }

  /**
   * Track user event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  track(event, data = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    this.events.push(eventData);
    this.saveEvents();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }
  }

  /**
   * Track performance metric
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   */
  trackPerformance(metric, value) {
    if (!this.isEnabled) return;

    this.performance[metric] = {
      value,
      timestamp: new Date().toISOString()
    };
    this.savePerformance();
  }

  /**
   * Track writing session
   * @param {Object} sessionData - Session data
   */
  trackWritingSession(sessionData) {
    if (!this.isEnabled) return;

    const session = {
      ...sessionData,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    this.writingStats.sessions.push(session);
    this.saveWritingStats();
  }

  /**
   * Update writing statistics
   * @param {Object} stats - Writing statistics
   */
  updateWritingStats(stats) {
    this.writingStats = {
      ...this.writingStats,
      ...stats,
      lastUpdated: new Date().toISOString()
    };
    this.saveWritingStats();
  }

  /**
   * Set writing goal
   * @param {string} goalType - Type of goal (daily, weekly, etc.)
   * @param {number} target - Target value
   */
  setWritingGoal(goalType, target) {
    this.writingStats.goals[goalType] = {
      target,
      createdAt: new Date().toISOString()
    };
    this.saveWritingStats();
  }

  /**
   * Get writing progress
   * @param {string} goalType - Type of goal
   * @returns {Object} Progress data
   */
  getWritingProgress(goalType) {
    const goal = this.writingStats.goals[goalType];
    if (!goal) return null;

    const today = new Date().toDateString();
    const todaySessions = this.writingStats.sessions.filter(
      session => new Date(session.timestamp).toDateString() === today
    );

    const todayWords = todaySessions.reduce((total, session) => 
      total + (session.wordsAdded || 0), 0
    );

    return {
      target: goal.target,
      current: todayWords,
      progress: Math.min((todayWords / goal.target) * 100, 100),
      remaining: Math.max(goal.target - todayWords, 0)
    };
  }

  /**
   * Get session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Save events to localStorage
   */
  saveEvents() {
    try {
      const eventsToSave = this.events.slice(-100); // Keep last 100 events
      localStorage.setItem('analytics_events', JSON.stringify(eventsToSave));
    } catch (error) {
      console.error('Error saving analytics events:', error);
    }
  }

  /**
   * Save performance data to localStorage
   */
  savePerformance() {
    try {
      localStorage.setItem('analytics_performance', JSON.stringify(this.performance));
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  }

  /**
   * Save writing stats to localStorage
   */
  saveWritingStats() {
    try {
      localStorage.setItem('analytics_writing_stats', JSON.stringify(this.writingStats));
    } catch (error) {
      console.error('Error saving writing stats:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  loadData() {
    try {
      const events = localStorage.getItem('analytics_events');
      if (events) {
        this.events = JSON.parse(events);
      }

      const performance = localStorage.getItem('analytics_performance');
      if (performance) {
        this.performance = JSON.parse(performance);
      }

      const writingStats = localStorage.getItem('analytics_writing_stats');
      if (writingStats) {
        this.writingStats = JSON.parse(writingStats);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }

  /**
   * Export analytics data
   * @returns {Object} Analytics data
   */
  exportData() {
    return {
      events: this.events,
      performance: this.performance,
      writingStats: this.writingStats,
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Clear analytics data
   */
  clearData() {
    this.events = [];
    this.performance = {};
    this.writingStats = {
      totalWords: 0,
      totalTime: 0,
      sessions: [],
      goals: {}
    };
    
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('analytics_performance');
    localStorage.removeItem('analytics_writing_stats');
    localStorage.removeItem('analytics_session_id');
  }

  /**
   * Enable/disable analytics
   * @param {boolean} enabled - Whether analytics should be enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('analytics_enabled', enabled.toString());
  }

  /**
   * Get analytics summary
   * @returns {Object} Analytics summary
   */
  getSummary() {
    const totalSessions = this.writingStats.sessions.length;
    const totalWords = this.writingStats.sessions.reduce((total, session) => 
      total + (session.wordsAdded || 0), 0
    );
    const totalTime = this.writingStats.sessions.reduce((total, session) => 
      total + (session.duration || 0), 0
    );

    const averageWordsPerSession = totalSessions > 0 ? totalWords / totalSessions : 0;
    const averageTimePerSession = totalSessions > 0 ? totalTime / totalSessions : 0;

    return {
      totalSessions,
      totalWords,
      totalTime,
      averageWordsPerSession: Math.round(averageWordsPerSession),
      averageTimePerSession: Math.round(averageTimePerSession),
      goals: this.writingStats.goals,
      lastSession: this.writingStats.sessions[this.writingStats.sessions.length - 1]
    };
  }
}

// Create singleton instance
const analytics = new Analytics();

// Load existing data
analytics.loadData();

// Track page views
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.track('page_view', {
      path: window.location.pathname,
      title: document.title
    });
  });
}

export default analytics;

// Predefined tracking functions
export const trackEvent = (event, data) => analytics.track(event, data);
export const trackPerformance = (metric, value) => analytics.trackPerformance(metric, value);
export const trackWritingSession = (sessionData) => analytics.trackWritingSession(sessionData);
export const updateWritingStats = (stats) => analytics.updateWritingStats(stats);
export const setWritingGoal = (goalType, target) => analytics.setWritingGoal(goalType, target);
export const getWritingProgress = (goalType) => analytics.getWritingProgress(goalType);
export const getAnalyticsSummary = () => analytics.getSummary();
export const exportAnalyticsData = () => analytics.exportData();
export const clearAnalyticsData = () => analytics.clearData();
export const setAnalyticsEnabled = (enabled) => analytics.setEnabled(enabled);
