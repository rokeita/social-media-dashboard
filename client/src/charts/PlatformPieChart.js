import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const PlatformPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4ecdc4', '#ff6b6b', '#ffd93d'];

  const chartData = data.map((item, index) => ({
    name: item.platform,
    value: item.likes || 0,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="chart-container">
      <h3>Engagement by Platform</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformPieChart;
