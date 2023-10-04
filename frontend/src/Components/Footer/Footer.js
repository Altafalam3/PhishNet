import React from 'react';
import './Footer.css';
import Logo from './legalhammer.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_top">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">
                  <img src={Logo} alt="Your Logo" /><br/>                               
                  <p className="footer_text">SmartLegalX was developed and designed by the founder 
                  of Technovate in 2023 with the collaboration
                  of a team of four members.</p>
                </h3>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">
                  Quick Links
                </h3>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/chatbot">Chatbot</a></li>
                  <li><a href="/textsum">Summarizer</a></li>
                  <li><a href="/lawyers">Ask Lawyer</a></li>
                  <li><a href="/docum">Document Maker</a></li>
                  <li><a href="/resource">Resources</a></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">
                  Address
                </h3>
                <p className="footer_text"> H-Block, Lohia Road ,<br />
                  Sector -63, Noida, Uttar Pradesh <br /> 201301, IN</p>
                <p className="footer_text">+10 367 267 2678 <br />
                  reservation@mastroom.com</p>
                <a href="#" className="line-button">Get Direction</a>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">
                  Newsletter
                </h3>
                <form action="#" className="newsletter_form">
                  <input type="text" placeholder="Enter your mail" />
                  <button type="submit">Sign Up</button>
                </form>
                <p className="newsletter_text">Subscribe newsletter to get updates</p>
                <div className="socail_links">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook-square fa-2x" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter fa-2x" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram fa-2x" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copy-right_text">
        <div className="container">
          <div className="footer_border" />
          <div className="row">
            <div className="col-12">
              <p className="copy_right">
                Copyright © All rights reserved 2023| MastRoom
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
