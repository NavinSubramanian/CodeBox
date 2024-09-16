import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import TestFinished from '../Assets/testFinished.svg'

const TestSubmitted = () => {
    const location = useLocation();
    const { finalScore, formattedTimeTaken, answers, questions } = location.state || {};
    const [isLoaded, setIsLoaded] = useState(false);
    const testid = useParams();
    const scorePercentage = (finalScore / questions.length) * 100;
    const navigate = useNavigate();

    useEffect(()=>{
        setIsLoaded(true);
        console.log(questions);
    },[questions])

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(20, 20, 'Test Response Sheet');
        doc.setFontSize(12);
        doc.text(20, 30, `Test ID: ${testid}`);
        
        const tableColumn = ["Question", "Your Answer", "Correct Answer"];
        const tableRows = [];
    
        // Prepare rows for the table
        questions.forEach((question, index) => {
            const userAnswer = answers[index] || 'No Answer';
            const correctAnswer = question.correctanswer || 'N/A';
    
            const questionRow = [
                question.Question, 
                userAnswer, 
                correctAnswer
            ];
    
            tableRows.push(questionRow);
        });
    
        // Use autoTable to create the table with uniform colors
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40, 
            styles: {
                fillColor: [52, 73, 94], 
                textColor: [255, 255, 255], 
                halign: 'center' 
            },
            headStyles: {
                fillColor: [52, 73, 94], 
                textColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 70 }, 
                1: { cellWidth: 50 }, 
                2: { cellWidth: 50 }
            },
            theme: 'grid'
        });
    
        doc.save('Test_Response_Sheet.pdf');
    };

    return (
        <>
            <p className='goHome' onClick={()=>{navigate('/home')}}> - Go Home?</p>

            <div style={styles.container}>
                <div style={styles.scoreBox}>
                    <h1 style={styles.heading}>Test Submitted</h1>
                    <h2 style={styles.scoreText}>Your Score: {finalScore} / {questions.length}</h2>
                    <div style={styles.progressBarContainer}>
                        <div style={{ ...styles.progressBar, width: `${scorePercentage}%` }}></div>
                    </div>
                    <p style={styles.percentageText}>{scorePercentage.toFixed(2)}%</p>
                </div>
                <button onClick={generatePDF} style={{padding:'7px 10px', color:'white', backgroundColor: '#6857E8', border:'none', borderRadius:'5px', margin:'10px 0'}}>Download PDF</button>
                <img src={TestFinished} style={{width:'100%', position:'relative', top:'-20px'}} />
                <h3 style={styles.reviewHeading}>Review Your Answers</h3>
                <ul style={styles.questionList}>
                    {!isLoaded ? <p>Loading</p> :
                        <>
                        {questions.map((questionObj, index) => (
                            <li key={index} style={styles.questionItem}>
                                <p style={styles.questionText}><strong>Question {index + 1}: {questionObj.Question}</strong></p>
                                <p style={{ ...styles.answerText, color: answers[index] === questionObj.correctanswer ? 'green' : 'red' }}>
                                    Your Answer: {answers[index]}
                                </p>
                                <p style={styles.correctAnswerText}>
                                    Correct Answer: {questionObj.correctanswer}
                                </p>
                            </li>
                        ))}
                        </>
                    }
                </ul>
            </div>

            <Footer />
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Titillium Web',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    scoreBox: {
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    heading: {
        fontSize: '2em',
        marginBottom: '10px',
        color: '#4a4a4a',
    },
    scoreText: {
        fontSize: '1.5em',
        color: '#4a90e2',
    },
    progressBarContainer: {
        width: '100%',
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden',
        marginTop: '15px',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
        transition: 'width 0.3s ease',
    },
    percentageText: {
        marginTop: '10px',
        fontSize: '1.2em',
        color: '#4a4a4a',
    },
    reviewHeading: {
        fontSize: '1.5em',
        color: '#4a4a4a',
        marginBottom: '15px',
    },
    questionList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        textAlign: 'left',
    },
    questionItem: {
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    questionText: {
        fontSize: '1.2em',
        color: '#333',
    },
    answerText: {
        fontSize: '1.1em',
    },
    correctAnswerText: {
        fontSize: '1.1em',
        color: 'green',
        marginTop: '5px',
    },
};

export default TestSubmitted;
