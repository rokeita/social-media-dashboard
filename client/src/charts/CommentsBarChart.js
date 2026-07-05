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

const CommentsBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data">No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Comments Activity</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
          <Bar
            dataKey="comments"
            fill="#4ecdc4"
            name="Total Comments"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="posts"
            fill="#a8edea"
            name="Posts"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommentsBarChart;
