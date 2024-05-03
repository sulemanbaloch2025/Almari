import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import API_URL from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import './ReportForm.css'; // Import the CSS file for styling

function ReportForm() {
    const history = useHistory();
    const { sellerId } = useParams(); // This is the reportedUserId
    const [reason, setReason] = useState('');
    const userId = localStorage.getItem('userId'); // Fetching userId from local storage

    const handleReportSubmit = async () => {
        console.log(`Report for seller ${sellerId} with reason: ${reason}`);
    
        if (!sellerId || !reason) {
            alert('All fields are required.');
            return;
        }
    
        const url = `${API_URL}/api/reports/report/${sellerId}`; // Make sure this matches the backend endpoint
    
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reportedUserId: sellerId,
                message: reason
            })
        });
    
        const data = await response.json();
    
        if (response.status === 201) {
            alert('Report submitted successfully!');
            history.push('/'); // Redirect to home or another appropriate page after submission
        } else {
            alert(`Failed to submit report: ${data.message}`);
        }
    };

    return (
        <div className="report-form-container">
     
            <h1 className="report-form-title">
            <FontAwesomeIcon icon={faExclamationCircle} /> Report Seller</h1>
            <textarea
                className="report-form-textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the issue"
                rows="5"
                cols="33"
            />
            <button className="report-form-button" onClick={handleReportSubmit}>Submit Report</button>
        </div>
    );
}

export default ReportForm;
