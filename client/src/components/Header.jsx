import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState('');

  useEffect(() => {
    axios.get('/api/verifyToken', { withCredentials: true })
        .then(response => {
            console.log(response.data.valid)
            if (response.data.valid) {
                setLoggedIn(true);
                setUsername(response.data.username);
                console.log('Username:', response.data.username);
            } else {
                console.log('Invalid or expired token.');
                
            }
        })
        .catch(() => {
            console.log('Invalid or expired token.');
        });
}, []);

  const deleteLoginCookie = () => {
    axios.post('/api/logout', { withCredentials: true })
    .then(() => {
        console.log('Logged out');
        setUsername(null);
        setLoggedIn(false);
    })
    .catch(err => {
        console.error('Logout error:', err);
    });
  };

  return (
    <div style={{ width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
      <nav style={{ width: '100%' }}>
        <ul>
          <li style={{ display: 'inline-block' }}>
            <a href="/" className="logo-link">
              <img src="FullLogo.png" alt="Logo" style={{ height: '40px', verticalAlign: 'middle' }} />
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
                  minWidth: '120px',
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
                  href="/profile"
                  style={{
                    borderBottom: '1px solid white',
                    borderRadius: '4px 4px 0 0'
                  }}
                >
                  Profile
                </a>
                <a
                  href="#"
                  onClick={deleteLoginCookie}
                  style={{
                    borderRadius: '0 0 4px 4px'
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
          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: visible;
            background-color: #e0753d;
            display: flex;
            align-items: center;
            width: 100vw;
          }

          li {
            margin: 0 10px;
          }

          .right {
            margin-left: auto;
            position: relative;
          }

          li a {
            display: inline-block;
            color: white;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
            min-width: 120px;
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
            min-width: 120px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 9999;
            border: 1px solid white;
            border-radius: 4px;
            box-sizing: border-box;
            top: 100%;
            left: 0;
            margin-top: 0px;
          }

          .dropdown-content a {
            color: white;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            text-align: left;
            background: #e0753d;
            border-bottom: 1px solid white;
            min-width: 120px;
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
            min-width: 120px;
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