import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

const CourseDisplay = ({courseid}) => {

    const navigate = useNavigate();

  return (
    <div className='courseDisplay' onClick={()=>{navigate(`/course/${courseid}`)}}>
        <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200214165928/Web-Development-Course-Thumbnail.jpg" alt="" />
        <h3>WebDevelopment Basics</h3>
        <div className='chapterAndTime'>
            <div>
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <p>15 chapters</p>
            </div>
            <div>
                <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                <p>2h:30min</p>
            </div>
        </div>
        <div className='tagCourse'>
            <p>HTML</p>
            <p>CSS</p>
            <p>JS</p>
        </div>
    </div>
  )
}

export default CourseDisplay