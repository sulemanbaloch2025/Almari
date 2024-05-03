import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log(userId)
        const fetchReports = async () => {
            const response = await fetch(`http://localhost:4000/api/reports/get-reports/${userId}`);
            const data = await response.json();
            console.log(data)
            setReports(data);
        };

        fetchReports();
    }, []);

    return (
        <div>
            <Header/>
            <style>
                {`
                    .report-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        box-shadow: 0 2px 3px rgba(0,0,0,0.1);
                    }
                    .report-table th, .report-table td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .report-table th {
                        background-color: black;
                        color: white;
                    }
                    .report-table tbody tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    .report-table tbody tr:hover {
                        background-color: #ddd;
                    }
                    @media screen and (max-width: 600px) {
                        .report-table th, .report-table td {
                            padding: 10px;
                        }
                    }
                `}
            </style>
            <h1>All Reports</h1>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Report ID</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report._id}>
                            <td>{report._id}</td>
                            <td>{report.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsPage;
