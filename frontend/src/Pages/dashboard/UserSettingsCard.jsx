import React from 'react';

const UserSettingsCard = ({ settings }) => {
  return (
    <div>
      <h2>User Settings</h2>
      <p>Name: {settings.name}</p>
      <p>Email: {settings.email}</p>
      <p>Premium Account: {settings.isPremium ? 'Yes' : 'No'}</p>
      {/* Add more settings based on your data */}
    </div>
  );
};

export default UserSettingsCard;

