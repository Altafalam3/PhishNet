import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllReports = () => {
  const [reportDomains, setReportDomains] = useState([]);

  useEffect(() => {
    // Fetch report domains from your Express API
    axios.get('http://localhost:8800/api/reportdomain') // Update the URL to match your API route
      .then((response) => {
        setReportDomains(response.data);
      })
      .catch((error) => {
        console.error('Error fetching report domains:', error);
      });
  }, []);

  return (
    <div style={reportsContainer}>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '2rem', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={cellStyle}>URL</th>
            <th style={cellStyle}>Reported By</th>
            <th style={cellStyle}>Reported On</th>
            <th style={cellStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {reportDomains.map((report, index) => (
            <tr key={index} style={(index + 1) % 2 === 0 ? { background: '#f9f9f9' } : null}>
              <td style={cellStyle}>{report.domainName}</td>
              <td style={cellStyle}>{report.emailId}</td>
              <td style={cellStyle}>{report.createdAt}</td> {/* Assuming createdAt field contains reported date */}
              <td style={cellStyle}>{report.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
  color: 'black',
};
const reportsContainer = {
  overflow: 'hidden',
  margin: '2rem',
};

export default AllReports;
