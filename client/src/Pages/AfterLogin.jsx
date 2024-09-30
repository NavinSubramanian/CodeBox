import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Navbar from '../Components/Navbar';
import CourseDisplay from '../Components/CourseDisplay';
import Footer from '../Components/Footer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky, faRankingStar } from '@fortawesome/free-solid-svg-icons'

import ViewTest from '../Assets/viewTest.svg';

const AfterLogin = () => {
    const email = Cookies.get('email');
    const isAdmin = Cookies.get('isAdmin') === 'true';

    const navigate = useNavigate();

    return (
        <>
            <Navbar email={email} isAdmin={isAdmin} />

            <div className='mainSearch'>
                <input type="search" placeholder='Search Courses...' />
            </div>

            <div className='basicCourses'>
                <h2>Basic Courses</h2>
                <div className='courseList'>
                    <CourseDisplay courseid="1" />
                </div>
            </div>

            <div className='otherCourses'>
                <h2>Advanced Courses</h2>
                <div className='courseList'>
                    {/* <CourseDisplay courseid="3" /> */}
                    <p>Coming soon....</p>
                </div>
            </div>

            <div className='mockTestNavigate'>
                <h2>View Available Test:</h2>
                <button onClick={()=>{navigate('/testlist')}}>View</button>
                <img src={ViewTest} alt="" />
            </div>

            {isAdmin ? 
            <div className='adminPanelNavigation'>
                <h2>Admin Functions : </h2>
                <div>
                    <div onClick={()=>{navigate('/uploadtest')}}>
                        <FontAwesomeIcon icon={faNoteSticky}></FontAwesomeIcon>
                        <p>Assign a Test</p>
                    </div>
                    <div onClick={()=>{navigate('/leaderboard')}}>
                        <FontAwesomeIcon icon={faRankingStar}></FontAwesomeIcon>
                        <p>Leaderboard</p>
                    </div>
                </div>
            </div> : <></>}

            <Footer />
        </>
    );
}

export default AfterLogin;
