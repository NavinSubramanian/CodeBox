import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faInstagram, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer className='mainFooter'>
        <div>
            <h2>CodeBox</h2>
            <p>An easy to learn and get certification platform!</p>
        </div>
        <div>
            <h3>Join Our Social Community</h3>
            <div className='socialIcons'>
                <FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>
                <FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>
                <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
                <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
            </div>
        </div>
        <div>
            <h3>Let's Discuss What's Next</h3>
            <p>Have a project or question? We'd love to hear from you!</p>
        </div>
        <hr />
        <div>
            <h5>@2024 CodeBox. Subjected to rights. <span>Powered by Flanzer</span></h5>
        </div>
    </footer> 
  )
}

export default Footer