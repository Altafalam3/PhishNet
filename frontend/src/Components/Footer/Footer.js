import React from 'react'
import './footer.css'
import {Link} from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_column">
        <h3 className="footer_prepfusion">
          <span className="footer_prep">Prep</span>
          <span className="footer_fusion">Fusion</span>
        </h3>
        <p className="footer_para3">Stay Connected with Us on Social Media 
          for the Latest Updates, Educational Insights on Phishing and Engaging Content. Join our Community for more.</p>
        <div className="social-icons">
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      <div className="footer_column_2">
        <h3 className="footer_quick_links">Quick Links</h3>
        <ul className="footer_unordered_list">
          <div className="footer-flex">
            <li className="footer_ul_li"><Link to="/"> <p>&raquo; Home</p> </Link></li>
            <li className="footer_ul_li"><Link to="/upload"><p>&raquo; Phishing Model</p> </Link></li>
            <li className="footer_ul_li"><Link to="/problemset"> <p>&raquo; About</p></Link></li>
          </div>
          <div className="footer-flex">
            <li className="footer_ul_li"><Link to="/"> <p>&raquo; In Depth Analysis</p></Link></li>
            <li className="footer_ul_li"><Link to="/"> <p>&raquo; Extension</p></Link></li>
            <li className="footer_ul_li"><Link to="/"> <p>&raquo; Contact</p></Link></li>
          </div>
        </ul>
      </div>

      <div className="footer_column_3">
        <h3 className="footer_sub">Subscribe to PhishNet</h3>
        <input type="text" placeholder="Your name" className="footer_textbox" />
        <br/>
        <input type="text" placeholder="Your email" className="footer_textbox" />
        <br/>
        <button className="footer_sub_now">Subscribe now</button>
      </div>
      
      <hr className="footer_divider" />

      <div className="footer_common">
        <p className="footer_copy">&copy; 2023 Phish<span className="fusiondown">Net</span>. All Rights Reserved.</p>
        <br />
      </div>
    </footer>
    
  );
}
