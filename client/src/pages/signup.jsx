import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { loggedIn } = useContext(AuthContext);

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

        console.log("Checking if formatting is valid")

        //password must be 8-30 characters, alphanumeric, and contain at least one number and capital letter
        if(username.length < 6 || username.length > 24 || !/^[a-zA-Z0-9]+$/.test(username)){
            console.log("Username invalid.")
            setErrorMessage("Username must be 6-24 characters and alphanumeric.")
            return
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){//Also add real email validation
           console.log("Email invalid.")
            setErrorMessage("Email must be valid email format.")
            return
        } else if(password.length < 8 || password.length > 30 || !/[0-9]/.test(password) || !/[A-Z]/.test(password) || !/^[a-zA-Z0-9]+$/.test(password)){
            console.log("Password invalid.")
            setErrorMessage("Password must be 8-30 characters, alphanumeric, and contain at least one number and capital letter.")
            return
        }
        console.log("Formatting valid. Checking if user already exists")
        console.log("Username: " + username)
        console.log("Email: " + email)
        const res = await axios.post('/api/checkUserExists', {
            username, 
            email
        });
        
        let conflict = res.data.conflict
        if(conflict === "username"){
            console.log("Username taken. Redirecting with context")
            setErrorMessage("Username already taken. Please choose another one.")
            return
        } else if(conflict === "email"){
            console.log("Email taken. Redirecting with context")
            setErrorMessage("Email already taken. Please choose another one.")
            return
        } else{
            console.log("Username and email not taken. Creating user")}
            let res2 = await axios.post('/api/addUser', {
                username: username,
                email: email,
                password: password
            });
            let success = res2.data.success
            if(success){
                console.log("User successfully created!")
                const res3 = await axios.post('/api/signin', {
                    usernameEmail: username,
                    password: password
        
                });
                if (res3.data.auth === true) {  
                    window.location.href = '/';
                }
            }

    };

    return (
        <div style={{ maxWidth: '28.125rem' }}>
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
                <h2>Sign Up</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '0.9375rem' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.3125rem' }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '0.9375rem' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3125rem' }}>Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit">
                        Sign Up
                    </button>
                </form>
                <p style={{ textAlign: 'center' }}>Already have an account?</p>
                <a href='/signin' style={{ color: 'white'}}>Click here to sign in</a>
            </div>
        </div>
    );
};

export default Signup;