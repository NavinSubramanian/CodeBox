import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import MainLogo from '../Assets/mainLogo1.png'
import MainImage from '../Assets/image.jpg'
import Leaderboard from '../Assets/leaderboard.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

import { useNavigate } from 'react-router-dom'

import Footer from '../Components/Footer'

const Homepage = () => {

    const nav = useNavigate();
    const email = Cookies.get('email');

    useEffect(()=>{
        email? nav('/home') : nav('/');
    },[])


    return (
    <>
        <nav className='homeNav'>
            <img src={MainLogo} />
        </nav>

        <div className='landingPage'>
            <h1>Your Gateway to Practice - Learn, Build, Succeed</h1>
            <p>Whether you're new or experienced, our courses, practice sessions, and real-world projects will help you master it.</p>
            <button onClick={()=>{nav('/login')}}>Get started now <span>&gt;</span></button>
            <img src={MainImage} />
        </div>

        <div className="featuresSection">
            <h1>Features for a better experience</h1>
            <div>
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <h2>Interactive Learning Modules</h2>
                <p>Our courses are designed with interactive content that engages students in active learning. Each module is crafted to enhance understanding through quizzes.</p>
            </div>
            <div>
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <h2>Real-Time Mock Tests</h2>
                <p>Practice makes perfect! Our platform offers real-time mock tests that simulate actual exam conditions.</p>
            </div>
            <div>
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <h2>Personalized Progress Tracking</h2>
                <p> Keep track of your learning journey with our personalized dashboard. </p> 
            </div>
        </div>

        <div className='leaderboardSection'>
            <h1>Compete with others</h1>
            <p>Earn points through which you can show who is more powerfull!</p>
            <img src={Leaderboard} />
        </div>

        <Footer />
    </>
  )
}

export default Homepage