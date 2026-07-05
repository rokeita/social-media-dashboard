import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    followers: 25430,
    likes: 98210,
    comments: 12534,
    engagement: 8.7,
    posts: 320
  });

  return (
    <div className="dashboard-container">
      <h2>Dashboard Overview</h2>
      <div className="dashboard">
        <SummaryCard icon="👥" label="Followers" value={stats.followers.toLocaleString()} />
        <SummaryCard icon="❤️" label="Likes" value={stats.likes.toLocaleString()} />
        <SummaryCard icon="💬" label="Comments" value={stats.comments.toLocaleString()} />
        <SummaryCard icon="📈" label="Engagement" value={`${stats.engagement}%`} />
        <SummaryCard icon="📊" label="Posts" value={stats.posts} />
      </div>
    </div>
  );
};

export default Dashboard;