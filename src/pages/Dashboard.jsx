import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('This Month');

  // Sample data - in a real app, this would come from props or API
  const metrics = {
    totalWaste: { value: '2,450 kg', trend: '+5.2%', isUp: true },
    recyclingRate: { value: '68%', trend: '+2.1%', isUp: true },
    costSavings: { value: '$12,400', trend: '-1.8%', isUp: false },
    carbonReduction: { value: '3.2 tons', trend: '+4.5%', isUp: true }
  };

  const wasteCategories = [
    { name: 'Organic', value: 35, color: '#34c759' },
    { name: 'Paper', value: 25, color: '#5856d6' },
    { name: 'Plastic', value: 20, color: '#ff9500' },
    { name: 'Metal', value: 15, color: '#ff3b30' },
    { name: 'Other', value: 5, color: '#8e8e93' }
  ];

  const facilities = [
    { name: 'Facility A', value: 85, color: '#2c6ecb' },
    { name: 'Facility B', value: 65, color: '#34c759' },
    { name: 'Facility C', value: 45, color: '#ff9500' }
  ];

  const insights = [
    {
      title: 'High Plastic Waste in Facility B',
      description: 'Plastic waste increased by 15% compared to last month',
      icon: '⚠️',
      color: '#ff3b30'
    },
    {
      title: 'Recycling Efficiency Improved',
      description: 'Overall recycling rate improved by 5% across all facilities',
      icon: '📈',
      color: '#34c759'
    },
    {
      title: 'Cost Optimization Opportunity',
      description: 'Potential to save $2,400 by optimizing waste collection routes',
      icon: '💰',
      color: '#ff9500'
    }
  ];

  return (
    <div className="dashboard">
      <header>
        <div className="logo-container">
          <div className="logo">W</div>
          <span className="logo-text">WasteTrack</span>
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
          <div className="metric-card">
            <div className="metric-title">Total Waste</div>
            <div className="metric-value">{metrics.totalWaste.value}</div>
            <div className={`metric-trend ${metrics.totalWaste.isUp ? 'trend-up' : 'trend-down'}`}>
              {metrics.totalWaste.trend}
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
              <div key={category.name} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name} ({category.value}%)</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card waste-trend">
          <div className="card-header">
            <h2 className="card-title">Waste Trend</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          {/* Line chart would be rendered here */}
        </section>

        <section className="card facility-comparison">
          <div className="card-header">
            <h2 className="card-title">Facility Comparison</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          <div className="bars-container">
            {facilities.map(facility => (
              <div key={facility.name} className="bar-group">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${facility.value}%`,
                    backgroundColor: facility.color
                  }}
                />
                <div className="bar-label">{facility.name}</div>
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
                style={{ height: '75%' }}
              />
              <div 
                className="gauge-marker" 
                style={{ left: '75%' }}
              />
            </div>
            <div className="gauge-value">75%</div>
          </div>
          <div className="progress-details">
            <div className="progress-item">
              <div className="progress-label">Target</div>
              <div className="progress-value">80%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Current</div>
              <div className="progress-value">75%</div>
            </div>
          </div>
        </section>

        <section className="card insights-panel">
          <div className="card-header">
            <h2 className="card-title">Insights</h2>
            <div className="card-actions">
              <button className="card-action">⋮</button>
            </div>
          </div>
          {insights.map((insight, index) => (
            <div key={index} className="insight-item">
              <div 
                className="insight-icon"
                style={{ backgroundColor: insight.color }}
              >
                {insight.icon}
              </div>
              <div className="insight-info">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-desc">{insight.description}</div>
              </div>
            </div>
          ))}
          <button className="action-button">View All Insights</button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;