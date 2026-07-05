import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PlatformComparisonChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Platform Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="platform" stroke="#666" />
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
          <Bar dataKey="posts" fill="#667eea" name="Posts" radius={[8, 8, 0, 0]} />
          <Bar dataKey="likes" fill="#ff6b6b" name="Likes" radius={[8, 8, 0, 0]} />
          <Bar dataKey="comments" fill="#4ecdc4" name="Comments" radius={[8, 8, 0, 0]} />
          <Bar dataKey="shares" fill="#ffd93d" name="Shares" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformComparisonChart;
