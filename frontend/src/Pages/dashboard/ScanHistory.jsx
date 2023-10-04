import React, { useState } from 'react';
import './ScanHistory.css'; // Import your CSS file for styling

const ScanHistory = () => {
  const sampleScanHistory = [
    { date: '2023-10-01', url: 'https://example.com', suspicious: false },
    { date: '2023-09-28', url: 'https://phishingsite.com', suspicious: true },
    { date: '2023-09-25', url: 'https://legit-site.com', suspicious: false },
    // Add more entries as needed
  ];

  const [scanHistory, setScanHistory] = useState(sampleScanHistory);

  return (
    <div>
      <h2>Scan History</h2>
      <table className="scan-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>URL</th>
            <th>Suspicious</th>
          </tr>
        </thead>
        <tbody>
          {scanHistory.map((entry, index) => (
            <tr key={index} className={entry.suspicious ? 'suspicious-row' : ''}>
              <td>{entry.date}</td>
              <td>{entry.url}</td>
              <td>{entry.suspicious ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScanHistory;
