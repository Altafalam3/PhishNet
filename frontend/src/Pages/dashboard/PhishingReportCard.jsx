import React from 'react';

const PhishingReportCard = ({ reports }) => {
  return (
    <div>
      <h2>Phishing Report History</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            Date: {report.date}, Status: {report.status}, Outcome: {report.outcome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhishingReportCard;
