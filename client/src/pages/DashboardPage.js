import React, { useState, useEffect } from 'react';
import FollowersLineChart from '../charts/FollowersLineChart';
import LikesLineChart from '../charts/LikesLineChart';
import CommentsBarChart from '../charts/CommentsBarChart';
import EngagementAreaChart from '../charts/EngagementAreaChart';
import PlatformPieChart from '../charts/PlatformPieChart';
import PlatformComparisonChart from '../charts/PlatformComparisonChart';
import StatCard from '../charts/StatCard';
import dashboardService from '../services/dashboardService';
import analyticsService from '../services/analyticsService';
import './DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard summary
      const summary = await dashboardService.getSummary();
      const cards = await dashboardService.getCards();
      const overview = await dashboardService.getOverview();

      // Fetch analytics data
      const followers = await analyticsService.getFollowersAnalytics(selectedPeriod);
      const likes = await analyticsService.getLikesAnalytics(selectedPeriod);
      const comments = await analyticsService.getCommentsAnalytics(selectedPeriod);
      const engagement = await analyticsService.getEngagementAnalytics(selectedPeriod);
      const platforms = await analyticsService.getPlatformComparison(selectedPeriod);

      setDashboardData({
        summary,
        cards,
        overview
      });

      setAnalyticsData({
        followers,
        likes,
        comments,
        engagement,
        platforms
      });
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page loading-state">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page error-state">
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  const cards = dashboardData?.cards?.cards || [];
  const overview = dashboardData?.overview?.overview || {};
  const followersAnalytics = analyticsData?.followers?.analytics?.data || [];
  const likesAnalytics = analyticsData?.likes?.analytics?.data || [];
  const commentsAnalytics = analyticsData?.comments?.analytics?.data || [];
  const engagementAnalytics = analyticsData?.engagement?.analytics?.data || [];
  const platformData = analyticsData?.platforms?.analytics?.data || [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <div className="period-selector">
          <label htmlFor="period">Time Period:</label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="dashboard-section">
        <h2>Quick Overview</h2>
        <div className="stats-grid">
          {cards.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              label={card.label}
              value={card.value}
              change={card.change}
            />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="dashboard-section">
        <h2>Analytics & Insights</h2>

        {/* Row 1: Line Charts */}
        <div className="charts-grid">
          <FollowersLineChart data={followersAnalytics} />
          <LikesLineChart data={likesAnalytics} />
        </div>

        {/* Row 2: Comments and Engagement */}
        <div className="charts-grid">
          <CommentsBarChart data={commentsAnalytics} />
          <EngagementAreaChart data={engagementAnalytics} />
        </div>

        {/* Row 3: Platform Analysis */}
        <div className="charts-grid">
          <PlatformPieChart data={platformData} />
          <PlatformComparisonChart data={platformData} />
        </div>
      </section>

      {/* Account Overview */}
      <section className="dashboard-section">
        <h2>Account Overview</h2>
        <div className="overview-container">
          <div className="overview-item">
            <h3>Connected Accounts</h3>
            <p className="overview-value">{overview.totalAccounts || 0}</p>
          </div>
          <div className="overview-item">
            <h3>Total Followers</h3>
            <p className="overview-value">{(overview.totalFollowers || 0).toLocaleString()}</p>
          </div>
          <div className="overview-item">
            <h3>Total Posts</h3>
            <p className="overview-value">{overview.totalPosts || 0}</p>
          </div>
          <div className="overview-item">
            <h3>Top Platform</h3>
            <p className="overview-value">
              {overview.topPerformingPlatform?._id || 'N/A'}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {overview.recentPosts && overview.recentPosts.length > 0 && (
        <section className="dashboard-section">
          <h2>Recent Posts</h2>
          <div className="posts-list">
            {overview.recentPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="post-item">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="post" className="post-image" />
                )}
                <div className="post-info">
                  <span className="post-platform">{post.platform}</span>
                  <p className="post-caption">{post.caption}</p>
                  <div className="post-stats">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>📤 {post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
