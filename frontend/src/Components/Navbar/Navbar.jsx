import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Navbarlist from './Navbarlist';
import logo from './logo.svg'
import './Navbar.css'

const Navbar = () => {
  const { isLoggedIn, checkUserLoggedIn, handleLogout } = useContext(UserContext);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const renderAuthButton = () => {
    if (isLoggedIn) {
      return (
        <div className="ml-auto">
          {isLoginPage ? null : (
            <button onClick={handleLogout} className="login-button">
              <Link to="/">Sign out</Link>
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className="ml-auto">
          {isLoginPage ? null : (
            <div className="login-button">
              <Link to="/login">Sign In</Link>
            </div>
          )}
        </div>
      );
    }
  };

  const gradientColors =['#67E0DD', '#A6D8DF', '#C5E8E2', '#94BBDF', '#DBDAE0', '#FAE8E1'];

  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientColors.join(',')})`,
    backgroundColor:'white'
  };

  return (
    <nav className="navbar" style={gradientStyle}>
      <div className="logo-links">
        <h2>
          <Link to="/" style={{ textDecoration: 'none', color: 'indigo' }}>
            <img src={logo} alt="" srcset="" />
          </Link>
        </h2>
        <ul className="navitems">
          <Navbarlist />
          {/* <li>
            <a href="http://localhost:8000" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
              Chatbot
            </a>
          </li> */}
        </ul>
      </div>
      <div id="google_translate_element"></div>
      {/* <button className="login-button">
        <Link to="/lawyer">For Advocates</Link>
      </button> */}
      {renderAuthButton()}
    </nav>
  );
};

export default Navbar;
