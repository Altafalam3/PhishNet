import React, { useState } from 'react';

const ScanHistory = () => {
  // Sample scan history data
  const sampleScanHistory = [
    { date: '2023-10-01', url: 'https://example.com', suspicious: false },
    { date: '2023-09-28', url: 'https://phishingsite.com', suspicious: true },
    { date: '2023-09-25', url: 'https://legit-site.com', suspicious: false },
    // Add more entries as needed
  ];

  // State to manage the displayed scan history
  const [scanHistory, setScanHistory] = useState(sampleScanHistory);

  return (
    <div>
      <h2>Scan History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>URL</th>
            <th>Suspicious</th>
          </tr>
        </thead>
        <tbody>
          {scanHistory.map((entry, index) => (
            <tr key={index}>
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
