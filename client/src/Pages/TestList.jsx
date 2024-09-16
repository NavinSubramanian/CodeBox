import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For React Router v6
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For navigating to the test page
    const email = Cookies.get('email');
    const isAdmin = Cookies.get('isAdmin') === 'true';

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get('https://code-box-backend.vercel.app/api/tests/assigned-tests', {
                    headers: { 'email': email } // Send the email as part of the request headers
                });
                setTests(res.data.tests);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching tests');
            }
        };

        fetchTests();
    }, [email]);
    const handleStartTest = (testId) => {
        navigate(`/test/${testId}`);
    };

    return (
        <>
            <Navbar email={email} isAdmin={isAdmin} />
            <div className='testListBody'>
                <h1>View All the Tests Here,</h1>
                <div>
                    {tests.length > 0 ? (
                        tests.map(test => (
                            <div key={test.testId} className='testTake'>
                                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                <h3>{test.testName}</h3>
                                <div>
                                    <button onClick={() => handleStartTest(test._id)}>Start</button>
                                    <p>Test id: <span>{test._id}</span></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tests assigned to you at the moment.</p>
                    )}
                </div>
                {error && <p className="error">{error}</p>}
            </div>
            <Footer />
        </>
    );
};

export default TestList;
