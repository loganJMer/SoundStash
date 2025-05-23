import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Signin = () => {
    const [usernameEmail, setUsernameEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { loggedIn} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            navigate('/');
        }
    }, [loggedIn]);

    useEffect(() => {
        document.body.style.backgroundColor = '#e0753d';
    }, []);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Checking credentials")
        const res = await axios.post('/api/signin', {
            usernameEmail: usernameEmail,
            password: password
        });
        if (res.data.auth === true) {  
            console.log("User successfully signed in!")
            window.location.href = '/';
        } else {
            setErrorMessage('Invalid login. Please try again.');
        }
    };

    return (
        <div style={{maxWidth: '28.125rem'}}>   
            <style>
                {`
                    input {
                        width: 100%;
                        padding: 0.5rem;
                        box-sizing: border-box;
                        background-color: #fff;
                        color: #000;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                    button {
                        padding: 0.625rem 0.9375rem;
                        background-color: #e37609;
                        color: #fff;
                        border-width: 0.0625rem;
                        border-color: white;
                        border-radius: 0.625rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease, transform 0.2s ease;
                    }
                    button:hover {
                        background-color: #c65d07;
                        border-color: white;
                        transform: scale(1.1);
                        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
                    }
                    a:hover {
                        text-decoration: underline;
                    }
            `}
            </style>
            <img src="FullLogo.png" alt="Logo" /><br></br>
            <div style={{ maxWidth: '18.75rem', margin: '0 auto', padding: '1.25rem', backgroundColor: '#e68230', borderWidth: "0.25rem", borderColor: "#FFF", borderStyle: "double", borderRadius: "2.5rem", boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)' }}>
                

                <h2>Sign In</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '0.9375rem' }}>
                        <label htmlFor="username/email" style={{ display: 'block', marginBottom: '0.3125rem' }}>Username/Email</label>
                        <input
                            type="text"
                            id="username/email"
                            value={usernameEmail}
                            onChange={(e) => setUsernameEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '0.9375rem' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.3125rem' }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" >
                        Sign In
                    </button>
                </form><br></br>
                <p style={{ textAlign: 'center' }}>Don't have an account?</p>
                <a href='/signup' style={{ color: 'white'}}>Click here to create new account</a>
            </div>
        </div>
    );
};

export default Signin;