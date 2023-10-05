// import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const { state } = location;
  const [locationData, setLocationData] = useState(null);
  const apiKey = 'ec51576d4710b2';
    const scanResults = {
    sourceURL: 'https://example.com',
    redirectedURL: 'https://redirected-example.com',
    hostingProvider: 'Example Hosting',
    ipAddress: '192.168.1.1',
    firstSeen: '7/8/2023, 3:30:00 pm',
  };
 const [ipInfo, setIpInfo] = useState(null);

  useEffect(() => {
    const fetchIpLocation = async () => {
      try {
        const response = await axios.get('https://api.iplocation.net/?ip=192.168.1.1');
        setIpInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching IP location:', error);
      }
    };

    fetchIpLocation();
  }, []);


  const statusStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: '7rem',
  };

  const urlTextStyle = {
    textAlign: 'center',
    color: 'black',
    margin: 0,
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

  const scanResultsContainerStyle = {
    marginTop: '2rem',
  };

  const headingStyle = {
    color: 'black',
    fontSize: '1.5rem',
    marginBottom: '1rem',
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

  const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '1rem',
    marginTop: '2rem',
  };

  const cardStyle = {
    backgroundColor: '#f2f2f2',
    padding: '1rem',
    borderRadius: '8px',
  };

  const anotherTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
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

        <div style={cardsContainerStyle}>
          {[...Array(9)].map((_, index) => (
            <div key={index} style={cardStyle}>
              Card {index + 1}
            </div>
          ))}
        </div>

        <table style={anotherTableStyle}>
          <h3 style={{ color: 'black' }}>Embedded links</h3>

          <tbody>
            <tr>
              
              <td style={valueCellStyle}>Value 1</td>
            </tr>
            <tr>
              
              <td style={valueCellStyle}>Value 2</td>
            </tr>
          </tbody>
        </table>
       <div>
      <h2>IP Location Example</h2>
      {ipInfo ? (
        <div>
          <p>IP: {ipInfo.ip}</p>
          <p>Country: {ipInfo.country_name}</p>
          <p>ISP: {ipInfo.isp}</p>
          {/* Add more information as needed */}
        </div>
      ) : (
        <p>Loading IP location...</p>
      )}
    </div>
      </div>
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  padding: '2rem',
  alignItems: 'center',
  height: '76vh',
  overflowX: 'hidden',
  color: 'black',
};

export default Result;

