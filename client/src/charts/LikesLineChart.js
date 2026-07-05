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

const LikesLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Likes Over Time</h3>
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
            formatter={(value) => value.toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#ff6b6b"
            dot={{ fill: '#ff6b6b', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Total Likes"
          />
          <Line
            type="monotone"
            dataKey="avgLikesPerPost"
            stroke="#ff9999"
            dot={{ fill: '#ff9999', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Avg Likes/Post"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LikesLineChart;
