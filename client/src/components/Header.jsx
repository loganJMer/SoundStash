import React, { useContext, useEffect} from 'react';
import { AuthContext } from '../context/authContext'; 


const Header = () => {
  const { username, loggedIn, logout } = useContext(AuthContext);
  
  return (
    <div style={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1000, height: '2.5rem' }}>
      <nav style={{ width: '100%' }}>
        <ul className="header_ul">
          <li style={{ display: 'inline-block' }}>
            <a href="/" className="logo-link">
              <img src="/FullLogo.png" alt="Logo" style={{ height: '2.5rem', verticalAlign: 'middle' }} />
            </a>
          </li>
          <li style={{ display: 'inline-block' }}>
            <a href="/search">Search</a>
          </li>
          <li style={{ display: 'inline-block' }}>
            <a href="/community">Community</a>
          </li>
          <li style={{ display: 'inline-block' }}>
            <a href="/trades">Trades</a>
          </li>
          {loggedIn ? (
            <li className="right dropdown" style={{ display: 'inline-block', position: 'relative' }}>
              <a
                href="#"
                style={{
                  minWidth: '7.5rem',
                  boxSizing: 'border-box',
                  border: 'none',
                  borderRadius: '0',
                  background: 'none'
                }}
              >
                {username || "User"}
              </a>
              <div
                className="dropdown-content">
                <a
                  href={`/profile/${encodeURIComponent(username)}`}
                  style={{
                    borderBottom: '0.0625rem solid white',
                    borderRadius: '0.25rem 0.25rem 0 0'
                  }}
                >
                  Profile
                </a>
                <a
                  href="#"
                  onClick={logout}
                  style={{
                    borderRadius: '0 0 0.25rem 0.25rem'
                  }}
                >
                  Logout
                </a>
              </div>
            </li>
          ) : (
            <li className="right" style={{ display: 'inline-block' }}>
              <a href="/signin">Sign In/Sign Up</a>
            </li>
          )}
        </ul>
      </nav>
      <style>
        {`
          body {
            margin: 0;
          }
          .header_ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: visible;
            background-color: #e0753d;
            display: flex;
            align-items: center;
            width: 100%;
          }

          li {
            margin: 0 0.625rem;
          }

          .right {
            margin-left: auto;
            position: relative;
          }

          li a {
            display: inline-block;
            color: white;
            text-align: center;
            padding: 0.875rem 1rem;
            text-decoration: none;
            min-width: 7.5rem;
            box-sizing: border-box;
          }

          /* Remove hover effect for logo link */
          .logo-link,
          .logo-link:hover {
            background: none !important;
            color: inherit !important;
          }

          li a:hover {
            background-color: #b95503;
            color: white;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: #e0753d;
            min-width: 7.5rem;
            box-shadow: 0rem 0.5rem 1rem 0rem rgba(0,0,0,0.2);
            z-index: 9999;
            border: 0.0625rem solid white;
            border-radius: 0.25rem;
            box-sizing: border-box;
            top: 100%;
            left: 0;
            margin-top: 0rem;
          }

          .dropdown-content a {
            color: white;
            padding: 0.75rem 1rem;
            text-decoration: none;
            display: block;
            text-align: left;
            background: #e0753d;
            border-bottom: 0.0625rem solid white;
            min-width: 7.5rem;
            box-sizing: border-box;
          }

          .dropdown-content a:last-child {
            border-bottom: none;
          }

          .dropdown-content a:hover {
            background-color: #b95503;
            color: white;
          }

          .dropdown:hover .dropdown-content {
            display: block;
          }

          .dropdown > a {
            border: none;
            border-radius: 0;
            min-width: 7.5rem;
            box-sizing: border-box;
            background: none;
          }

          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        `}
      </style>
    </div>
  );
};

export default Header;