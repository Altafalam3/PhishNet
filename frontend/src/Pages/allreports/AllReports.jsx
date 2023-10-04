import React from 'react';

const AllReports = () => {
  const data = [
    {
      url: 'iddanakaget2023-2.vercel.app',
      reportedBy: 'canyouhearmeouthere@gmail.com',
      reportedOn: '7/8/2023, 3:18:46 pm',
      description: 'Shared in my senior high school with Dana Id look like official account',
    },
    // Add more data as needed
  ];

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
          {data.map((report, index) => (
            <tr key={index} style={(index + 1) % 2 === 0 ? { background: '#f9f9f9' } : null}>
              <td style={cellStyle}>{report.url}</td>
              <td style={cellStyle}>{report.reportedBy}</td>
              <td style={cellStyle}>{report.reportedOn}</td>
              <td style={cellStyle}>{report.description}</td>
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
  color:'black',
};
const reportsContainer = {
       overflow: 'hidden',
       margin:'2rem',
};

export default AllReports;
