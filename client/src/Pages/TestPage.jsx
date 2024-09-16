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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [testDuration, setTestDuration] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);


    useEffect(() => {
        const checkTestAttendance = async () => {
            try {
                const token = Cookies.get('token');
                const email = Cookies.get('email');
                
                const res = await axios.get(`https://code-box-backend.vercel.app/api/tests/${testid}/check-attendance`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        email: email
                    }
                });

                if (res.data.isAttended) {
                    setIsTestCompleted(true);
                    navigate('/home');
                } else {
                    fetchTestQuestions();
                }
            } catch (error) {
                console.error('Error checking test attendance:', error);
            }
        };

        const fetchTestQuestions = async () => {
            try {
                const token = Cookies.get('token');
                const res = await axios.get(`https://code-box-backend.vercel.app/api/tests/${testid}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setQuestions(res.data.questions || []);
                const durationInMinutes = parseInt(res.data.duration) || 0;
                setTestDuration(durationInMinutes);
                setTimeRemaining(durationInMinutes * 60); 
            } catch (error) {
                console.error('Error fetching test questions:', error);
            }
        };

        if (testid) {
            checkTestAttendance();
        }

        return () => clearInterval(window.timerInterval);
    }, [testid, navigate]);

    // Timer to track time remaining
    useEffect(() => {
        let interval;
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        handleSubmit();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            
            window.timerInterval = interval;
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timeRemaining]);

    // Fullscreen and tab switch detection
    // This was not requested by them for a more fun User Experiance

    /*
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleSubmit(false); // Auto-submit when the user switches tabs
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleSubmit(false); // Auto-submit when the user exits full screen
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);
    */

    // Enter full-screen mode
    // Also not required

    /*
    const enterFullScreen = () => {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen();
        } else if (docEl.mozRequestFullScreen) { // Firefox
            docEl.mozRequestFullScreen();
        } else if (docEl.webkitRequestFullScreen) { // Chrome, Safari, and Opera
            docEl.webkitRequestFullScreen();
        } else if (docEl.msRequestFullscreen) { // IE/Edge
            docEl.msRequestFullscreen();
        }
    };
    */

    // Answer selection handler

    const handleAnswerSelection = (answerText) => {
        setSelectedAnswer(answerText);
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = answerText;
        setAnswers(updatedAnswers);
    };

    // Calculate the user's score

    const calculateScore = () => {
        let calculatedScore = 0;
        questions.forEach((question, index) => {
            if (question.correctanswer === answers[index]) {
                calculatedScore += 1;
            }
        });
        return calculatedScore;
    };

    // Submit the test
    const handleSubmit = async (allowPDF = true) => {
        const finalScore = calculateScore();
        const totalTestTimeInSeconds = testDuration * 60;
        const timeTakenInSeconds = totalTestTimeInSeconds - timeRemaining;
        const minutesTaken = Math.floor(timeTakenInSeconds / 60);
        const secondsTaken = timeTakenInSeconds % 60;
        const formattedTimeTaken = `${minutesTaken}:${secondsTaken}`;

        try {
            const token = Cookies.get('token');
            const email = Cookies.get('email');
            // await axios.post(`https://code-box-backend.vercel.app/api/tests/${testid}/submit`, {
            //     answers: answers,
            //     email: email
            // }, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            await axios.put(`https://code-box-backend.vercel.app/api/tests/${testid}/update`, {
                score: finalScore,
                email: email,
                timeTaken: formattedTimeTaken
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsTestCompleted(true);
            localStorage.setItem(`testCompleted_${testid}`, 'true');

            navigate(`/testresult/${testid}`, {
                state: { finalScore, formattedTimeTaken, answers, questions },
            });            
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    const handleNextSlide = () => {
        if (currentQuestionIndex < questions.length - 1) {
            if (selectedAnswer !== null) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            }
            else {
                alert("Please select an answer before proceeding.");
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    if (isTestCompleted) {
        return <div>You have already completed the test. Thank you!</div>;
    }

    const currentQuestion = questions[currentQuestionIndex] || {};
    const { "Option A": optionA, "Option B": optionB, "Option C": optionC, "Option D": optionD } = currentQuestion;
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

                    <div style={{ marginBottom: '20px' }}>
                        Time Remaining: {formatTime(timeRemaining)}
                    </div>

                    {questions.length > 0 ? <>
                        <div className='questionsSlide'>
                            <h2>Question {currentQuestionIndex + 1}</h2>
                            <p>{currentQuestion.Question || 'Loading question...'}</p>
                            <ul>
                                {optionA && (
                                    <li 
                                        onClick={() => handleAnswerSelection(optionA)} 
                                        style={{ backgroundColor: selectedAnswer === optionA ? '#d3d3d3' : '' }}
                                    >
                                        {optionA}
                                    </li>
                                )}
                                {optionB && (
                                    <li 
                                        onClick={() => handleAnswerSelection(optionB)} 
                                        style={{ backgroundColor: selectedAnswer === optionB ? '#d3d3d3' : '' }}
                                    >
                                        {optionB}
                                    </li>
                                )}
                                {optionC && (
                                    <li 
                                        onClick={() => handleAnswerSelection(optionC)} 
                                        style={{ backgroundColor: selectedAnswer === optionC ? '#d3d3d3' : '' }}
                                    >
                                        {optionC}
                                    </li>
                                )}
                                {optionD && (
                                    <li 
                                        onClick={() => handleAnswerSelection(optionD)} 
                                        style={{ backgroundColor: selectedAnswer === optionD ? '#d3d3d3' : '' }}
                                    >
                                        {optionD}
                                    </li>
                                )}
                            </ul>
                            { currentQuestionIndex === questions.length - 1 ? (
                                <button onClick={handleSubmit}>Submit</button>
                            ) : (
                                <button onClick={handleNextSlide}>Next</button>
                            )}
                        </div>
                    </> : (
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