import React from 'react';

const SummaryCard = ({ icon, label, value }) => {
  return (
    <div className="card summary-card">
      <div className="card-icon">{icon}</div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default SummaryCard;