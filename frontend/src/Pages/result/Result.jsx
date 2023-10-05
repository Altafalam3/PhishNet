import { useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const { state } = location;

  const fetchd = state.fetchdd;

const extractedAnchors = fetchd.extracted_anchors;
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
    backgroundColor : "#E6F4FF",
    padding : "4vh  3vw"
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
    // backgroundColor: '#E6F4FF',
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

  // const [ccolor, setCcolor] = useState("#f2f2f2")
  const cardStyle = {
    backgroundColor: '#f2f2f2',
    padding: '1rem',
    borderRadius: '8px',
    maxWidth : "7vw"
  };
  const cardStyle_S = {
    backgroundColor: '#CCF2DC',
    padding: '1rem',
    borderRadius: '8px',
  };
  const cardStyle_F = {
    backgroundColor: '#FFD5D9',
    padding: '1rem',
    borderRadius: '8px',
  };

  const anotherTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
    padding : "4vh 10vw",
  };

  if(!fetchd){
    return <div>Loading .....</div>
  }

  return (
    <div style={containerStyle}>
      <div style={statusStyle}>
        <p style={{ ...urlTextStyle, color: 'black' }}>{state && state.inputUrl}</p>
      </div>
      <div style={scanResultsContainerStyle}>
        <h2 style={{ ...headingStyle, color: '#333' }}> <b>Scan Results</b> </h2>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCellStyle}>Source URL</td>
              <td style={valueCellStyle}>
              {/* {state.inputUrl} */}
                {fetchd.domain}
                </td>
            </tr>
            <tr>
              <td style={labelCellStyle}>Redirected URL</td>
              <td style={valueCellStyle}>{fetchd.redirectedURL === 0 ? "Redirects" : "No Redirection"}</td>
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
          <div  style={fetchd.https_domain === 0 ? cardStyle_S : cardStyle_F }> 
           <b>https domain</b>  : {fetchd.https_domain === 0 ? "Not Suspisious" : "Suspisious"}
          </div>
            <div  style={fetchd.iframe_redirection === 0 ? cardStyle_S : cardStyle_F }>
              
            <b>Iframe Redirection</b> : {fetchd.iframe_redirection === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.ip === 0 ? cardStyle_S : cardStyle_F }>
              
            <b>IP Address</b> : {fetchd.ip === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.right_click_disabled === 0 ? cardStyle_S : cardStyle_F }>
              
            <b>Right Click Disabled</b>: {fetchd.right_click_disabled === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.tiny_url === 0 ? cardStyle_S : cardStyle_F }>
              
            <b>Tiny Url</b> : {fetchd.tiny_url === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.https_domain === 0 ? cardStyle_S : cardStyle_F }>
              
            <b>Https domain</b>  : {fetchd.https_domain === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.url_depth === 0 ? cardStyle_S : cardStyle_F }>
              
            <b> URL Depth </b>: {fetchd.url_depth === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.url_forwarding === 0 ? cardStyle_S : cardStyle_F }>
              
            <b> Url Forwarding </b>: {fetchd.url_forwarding === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
            <div  style={fetchd.url_length === 0 ? cardStyle_S : cardStyle_F }>
              
            <b> URL Length </b>: {fetchd.url_length === 0 ? "Not Suspisious" : "Suspisious"}
            </div>
        </div>

        <table style={anotherTableStyle}>
          <h3 style={{ color: 'black' }}>Embedded links</h3>

          <tbody style={cardStyle}>
            <th style={{"maxWidth" : "7vw"}}>
              {/* Embedded Links for redirecting */}
            </th>

            {extractedAnchors.map((item, i) => (
            <tr key={i} style={{"maxWidth" : "7vw"}}>
              <td style={valueCellStyle}>{item}</td>
              <td style={valueCellStyle}><button >Analyze</button></td>
            </tr>
        ))}
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

