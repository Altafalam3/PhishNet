import React, { useState } from 'react';
import './Report.css'

const Report = () => {
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
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

  const handleSubmit = () => {
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    // Implement the logic to submit the report (e.g., API call)
    console.log('Link:', link);
    console.log('Description:', description);

    // After submitting, you can redirect the user or show a success message
    setConfirmationOpen(false);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
  };

  return (
    <div style={gradientStyle}>
    <div className="report-container">
      <h2>Report a Phishing Link</h2>

      {/* Link Input */}
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

      {/* Description Input */}
      <div className="input-container">
        <label htmlFor="descriptionInput">Description:</label>
        <textarea
          id="descriptionInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details or context"
        />
      </div>

      {/* Submit Button */}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>

      {/* Confirmation Dialog */}
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


