import React, { useState } from 'react';
import male from './male.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const App = () => {
  const gradientColors = [
    // 'white',
    "#67E0DD",
    '#A6D8DF',
    '#C5E8E2',
    '#94BBDF',
    '#DBDAE0',
    '#FAE8E1',
  ];
  const [inputUrl, setInputUrl] = useState('');
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanMessages, setScanMessages] = useState([]);

  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: 'calc(100% - 120px)', // Adjusted width
    padding: '20px',
    fontSize: '16px',
    borderRadius: '5px 0 0 5px', // Adjusted border-radius
    border: 'none',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  };

  const scanButtonStyle = {
    width: '120px',
    height: '100%',
    fontSize: '16px',
    borderRadius: '0 5px 5px 0',
    border: 'none',
    background: '#005A7B',
    color: '#FFF',
    cursor: 'pointer',
  };

  const scanMessagesStyle = {
    marginTop: '10px',
    color: '#005A7B',
    textAlign: 'left',
  };

  const containerStyle = {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '8px',
    //  8px 8px rgba(0, 0, 0, 0.1)',
    flex: '1',
    boxSizing: 'border-box',
    overflow: 'hidden', // Ensure the image doesn't overflow
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '40px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '40px', // Added padding
  };

  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientColors.join(',')})`,
    backgroundColor: 'white',
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const quoteStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '1rem', // Adjusted margin
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const handleScan = async () => {
    setScanning(true);
    setScanMessages([]);


    // Simulate scanning steps with timeouts
    const scanSteps = [
      'Scanning the domain name...',
      'Checking the SSL certificate...',
      'Analyzing potential threats...',
    ];

    const scanPromises = scanSteps.map((step, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setScanMessages((prevMessages) => [...prevMessages, step]);
          resolve();
        }, index * 2000);
      });
    });

    

    await axios.post('http://localhost:5000/tickNotTick', { "url": inputUrl })
      .then((response) => {
        console.log('API response:', response.data);
        const fetchdd = response.data;
        // Handle the API response as needed

        // Navigate to the /results route after scanning is complete
        Promise.all(scanPromises).then(() => {
          setTimeout(() => {
            console.log('inputUrl before navigating:', inputUrl);
            setScanning(false);
            navigate('/results', { state: { inputUrl , fetchdd}  });
          }, 1000); // Adjust the delay as needed
        });
      })
      .catch((error) => {
        console.error('Error making API request:', error);
        // Handle the error as needed
        setScanning(false); // Set scanning to false in case of an error
      });


    // Make the API request to /api/ticknottick
    // Assuming you want to send inputUrl as data to the API
  };

  // ...

  // Move this part inside the handleScan function or remove it
  // ...

  return (
    <div style={gradientStyle}>
      <div style={contentStyle}>
        <div style={quoteStyle}>
          Guardians of the Net: Where Safety Meets Cyber.
          <div>PhishNet - Your Shield Against Phishing Threats in Real-Time.</div>
          <div style={inputContainerStyle}>
            <input
              type="text"
              placeholder="Type something..."
              style={inputStyle}
              value={inputUrl} // Ensure it's bound to the state
              onChange={(e) => setInputUrl(e.target.value)}
              disabled={scanning}
            />

            <button onClick={handleScan} style={scanButtonStyle} disabled={scanning}>
              {scanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>
          {scanning && (
            <div style={scanMessagesStyle}>
              {scanMessages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )}
        </div>
        <div style={containerStyle}>
          <img src={male} alt="" style={{ width: '100%', borderRadius: '10px' }} />
        </div>
      </div>
    </div>
  );
};

export default App;

