import React, { useState } from 'react';
import './Dashboard.css';
import { useQuizContext } from '../context/QuizContext';

const Dashboard = () => {
  const { quizStats } = useQuizContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProductionOverlay, setShowProductionOverlay] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Calculate metrics based on quiz statistics
  const metrics = {
    totalGames: {
      value: quizStats.totalQuizzesCompleted || 0,
      trend: quizStats.totalQuizzesCompleted > 0 
        ? `${((quizStats.totalQuizzesCompleted - (quizStats.totalQuizzesCompleted - 1)) / (quizStats.totalQuizzesCompleted - 1) * 100).toFixed(1)}%`
        : '0%',
      isUp: quizStats.totalQuizzesCompleted > (quizStats.totalQuizzesCompleted - 1)
    },
    averageScore: {
      value: `${(quizStats.averageScore || 0).toFixed(1)}%`,
      trend: quizStats.averageScore > 0
        ? `${((quizStats.averageScore - (quizStats.averageScore - 1)) / (quizStats.averageScore - 1) * 100).toFixed(1)}%`
        : '0%',
      isUp: quizStats.averageScore > (quizStats.averageScore - 1)
    },
    totalEarnings: {
      value: `$${(quizStats.totalBankroll || 0).toLocaleString()}`,
      trend: quizStats.totalBankroll > 0
        ? `${((quizStats.totalBankroll - (quizStats.totalBankroll - 100)) / (quizStats.totalBankroll - 100) * 100).toFixed(1)}%`
        : '0%',
      isUp: quizStats.totalBankroll > (quizStats.totalBankroll - 100)
    },
    bestScore: {
      value: `${(quizStats.highestScore || 0).toFixed(1)}%`,
      trend: quizStats.highestScore > 0
        ? `${((quizStats.highestScore - (quizStats.highestScore - 1)) / (quizStats.highestScore - 1) * 100).toFixed(1)}%`
        : '0%',
      isUp: quizStats.highestScore > (quizStats.highestScore - 1)
    }
  };

  // Quiz categories data
  const quizCategories = [
    { name: 'Geography', value: 30, volume: '30%', color: '#34c759' },
    { name: 'Art', value: 25, volume: '25%', color: '#5856d6' },
    { name: 'Science', value: 25, volume: '25%', color: '#ff9500' },
    { name: 'History', value: 20, volume: '20%', color: '#ff3b30' }
  ];

  // Performance trend data
  const performanceTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        name: 'Score',
        data: [65, 72, 68, 75],
        color: '#34c759'
      },
      {
        name: 'Earnings',
        data: [100, 150, 120, 200],
        color: '#5856d6'
      }
    ]
  };

  // Achievement progress
  const achievementProgress = {
    current: 75,
    target: 100,
    industryAverage: 65,
    bestPractice: 90
  };

  // Sustainability score (adapted for quiz performance)
  const performanceScore = {
    overall: 85,
    industryAverage: 70,
    bestPractice: 95,
    components: [
      { name: 'Accuracy', score: 90, weight: 0.4 },
      { name: 'Speed', score: 85, weight: 0.3 },
      { name: 'Consistency', score: 80, weight: 0.3 }
    ]
  };

  // Financial impact (adapted for quiz earnings)
  const earningsImpact = {
    currentEarnings: quizStats.totalBankroll,
    potentialEarnings: quizStats.totalBankroll * 1.2,
    roi: 20,
    breakdown: [
      { category: 'Geography', earnings: 300, potential: 360 },
      { category: 'Art', earnings: 250, potential: 300 },
      { category: 'Science', earnings: 250, potential: 300 },
      { category: 'History', earnings: 200, potential: 240 }
    ]
  };

  // Material recovery (adapted for quiz categories)
  const categoryPerformance = {
    totalQuestions: 100,
    completionRate: 85,
    categories: [
      { name: 'Geography', completed: 30, total: 35, value: 300 },
      { name: 'Art', completed: 25, total: 30, value: 250 },
      { name: 'Science', completed: 25, total: 30, value: 250 },
      { name: 'History', completed: 20, total: 25, value: 200 }
    ],
    destinations: [
      { name: 'Mastered', percentage: 40 },
      { name: 'Proficient', percentage: 35 },
      { name: 'Learning', percentage: 15 },
      { name: 'Needs Review', percentage: 10 }
    ]
  };

  // Insights (adapted for quiz performance)
  const insights = [
    {
      title: 'Improve Geography Performance',
      description: 'Your geography scores are below average compared to other categories.',
      priority: 'high',
      color: '#ff3b30',
      icon: '🎯',
      impact: 'Could increase overall score by 5%',
      recommendation: 'Focus on geography questions and review past mistakes',
      implementation: 'Complete 10 geography questions daily',
      potentialSavings: 'Potential to earn $50 more per week'
    },
    {
      title: 'Speed Improvement Opportunity',
      description: 'Your answer speed is 20% slower than optimal.',
      priority: 'medium',
      color: '#ff9500',
      icon: '⚡',
      impact: 'Could complete 25% more questions',
      recommendation: 'Practice quick recognition of common question patterns',
      implementation: 'Set aside 15 minutes daily for speed drills',
      potentialSavings: 'Potential to earn $30 more per week'
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const toggleProductionOverlay = () => {
    setShowProductionOverlay(!showProductionOverlay);
  };

  const handleInsightClick = (index) => {
    setSelectedInsight(selectedInsight === index ? null : index);
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting data...');
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    console.log('Sharing dashboard...');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="header-title">Quiz Performance Dashboard</h1>
        <ul className="nav-tabs">
          <li 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </li>
          <li 
            className={`nav-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </li>
          <li 
            className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </li>
        </ul>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">Level {quizStats.userLevel}</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="summary-metrics">
          <div className="metric-card games-summary">
            <div className="metric-header">
              <div className="metric-title">Total Games</div>
              <div className="metric-actions">
                <button className="action-icon" onClick={handleExport}>📥</button>
                <button className="action-icon" onClick={handleShare}>📤</button>
              </div>
            </div>
            <div className="metric-value">{metrics.totalGames.value}</div>
            <div className={`metric-trend ${metrics.totalGames.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.totalGames.trend}
            </div>
            <div className="metric-divider"></div>
            <div className="metric-subtitle">Average Score</div>
            <div className="metric-value">{metrics.averageScore.value}</div>
            <div className={`metric-trend ${metrics.averageScore.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.averageScore.trend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Total Earnings</div>
            <div className="metric-value">{metrics.totalEarnings.value}</div>
            <div className={`metric-trend ${metrics.totalEarnings.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.totalEarnings.trend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Best Score</div>
            <div className="metric-value">{metrics.bestScore.value}</div>
            <div className={`metric-trend ${metrics.bestScore.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.bestScore.trend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Current Level</div>
            <div className="metric-value">{quizStats.userLevel}</div>
            <div className="metric-trend">
              {quizStats.experiencePoints} / {quizStats.experienceForNextLevel} XP
            </div>
          </div>
        </section>

        <section className="card category-performance">
          <div className="card-header">
            <h2 className="card-title">Performance by Category</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="donut-chart">
              <div className="donut-center">
                <div className="donut-value">{quizStats.totalQuizzesCompleted}</div>
                <div className="donut-label">Total Games</div>
              </div>
            </div>
          </div>
          <div className="categories-legend">
            {quizCategories.map(category => (
              <div 
                key={category.name} 
                className={`legend-item ${selectedCategory === category.name ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name} ({category.value}%)</span>
                <span className="legend-volume">{category.volume}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card performance-trend">
          <div className="card-header">
            <h2 className="card-title">Performance Trend</h2>
            <div className="card-actions">
              <button 
                className={`card-action ${showProductionOverlay ? 'active' : ''}`}
                onClick={toggleProductionOverlay}
                title="Toggle Questions Overlay"
              >
                📊
              </button>
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-legend">
                {performanceTrendData.datasets.map(dataset => (
                  <div key={dataset.name} className="chart-legend-item">
                    <div 
                      className="chart-legend-color" 
                      style={{ backgroundColor: dataset.color }}
                    />
                    <span>{dataset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card achievement-progress">
          <div className="card-header">
            <h2 className="card-title">Achievement Progress</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="gauge-container">
            <div className="gauge">
              <div 
                className="gauge-fill" 
                style={{ height: `${achievementProgress.current}%` }}
              />
              <div 
                className="gauge-marker target" 
                style={{ left: `${achievementProgress.target}%` }}
              />
              <div 
                className="gauge-marker industry" 
                style={{ left: `${achievementProgress.industryAverage}%` }}
              />
              <div 
                className="gauge-marker best" 
                style={{ left: `${achievementProgress.bestPractice}%` }}
              />
            </div>
            <div className="gauge-value">{achievementProgress.current}%</div>
          </div>
          <div className="progress-details">
            <div className="progress-item">
              <div className="progress-label">Target</div>
              <div className="progress-value">{achievementProgress.target}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Current</div>
              <div className="progress-value">{achievementProgress.current}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Average</div>
              <div className="progress-value">{achievementProgress.industryAverage}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Best</div>
              <div className="progress-value">{achievementProgress.bestPractice}%</div>
            </div>
          </div>
        </section>

        <section className="card performance-score">
          <div className="card-header">
            <h2 className="card-title">Performance Score</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="score-container">
            <div className="score-circle">
              <div className="score-value">{performanceScore.overall}</div>
              <div className="score-label">Overall</div>
            </div>
            <div className="score-comparison">
              <div className="comparison-item">
                <div className="comparison-label">Average</div>
                <div className="comparison-value">{performanceScore.industryAverage}</div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Best</div>
                <div className="comparison-value">{performanceScore.bestPractice}</div>
              </div>
            </div>
          </div>
          <div className="score-components">
            {performanceScore.components.map(component => (
              <div key={component.name} className="score-component">
                <div className="component-header">
                  <div className="component-name">{component.name}</div>
                  <div className="component-score">{component.score}</div>
                </div>
                <div className="component-bar-container">
                  <div 
                    className="component-bar" 
                    style={{ 
                      width: `${component.score}%`,
                      backgroundColor: component.score >= 80 ? '#34c759' : 
                                      component.score >= 70 ? '#2c6ecb' : 
                                      component.score >= 60 ? '#ff9500' : '#ff3b30'
                    }}
                  />
                </div>
                <div className="component-weight">Weight: {component.weight * 100}%</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card earnings-impact">
          <div className="card-header">
            <h2 className="card-title">Earnings Impact</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="financial-summary">
            <div className="financial-item">
              <div className="financial-label">Current Earnings</div>
              <div className="financial-value">${earningsImpact.currentEarnings.toLocaleString()}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">Potential Earnings</div>
              <div className="financial-value savings">${earningsImpact.potentialEarnings.toLocaleString()}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">ROI</div>
              <div className="financial-value">{earningsImpact.roi}%</div>
            </div>
          </div>
          <div className="financial-breakdown">
            <h3 className="breakdown-title">Earnings by Category</h3>
            <div className="breakdown-chart">
              <div className="breakdown-bars">
                {earningsImpact.breakdown.map(item => (
                  <div key={item.category} className="breakdown-bar-group">
                    <div className="breakdown-bar-label">{item.category}</div>
                    <div className="breakdown-bar-container">
                      <div 
                        className="breakdown-bar earnings" 
                        style={{ 
                          height: `${(item.earnings / earningsImpact.currentEarnings) * 100}%`,
                          backgroundColor: '#ff3b30'
                        }}
                      />
                      <div 
                        className="breakdown-bar potential" 
                        style={{ 
                          height: `${(item.potential / earningsImpact.potentialEarnings) * 100}%`,
                          backgroundColor: '#34c759'
                        }}
                      />
                    </div>
                    <div className="breakdown-bar-values">
                      <div className="breakdown-value">${item.earnings}</div>
                      <div className="breakdown-savings">${item.potential}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card category-performance">
          <div className="card-header">
            <h2 className="card-title">Category Performance</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="recovery-summary">
            <div className="recovery-item">
              <div className="recovery-value">{categoryPerformance.totalQuestions}</div>
              <div className="recovery-label">Total Questions</div>
            </div>
            <div className="recovery-item">
              <div className="recovery-value">{categoryPerformance.completionRate}%</div>
              <div className="recovery-label">Completion Rate</div>
            </div>
          </div>
          <div className="recovery-materials">
            <h3 className="materials-title">Category Breakdown</h3>
            <div className="materials-table">
              <div className="materials-header">
                <div className="material-name">Category</div>
                <div className="material-recovered">Completed</div>
                <div className="material-potential">Total</div>
                <div className="material-value">Value</div>
              </div>
              {categoryPerformance.categories.map(category => (
                <div key={category.name} className="material-row">
                  <div className="material-name">{category.name}</div>
                  <div className="material-recovered">{category.completed}</div>
                  <div className="material-potential">{category.total}</div>
                  <div className="material-value">${category.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="recovery-destinations">
            <h3 className="destinations-title">Performance Levels</h3>
            <div className="destinations-chart">
              <div className="destinations-legend">
                {categoryPerformance.destinations.map(destination => (
                  <div key={destination.name} className="destination-item">
                    <div className="destination-color" style={{ 
                      backgroundColor: destination.name === 'Mastered' ? '#34c759' : 
                                      destination.name === 'Proficient' ? '#5856d6' : 
                                      destination.name === 'Learning' ? '#ff9500' : '#ff3b30'
                    }} />
                    <div className="destination-info">
                      <div className="destination-name">{destination.name}</div>
                      <div className="destination-percentage">{destination.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card insights-panel">
          <div className="card-header">
            <h2 className="card-title">Performance Insights</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`insight-item ${selectedInsight === index ? 'expanded' : ''}`}
                onClick={() => handleInsightClick(index)}
              >
                <div 
                  className="insight-icon"
                  style={{ backgroundColor: insight.color }}
                >
                  {insight.icon}
                </div>
                <div className="insight-info">
                  <div className="insight-header">
                    <div className="insight-title">{insight.title}</div>
                    <div className={`insight-priority ${insight.priority}`}>{insight.priority}</div>
                  </div>
                  <div className="insight-desc">{insight.description}</div>
                  
                  {selectedInsight === index && (
                    <div className="insight-details">
                      <div className="insight-impact">
                        <div className="detail-label">Impact:</div>
                        <div className="detail-value">{insight.impact}</div>
                      </div>
                      <div className="insight-recommendation">
                        <div className="detail-label">Recommendation:</div>
                        <div className="detail-value">{insight.recommendation}</div>
                      </div>
                      <div className="insight-implementation">
                        <div className="detail-label">Implementation:</div>
                        <div className="detail-value">{insight.implementation}</div>
                      </div>
                      <div className="insight-savings">
                        <div className="detail-label">Potential Earnings:</div>
                        <div className="detail-value">{insight.potentialSavings}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="action-button">View All Insights</button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;