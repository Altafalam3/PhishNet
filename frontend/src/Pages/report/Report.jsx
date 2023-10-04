import React, { useEffect, useState } from 'react';

const Report = ({ domain }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Fetch report data based on the domain when the component mounts
    const fetchData = async () => {
      try {
        // Make an API call or fetch data based on the provided domain
        const response = await fetch(`/api/report?domain=${domain}`);
        const data = await response.json();

        // Update the state with the fetched report data
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [domain]);

  return (
    <div>
      <h2>Security Report for {domain}</h2>

      {reportData ? (
        <div>
          <h3>Summary:</h3>
          <p>Status: {reportData.status}</p>
          <p>SSL Certificate: {reportData.sslStatus}</p>
          <p>HTTPS Status: {reportData.httpsStatus}</p>

          <h3>Detailed Analysis:</h3>
          <ul>
            <li>
              <strong>Domain Age:</strong> {reportData.domainAge} days
            </li>
            <li>
              <strong>Registration Details:</strong> {reportData.registrationDetails}
            </li>
            <li>
              <strong>Web Page Content:</strong> {reportData.pageContentAnalysis}
            </li>
            {/* Add more detailed analysis as needed */}
          </ul>

          <h3>Recommendations:</h3>
          <p>
            Based on the analysis, it is recommended to {reportData.recommendation}.
          </p>

          {/* Add more sections as needed */}
        </div>
      ) : (
        <p>Loading report...</p>
      )}
    </div>
  );
};

export default Report;
