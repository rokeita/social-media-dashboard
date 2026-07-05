import React from 'react';
import './Chart.css';

const StatCard = ({ icon, label, value, change, trend }) => {
  const isPositive = change >= 0;
  const trendClass = isPositive ? 'trend-positive' : 'trend-negative';
  const trendIcon = isPositive ? '📈' : '📉';

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className={`stat-change ${trendClass}`}>
          {trendIcon} {Math.abs(change)}%
        </span>
      </div>
      <h4 className="stat-label">{label}</h4>
      <p className="stat-value">{value}</p>
      {trend && <p className="stat-trend">{trend}</p>}
    </div>
  );
};

export default StatCard;
