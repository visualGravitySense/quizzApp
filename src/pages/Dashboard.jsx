import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useQuizContext } from '../context/QuizContext';

const Dashboard = () => {
  const { quizStats } = useQuizContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [period] = useState('This Month');
  const [totalGames, setTotalGames] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProductionOverlay, setShowProductionOverlay] = useState(false);
  const [sortBy, setSortBy] = useState('volume'); // 'volume' or 'percentage'
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Sample data - in a real app, this would come from props or API
  const metrics = {
    totalWaste: { 
      value: '2,450 kg', 
      trend: '+5.2%', 
      isUp: true,
      costImpact: '$12,400',
      costTrend: '-1.8%',
      costIsUp: false
    },
    recyclingRate: { value: '68%', trend: '+2.1%', isUp: true },
    costSavings: { value: '$12,400', trend: '-1.8%', isUp: false },
    carbonReduction: { value: '3.2 tons', trend: '+4.5%', isUp: true }
  };

  const wasteCategories = [
    { name: 'Fabric Scraps', value: 35, color: '#34c759', volume: '857.5 kg' },
    { name: 'Rejected Garments', value: 25, color: '#5856d6', volume: '612.5 kg' },
    { name: 'Damaged Materials', value: 20, color: '#ff9500', volume: '490 kg' },
    { name: 'Thread/Trim', value: 15, color: '#ff3b30', volume: '367.5 kg' },
    { name: 'End-of-Roll', value: 5, color: '#8e8e93', volume: '122.5 kg' }
  ];

  const wasteTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Fabric Scraps',
        data: [820, 850, 830, 860, 840, 857.5],
        color: '#34c759'
      },
      {
        name: 'Rejected Garments',
        data: [580, 600, 590, 610, 600, 612.5],
        color: '#5856d6'
      },
      {
        name: 'Damaged Materials',
        data: [460, 480, 470, 490, 480, 490],
        color: '#ff9500'
      },
      {
        name: 'Thread/Trim',
        data: [350, 360, 355, 365, 360, 367.5],
        color: '#ff3b30'
      },
      {
        name: 'End-of-Roll',
        data: [110, 115, 112, 118, 120, 122.5],
        color: '#8e8e93'
      }
    ],
    production: [1000, 1050, 1020, 1080, 1060, 1100]
  };

  const facilities = [
    { 
      name: 'Shanghai', 
      value: 85, 
      color: '#2c6ecb',
      totalWaste: '850 kg',
      productionVolume: '1000 units',
      wastePerUnit: '0.85 kg'
    },
    { 
      name: 'Dhaka', 
      value: 65, 
      color: '#34c759',
      totalWaste: '650 kg',
      productionVolume: '800 units',
      wastePerUnit: '0.81 kg'
    },
    { 
      name: 'Istanbul', 
      value: 45, 
      color: '#ff9500',
      totalWaste: '450 kg',
      productionVolume: '600 units',
      wastePerUnit: '0.75 kg'
    },
    { 
      name: 'Mexico City', 
      value: 75, 
      color: '#5856d6',
      totalWaste: '750 kg',
      productionVolume: '900 units',
      wastePerUnit: '0.83 kg'
    },
    { 
      name: 'Milan', 
      value: 55, 
      color: '#ff3b30',
      totalWaste: '550 kg',
      productionVolume: '700 units',
      wastePerUnit: '0.79 kg'
    }
  ];

  const reductionTargets = {
    current: 75,
    target: 80,
    industryAverage: 70,
    bestPractice: 85,
    yearEndGoal: 82
  };

  // New data for secondary features
  const sustainabilityScore = {
    overall: 78,
    components: [
      { name: 'Waste Reduction', score: 75, weight: 0.3 },
      { name: 'Recycling Rate', score: 82, weight: 0.25 },
      { name: 'Energy Efficiency', score: 76, weight: 0.2 },
      { name: 'Water Conservation', score: 80, weight: 0.15 },
      { name: 'Supply Chain', score: 77, weight: 0.1 }
    ],
    industryAverage: 72,
    bestPractice: 88
  };

  const financialImpact = {
    currentWasteCost: 12400,
    potentialSavings: 2400,
    roi: 19.4,
    breakdown: [
      { category: 'Fabric Scraps', cost: 4340, savings: 870 },
      { category: 'Rejected Garments', cost: 3100, savings: 620 },
      { category: 'Damaged Materials', cost: 2480, savings: 496 },
      { category: 'Thread/Trim', cost: 1860, savings: 372 },
      { category: 'End-of-Roll', cost: 620, savings: 42 }
    ]
  };

  const materialRecovery = {
    totalRecovered: 1666,
    recoveryRate: 68,
    materials: [
      { name: 'Cotton', recovered: 850, potential: 1200, value: 4250 },
      { name: 'Polyester', recovered: 450, potential: 600, value: 2250 },
      { name: 'Wool', recovered: 200, potential: 300, value: 1000 },
      { name: 'Other', recovered: 166, potential: 350, value: 830 }
    ],
    destinations: [
      { name: 'Recycled into new fabric', percentage: 45 },
      { name: 'Upcycled into products', percentage: 30 },
      { name: 'Industrial applications', percentage: 15 },
      { name: 'Composting', percentage: 10 }
    ]
  };

  const insights = [
    {
      title: 'High Plastic Waste in Facility B',
      description: 'Plastic waste increased by 15% compared to last month',
      icon: '⚠️',
      color: '#ff3b30',
      priority: 'high',
      impact: 'Cost impact: $1,200 per month',
      recommendation: 'Review cutting patterns and implement digital nesting software to reduce fabric waste by 8-12%.',
      implementation: 'Medium effort, 2-3 weeks',
      potentialSavings: '$1,440 per month'
    },
    {
      title: 'Recycling Efficiency Improved',
      description: 'Overall recycling rate improved by 5% across all facilities',
      icon: '📈',
      color: '#34c759',
      priority: 'medium',
      impact: 'Positive trend, maintaining momentum',
      recommendation: 'Standardize recycling processes across all facilities to achieve consistent 75%+ recycling rate.',
      implementation: 'Low effort, 1-2 weeks',
      potentialSavings: '$600 per month'
    },
    {
      title: 'Cost Optimization Opportunity',
      description: 'Potential to save $2,400 by optimizing waste collection routes',
      icon: '💰',
      color: '#ff9500',
      priority: 'high',
      impact: 'Cost impact: $2,400 per month',
      recommendation: 'Implement route optimization software to reduce collection frequency and consolidate pickups.',
      implementation: 'Medium effort, 1-2 weeks',
      potentialSavings: '$2,400 per month'
    },
    {
      title: 'Material Recovery Potential',
      description: 'Up to 25% more material could be recovered from current waste stream',
      icon: '♻️',
      color: '#5856d6',
      priority: 'medium',
      impact: 'Value potential: $3,000 per month',
      recommendation: 'Upgrade sorting equipment and train staff on material identification to increase recovery rate.',
      implementation: 'High effort, 1-2 months',
      potentialSavings: '$3,000 per month'
    },
    {
      title: 'Seasonal Waste Pattern Detected',
      description: 'Waste increases by 18% during peak production months',
      icon: '📅',
      color: '#2c6ecb',
      priority: 'low',
      impact: 'Predictable pattern, planning opportunity',
      recommendation: 'Implement seasonal staffing and equipment allocation to handle increased waste during peak periods.',
      implementation: 'Medium effort, 2-3 weeks',
      potentialSavings: '$900 per month during peak periods'
    }
  ];

  const handleExport = () => {
    // In a real app, this would trigger a file download
    console.log('Exporting data...');
  };

  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    console.log('Sharing dashboard...');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const toggleProductionOverlay = () => {
    setShowProductionOverlay(!showProductionOverlay);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleInsightClick = (insight) => {
    setSelectedInsight(insight === selectedInsight ? null : insight);
  };

  // Sort facilities based on selected criteria
  const sortedFacilities = [...facilities].sort((a, b) => {
    if (sortBy === 'volume') {
      return parseInt(b.totalWaste) - parseInt(a.totalWaste);
    } else {
      return parseFloat(b.wastePerUnit) - parseFloat(a.wastePerUnit);
    }
  });

  // Update the useEffect to use the context data
  useEffect(() => {
    if (quizStats) {
      setTotalGames(quizStats.totalGames);
      setAverageScore(quizStats.averageScore);
      setTotalEarnings(quizStats.totalEarnings);
      setBestScore(quizStats.bestScore);
    }
  }, [quizStats]);

  return (
    <div className="dashboard">
      <header>
        <div className="logo-container">
          <div className="logo">TW</div>
          <span className="logo-text">Analytics</span>
        </div>
        <ul className="nav-tabs">
          <li 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </li>
          <li 
            className={`nav-tab ${activeTab === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('facilities')}
          >
            Facilities
          </li>
          <li 
            className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </li>
        </ul>
        <div className="header-right">
          <div className="period-selector">{period}</div>
          <div className="user-profile">
            <div className="avatar">JD</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="summary-metrics">
          <div className="metric-card waste-summary">
            <div className="metric-header">
              <div className="metric-title">Total Waste</div>
              <div className="metric-actions">
                <button className="action-icon" onClick={handleExport}>📥</button>
                <button className="action-icon" onClick={handleShare}>📤</button>
              </div>
            </div>
            <div className="metric-value">{metrics.totalWaste.value}</div>
            <div className={`metric-trend ${metrics.totalWaste.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.totalWaste.trend}
            </div>
            <div className="metric-divider"></div>
            <div className="metric-subtitle">Cost Impact</div>
            <div className="metric-value">{metrics.totalWaste.costImpact}</div>
            <div className={`metric-trend ${metrics.totalWaste.costIsUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.totalWaste.costTrend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Recycling Rate</div>
            <div className="metric-value">{metrics.recyclingRate.value}</div>
            <div className={`metric-trend ${metrics.recyclingRate.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.recyclingRate.trend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Cost Savings</div>
            <div className="metric-value">{metrics.costSavings.value}</div>
            <div className={`metric-trend ${metrics.costSavings.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.costSavings.trend}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Carbon Reduction</div>
            <div className="metric-value">{metrics.carbonReduction.value}</div>
            <div className={`metric-trend ${metrics.carbonReduction.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.carbonReduction.trend}
            </div>
          </div>
        </section>

        <section className="card waste-by-category">
          <div className="card-header">
            <h2 className="card-title">Waste by Category</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="donut-chart">
              {/* Donut chart would be rendered here */}
              <div className="donut-center">
                <div className="donut-value">2,450 kg</div>
                <div className="donut-label">Total Waste</div>
              </div>
            </div>
          </div>
          <div className="categories-legend">
            {wasteCategories.map(category => (
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

        <section className="card waste-trend">
          <div className="card-header">
            <h2 className="card-title">Waste Trend</h2>
            <div className="card-actions">
              <button 
                className={`card-action ${showProductionOverlay ? 'active' : ''}`}
                onClick={toggleProductionOverlay}
                title="Toggle Production Overlay"
              >
                📊
              </button>
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="chart-container">
            {/* Line chart would be rendered here */}
            <div className="chart-placeholder">
              <div className="chart-legend">
                {wasteTrendData.datasets.map(dataset => (
                  <div key={dataset.name} className="chart-legend-item">
                    <div 
                      className="chart-legend-color" 
                      style={{ backgroundColor: dataset.color }}
                    />
                    <span>{dataset.name}</span>
                  </div>
                ))}
                {showProductionOverlay && (
                  <div className="chart-legend-item">
                    <div className="chart-legend-color production" />
                    <span>Production Volume</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card facility-comparison">
          <div className="card-header">
            <h2 className="card-title">Facility Comparison</h2>
            <div className="card-actions">
              <div className="sort-controls">
                <button 
                  className={`sort-button ${sortBy === 'volume' ? 'active' : ''}`}
                  onClick={() => handleSortChange('volume')}
                >
                  Volume
                </button>
                <button 
                  className={`sort-button ${sortBy === 'percentage' ? 'active' : ''}`}
                  onClick={() => handleSortChange('percentage')}
                >
                  Per Unit
                </button>
              </div>
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="bars-container">
            {sortedFacilities.map(facility => (
              <div key={facility.name} className="bar-group">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${facility.value}%`,
                    backgroundColor: facility.color
                  }}
                />
                <div className="bar-label">{facility.name}</div>
                <div className="bar-details">
                  <div>{facility.totalWaste}</div>
                  <div className="bar-detail-small">{facility.wastePerUnit}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card reduction-progress">
          <div className="card-header">
            <h2 className="card-title">Reduction Progress</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="gauge-container">
            <div className="gauge">
              <div 
                className="gauge-fill" 
                style={{ height: `${reductionTargets.current}%` }}
              />
              <div 
                className="gauge-marker target" 
                style={{ left: `${reductionTargets.target}%` }}
              />
              <div 
                className="gauge-marker industry" 
                style={{ left: `${reductionTargets.industryAverage}%` }}
              />
              <div 
                className="gauge-marker best" 
                style={{ left: `${reductionTargets.bestPractice}%` }}
              />
            </div>
            <div className="gauge-value">{reductionTargets.current}%</div>
          </div>
          <div className="progress-details">
            <div className="progress-item">
              <div className="progress-label">Target</div>
              <div className="progress-value">{reductionTargets.target}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Current</div>
              <div className="progress-value">{reductionTargets.current}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Industry Avg.</div>
              <div className="progress-value">{reductionTargets.industryAverage}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Best Practice</div>
              <div className="progress-value">{reductionTargets.bestPractice}%</div>
            </div>
          </div>
        </section>

        {/* New Sustainability Score Card */}
        <section className="card sustainability-score">
          <div className="card-header">
            <h2 className="card-title">Sustainability Score</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="score-container">
            <div className="score-circle">
              <div className="score-value">{sustainabilityScore.overall}</div>
              <div className="score-label">Overall</div>
            </div>
            <div className="score-comparison">
              <div className="comparison-item">
                <div className="comparison-label">Industry Avg.</div>
                <div className="comparison-value">{sustainabilityScore.industryAverage}</div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Best Practice</div>
                <div className="comparison-value">{sustainabilityScore.bestPractice}</div>
              </div>
            </div>
          </div>
          <div className="score-components">
            {sustainabilityScore.components.map(component => (
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

        {/* New Financial Impact Card */}
        <section className="card financial-impact">
          <div className="card-header">
            <h2 className="card-title">Financial Impact</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="financial-summary">
            <div className="financial-item">
              <div className="financial-label">Current Waste Cost</div>
              <div className="financial-value">${financialImpact.currentWasteCost.toLocaleString()}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">Potential Savings</div>
              <div className="financial-value savings">${financialImpact.potentialSavings.toLocaleString()}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">ROI</div>
              <div className="financial-value">{financialImpact.roi}%</div>
            </div>
          </div>
          <div className="financial-breakdown">
            <h3 className="breakdown-title">Cost Breakdown by Category</h3>
            <div className="breakdown-chart">
              {/* Bar chart would be rendered here */}
              <div className="breakdown-bars">
                {financialImpact.breakdown.map(item => (
                  <div key={item.category} className="breakdown-bar-group">
                    <div className="breakdown-bar-label">{item.category}</div>
                    <div className="breakdown-bar-container">
                      <div 
                        className="breakdown-bar cost" 
                        style={{ 
                          height: `${(item.cost / financialImpact.currentWasteCost) * 100}%`,
                          backgroundColor: '#ff3b30'
                        }}
                      />
                      <div 
                        className="breakdown-bar savings" 
                        style={{ 
                          height: `${(item.savings / financialImpact.potentialSavings) * 100}%`,
                          backgroundColor: '#34c759'
                        }}
                      />
                    </div>
                    <div className="breakdown-bar-values">
                      <div className="breakdown-value">${item.cost}</div>
                      <div className="breakdown-savings">${item.savings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* New Material Recovery Card */}
        <section className="card material-recovery">
          <div className="card-header">
            <h2 className="card-title">Material Recovery</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="recovery-summary">
            <div className="recovery-item">
              <div className="recovery-value">{materialRecovery.totalRecovered} kg</div>
              <div className="recovery-label">Total Recovered</div>
            </div>
            <div className="recovery-item">
              <div className="recovery-value">{materialRecovery.recoveryRate}%</div>
              <div className="recovery-label">Recovery Rate</div>
            </div>
          </div>
          <div className="recovery-materials">
            <h3 className="materials-title">Recovered Materials</h3>
            <div className="materials-table">
              <div className="materials-header">
                <div className="material-name">Material</div>
                <div className="material-recovered">Recovered</div>
                <div className="material-potential">Potential</div>
                <div className="material-value">Value</div>
              </div>
              {materialRecovery.materials.map(material => (
                <div key={material.name} className="material-row">
                  <div className="material-name">{material.name}</div>
                  <div className="material-recovered">{material.recovered} kg</div>
                  <div className="material-potential">{material.potential} kg</div>
                  <div className="material-value">${material.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="recovery-destinations">
            <h3 className="destinations-title">Recovery Destinations</h3>
            <div className="destinations-chart">
              {/* Pie chart would be rendered here */}
              <div className="destinations-legend">
                {materialRecovery.destinations.map(destination => (
                  <div key={destination.name} className="destination-item">
                    <div className="destination-color" style={{ 
                      backgroundColor: destination.name === 'Recycled into new fabric' ? '#34c759' : 
                                      destination.name === 'Upcycled into products' ? '#5856d6' : 
                                      destination.name === 'Industrial applications' ? '#ff9500' : '#2c6ecb'
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

        {/* Enhanced Insights Panel */}
        <section className="card insights-panel">
          <div className="card-header">
            <h2 className="card-title">Actionable Insights</h2>
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
                        <div className="detail-label">Potential Savings:</div>
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