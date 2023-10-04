import React from 'react';

const LeaderboardCard = ({ leaderboard }) => {
  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name} - {entry.submitted} reports
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeaderboardCard;
