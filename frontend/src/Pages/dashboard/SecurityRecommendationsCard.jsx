import React from 'react';

const SecurityRecommendationsCard = ({ recommendations }) => {
  return (
    <div className="card1">
      <h2 className="card-title">Security Recommendations</h2>
      <ul className="recommendations-list">
        {recommendations.map((item, index) => (
          <li key={index} className="recommendation-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SecurityRecommendationsCard;
