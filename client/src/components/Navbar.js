import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>📊 Dashboard</h1>
      </div>
      <div className="navbar-menu">
        <a href="#dashboard">Dashboard</a>
        <a href="#reports">Reports</a>
        <a href="#analytics">Analytics</a>
        <a href="#settings">Settings</a>
        {user && (
          <>
            <span className="user-name">{user.name}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;