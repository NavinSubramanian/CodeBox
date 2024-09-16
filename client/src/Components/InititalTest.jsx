import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const TestPage = () => {
    const { testid } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [isTestCompleted, setIsTestCompleted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // To track the current question

    useEffect(() => {
        if (testid) {
            const fetchTestQuestions = async () => {
                try {
                    const token = Cookies.get('token');
                    const res = await axios.get(`https://code-box-backend.vercel.app/api/tests/${testid}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setQuestions(res.data.questions || []);
                } catch (error) {
                    console.error('Error fetching test questions:', error);
                }
            };

            fetchTestQuestions();
        } else {
            const token = Cookies.get('token');
            const isAdmin = Cookies.get('isAdmin') === 'true';
            
            if (!token || !isAdmin) {
                navigate('/home');
            }
        }
    }, [testid, navigate]);

    console.log(questions);

    const handleAnswerSelection = (index) => {
        setAnswers([...answers, index]);

        // If there are more questions, move to the next question, otherwise submit the test
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitTest([...answers, index]);
        }
    };

    const submitTest = async (submittedAnswers) => {
        try {
            const token = Cookies.get('token');
            const res = await axios.post(`https://code-box-backend.vercel.app/api/tests/${testid}/submit`, {
                answers: submittedAnswers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsTestCompleted(true);
            localStorage.setItem(`testCompleted_${testid}`, 'true');
            alert(`Test completed! Your score is ${res.data.score}`);
            navigate('/');
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    if (isTestCompleted) {
        return <div>You have already completed the test. Thank you!</div>;
    }

    const currentQuestion = questions[currentQuestionIndex] || {};

    // Extract the options for the current question
    const { optionA, optionB, optionC, optionD } = currentQuestion;

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div>
            {testid ? (
                <div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', marginBottom: '20px' }}>
                        <div
                            style={{
                                width: `${progressPercentage}%`,
                                height: '100%',
                                backgroundColor: '#6857E8',
                                transition: 'width 0.3s ease',
                            }}
                        ></div>
                    </div>

                    {questions.length > 0 ? (
                        <div className='questionsSlide'>
                            <h2>Question {currentQuestionIndex + 1}</h2>
                            <p>{currentQuestion.Question || 'Loading question...'}</p>
                            <ul>
                                {optionA && <li onClick={() => handleAnswerSelection(0)}>{optionA}</li>}
                                {optionB && <li onClick={() => handleAnswerSelection(1)}>{optionB}</li>}
                                {optionC && <li onClick={() => handleAnswerSelection(2)}>{optionC}</li>}
                                {optionD && <li onClick={() => handleAnswerSelection(3)}>{optionD}</li>}
                            </ul>
                        </div>
                    ) : (
                        <div>Loading questions...</div>
                    )}
                </div>
            ) : (
                <div className="error">Test ID not provided!</div>
            )}
        </div>
    );
};

export default TestPage;
