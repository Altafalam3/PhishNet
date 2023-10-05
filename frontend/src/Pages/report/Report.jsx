import React, { useState, useEffect } from 'react';
import './Report.css';
import axios from 'axios'; // Import Axios

import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

const Report = () => {
  const { isLoggedIn, userr } = useContext(UserContext);

  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('phishing');

  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const gradientColors = [
    '#67E0DD',
    '#A6D8DF',
    '#C5E8E2',
    '#94BBDF',
    '#DBDAE0',
    '#FAE8E1',
  ];
  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientColors.join(',')})`,
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // useEffect(() => {
  //   fetchCategoryData();
  // }, []);

  // const fetchCategoryData = async () => {
  //   try {
  //     // jab aayega yehhh tabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  //     const response = await axios.get('http://localhost:5000/model', {
  //        formdata: {
  //         url: link,
  //       },
  //     });

  //     const { category } = response.data;
  //     setCategory(category);
  //   } catch (error) {
  //     console.error('Error fetching category data:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // fetchCategoryData();
    setConfirmationOpen(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData object
      const formData = {
        "domainName": link,
        "emailId": userr.email,
        "details": description,
        "category": category
      }

      // Make a POST request to /api/reportdomain to submit the FormData
      const response = await axios.post('http://localhost:8800/api/reportdomain/', formData);

      // Handle the response from the backend as needed
      console.log('Report submitted successfully:', response.data);

      // reset
      alert("Report Submitted")
      setLink('');
      setDescription('');

      // After submitting, you can redirect the user or show a success message
      setConfirmationOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
  };

  return (
    <div style={gradientStyle}>
      <div className="report-container">
        <h2>Report a Phishing Link</h2>

        <div className="input-container">
          <label htmlFor="linkInput">Phishing Link:</label>
          <input
            type="text"
            id="linkInput"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter the suspected phishing link"
          />
        </div>

        <div className="input-container">
          <label htmlFor="descriptionInput">Description:</label>
          <textarea
            id="descriptionInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional details or context"
          />
        </div>

        {category && (
          <div className="input-container">
            <label>Category:</label>
            <span>{category}</span>
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>

        {isConfirmationOpen && (
          <div className="confirmation-dialog">
            <p>Are you sure you want to submit this report?</p>
            <button className="confirm-button" onClick={handleConfirm}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
