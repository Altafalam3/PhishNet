import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Result = () => {
  const location = useLocation();
  const { state } = location;

  // Mock scan results data
  const scanResults = {
    sourceURL: 'https://example.com',
    redirectedURL: 'https://redirected-example.com',
    hostingProvider: 'Example Hosting',
    ipAddress: '192.168.1.1',
    firstSeen: '7/8/2023, 3:30:00 pm',
  };

  return (
    <div style={containerStyle}>
      <div style={statusStyle}>
        <p style={{ ...urlTextStyle, color: 'black' }}>{state && state.inputUrl}</p>
        <div style={urlBoxStyle}>
          <div style={{ color: 'white' }}>Clean</div>
        </div>
      </div>
      <div style={scanResultsContainerStyle}>
        <h2 style={{ ...headingStyle, color: '#333' }}>Scan Results</h2>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCellStyle}>Source URL</td>
              <td style={valueCellStyle}>{state.inputUrl}</td>
            </tr>
            <tr>
              <td style={labelCellStyle}>Redirected URL</td>
              <td style={valueCellStyle}>{scanResults.redirectedURL}</td>
            </tr>
            <tr>
              <td style={labelCellStyle}>Hosting Provider</td>
              <td style={valueCellStyle}>{scanResults.hostingProvider}</td>
            </tr>
            <tr>
              <td style={labelCellStyle}>IP Address</td>
              <td style={valueCellStyle}>{scanResults.ipAddress}</td>
            </tr>
            <tr>
              <td style={labelCellStyle}>First Seen</td>
              <td style={valueCellStyle}>{scanResults.firstSeen}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ... (rest of the code remains the same)


const containerStyle = {
  textAlign: 'center',
       padding: '2rem',
       alignItems: 'center',
       height: "76vh",
       overflow: 'hidden',
  color:'black'
};

const urlBoxStyle = {
  backgroundColor: 'green',
  borderRadius: '50%',
  height: '3rem',
  width: '6rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '1rem auto',
};

const urlTextStyle = {
//   color: 'white',
       textAlign: 'center',
  color:'black',
  margin: 0,
};

const scanResultsContainerStyle = {
  marginTop: '2rem',
};

const headingStyle = {
  color: 'black',
  fontSize: '1.5rem',
  marginBottom: '1rem',
};
const statusStyle = {
       display: 'flex',
       width: '100%',
       justifyContent: 'center',
       alignItems:'center',
       gap: '1rem',
       marginLeft:'7rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const labelCellStyle = {
  padding: '12px',
  backgroundColor: '#f2f2f2',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold',
};

const valueCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const footerStyle = {
  marginTop: '2rem',
  fontSize: '0.8rem',
};

const heartIconStyle = {
  color: 'red',
};

export default Result;
