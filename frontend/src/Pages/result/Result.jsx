import { useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {

  const fetchd = {
    "at_sign": 0,
    "domain": "google.com",
    "extracted_anchors": [
        "https://www.google.com/imghp?hl=en&tab=wi",
        "https://maps.google.co.in/maps?hl=en&tab=wl",
        "https://play.google.com/?hl=en&tab=w8",
        "https://www.youtube.com/?tab=w1",
        "https://news.google.com/?tab=wn",
        "https://mail.google.com/mail/?tab=wm",
        "https://drive.google.com/?tab=wo",
        "https://www.google.co.in/intl/en/about/products?tab=wh",
        "http://www.google.co.in/history/optout?hl=en",
        "https://accounts.google.com/ServiceLogin?hl=en&passive=true&continue=https://www.google.com/&ec=GAZAAQ",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=hi&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAU",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=bn&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAY",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=te&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAc",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=mr&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAg",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=ta&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAk",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=gu&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAo",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=kn&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAs",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=ml&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCAw",
        "https://www.google.com/setprefs?sig=0_HXZl7qIOTmULCsgT_SMMCeMWSZY%3D&hl=pa&source=homepage&sa=X&ved=0ahUKEwiciYms1t2BAxXYRN4KHS8gC1EQ2ZgBCA0",
        "http://www.google.co.in/services/",
        "https://www.google.com/setprefdomain?prefdom=IN&prev=https://www.google.co.in/&sig=K_3BRuPzFB_LrNcXrHUXlrR3atrBE%3D"
    ],
    "https_domain": 0,
    "iframe_redirection": 0,
    "ip": 0,
    "message": "Analysis complete",
    "mouse_over_effect": 0,
    "redirection": 0,
    "result_conclusion": "Website may be safe",
    "right_click_disabled": 1,
    "tiny_url": 0,
    "triggers": {
        "feature_extraction_triggers": 1,
        "html_js_triggers": 0,
        "total_triggers": 2,
        "whois_triggers": 1
    },
    "url_depth": 0,
    "url_forwarding": -1,
    "url_length": 0,
    "whois_data": {
        "address": null,
        "city": null,
        "country": "US",
        "creation_date": [
            "Mon, 15 Sep 1997 04:00:00 GMT",
            "Mon, 15 Sep 1997 07:00:00 GMT"
        ],
        "dnssec": "unsigned",
        "domain_name": [
            "GOOGLE.COM",
            "google.com"
        ],
        "emails": [
            "abusecomplaints@markmonitor.com",
            "whoisrequest@markmonitor.com"
        ],
        "expiration_date": [
            "Thu, 14 Sep 2028 04:00:00 GMT",
            "Wed, 13 Sep 2028 07:00:00 GMT"
        ],
        "name": null,
        "name_servers": [
            "NS1.GOOGLE.COM",
            "NS2.GOOGLE.COM",
            "NS3.GOOGLE.COM",
            "NS4.GOOGLE.COM",
            "ns2.google.com",
            "ns4.google.com",
            "ns1.google.com",
            "ns3.google.com"
        ],
        "org": "Google LLC",
        "referral_url": null,
        "registrant_postal_code": null,
        "registrar": "MarkMonitor, Inc.",
        "state": "CA",
        "status": [
            "clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited",
            "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
            "clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited",
            "serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited",
            "serverTransferProhibited https://icann.org/epp#serverTransferProhibited",
            "serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited",
            "clientUpdateProhibited (https://www.icann.org/epp#clientUpdateProhibited)",
            "clientTransferProhibited (https://www.icann.org/epp#clientTransferProhibited)",
            "clientDeleteProhibited (https://www.icann.org/epp#clientDeleteProhibited)",
            "serverUpdateProhibited (https://www.icann.org/epp#serverUpdateProhibited)",
            "serverTransferProhibited (https://www.icann.org/epp#serverTransferProhibited)",
            "serverDeleteProhibited (https://www.icann.org/epp#serverDeleteProhibited)"
        ],
        "updated_date": [
            "Mon, 09 Sep 2019 15:39:04 GMT",
            "Mon, 09 Sep 2019 15:39:04 GMT"
        ],
        "whois_server": "whois.markmonitor.com"
    }
}


const extractedAnchors = fetchd.extracted_anchors;
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

