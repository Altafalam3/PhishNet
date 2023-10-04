import React from 'react';

const CoinsCard = ({ coins }) => {
  return (
    <div>
      <h2>Coins</h2>
      <p>You have won {coins} coins!</p>
    </div>
  );
};

export default CoinsCard;
