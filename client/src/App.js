import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>📊 Social Media Dashboard</h1>
        <p>Welcome to your analytics dashboard</p>
      </header>
      <main>
        {isLoggedIn ? (
          <div>
            <h2>Dashboard</h2>
            <p>Dashboard content will go here</p>
          </div>
        ) : (
          <div>
            <h2>Please Log In</h2>
            <p>Authentication page will go here</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;