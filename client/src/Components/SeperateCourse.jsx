import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'


const SeperateCourse = () => {

    const {id} = useParams()
    const navigate = useNavigate();

  return (
    <div className='seperateCourseSection'>
      <p onClick={()=>{navigate('/home')}}>&lt; Back?</p>
      <div className='detailedCourse'>
        <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200214165928/Web-Development-Course-Thumbnail.jpg" alt="" />
        <h1>Webdevelopment Basics</h1>
        <h4>-Author</h4>
        <p>
          <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
          15 Chapters
        </p>
        <p>
          <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
          2hr:30mins
        </p>
        <h3>Description</h3>
        <p className='courseDescription'>Welcome to an exciting journey of building a cutting-edge FullStack Learning Management System (LMS) application with Next.js 13! In this in-depth tutorial, we will explore the power of Next.js, React.js.</p>
        <button>Enroll Now</button>
      </div>

      <div className='courseChapters'>
        <h2>Chapters</h2>
      </div>
    </div>
  )
}

export default SeperateCourse