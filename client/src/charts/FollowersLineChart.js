import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FollowersLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Followers Growth</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#667eea"
            dot={{ fill: '#667eea', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Followers"
          />
          <Line
            type="monotone"
            dataKey="growth"
            stroke="#764ba2"
            dot={{ fill: '#764ba2', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Daily Growth"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FollowersLineChart;
