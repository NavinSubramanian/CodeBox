import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UploadTest = () => {
    const [testName, setTestName] = useState('');
    const [testDuration, setTestDuration] = useState('');
    const [totalScore, setTotalScore] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is admin
        const token = Cookies.get('token');
        const isAdmin = Cookies.get('isAdmin') === 'true'; // Get isAdmin from the cookie and convert it to boolean

        if (!token || !isAdmin) {
            // If there's no token or the user is not an admin, navigate to home page
            navigate('/home');
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('testName', testName);
        formData.append('testDuration', testDuration);
        formData.append('totalScore', totalScore);
        formData.append('file', file);

        try {
            const res = await axios.post('https://code-box-backend.vercel.app/api/tests/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true // Ensure credentials are sent
            });
            alert(res.data.message);
            navigate('/home');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Error uploading test');
        }
    };

    return (
        <div className="upload-test-container">
            <h2>Upload Test</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Test Name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Test Duration (e.g., 60 minutes)"
                    value={testDuration}
                    onChange={(e) => setTestDuration(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Total Score"
                    value={totalScore}
                    onChange={(e) => setTotalScore(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Upload Test</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p onClick={()=>{navigate('/home')}}>Back?</p>
        </div>
    );
};

export default UploadTest;
