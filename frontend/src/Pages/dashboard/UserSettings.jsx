// UserSettings.js
import React, { useState } from 'react';

const UserSettings = () => {
  const [notificationPreferences, setNotificationPreferences] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState('medium');
  const [displayMetrics, setDisplayMetrics] = useState(['name', 'gmail', 'premium']);

  const handleSaveSettings = () => {
    // Implement save settings logic
  };

  return (
    <div>
      <h2>User Settings</h2>
      <div>
        <label>
          Receive Notifications:
          <input
            type="checkbox"
            checked={notificationPreferences}
            onChange={() => setNotificationPreferences(!notificationPreferences)}
          />
        </label>
      </div>
      <div>
        <label>
          Sensitivity Level:
          <select value={sensitivityLevel} onChange={(e) => setSensitivityLevel(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Display Metrics:
          <select
            multiple
            value={displayMetrics}
            onChange={(e) => setDisplayMetrics(Array.from(e.target.selectedOptions, (option) => option.value))}
          >
            <option value="name">Name</option>
            <option value="gmail">Gmail</option>
            <option value="premium">Premium Account</option>
          </select>
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default UserSettings;
