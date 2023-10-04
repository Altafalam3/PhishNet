// PhishingReportsHistory.js
import React from 'react';

const PhishingReportsHistory = ({ reports }) => {
  return (
    <div>
      <h2>Phishing Reports History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.date}</td>
              <td>{report.status}</td>
              <td>{report.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhishingReportsHistory;
