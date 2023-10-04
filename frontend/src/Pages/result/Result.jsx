import React from 'react';
import { useLocation } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { state } = location;

  console.log('Location state:', state);

  return (
    <div>
      <h1>Scan Results</h1>
      <p>Input URL: {state && state.inputUrl}</p>
    </div>
  );
};

export default Result;

