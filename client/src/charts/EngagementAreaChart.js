import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EngagementAreaChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Engagement Trend</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.6}
            name="Engagement"
          />
          <Area
            type="monotone"
            dataKey="avgEngagement"
            stroke="#764ba2"
            fill="#764ba2"
            fillOpacity={0.3}
            name="Avg Engagement"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementAreaChart;
