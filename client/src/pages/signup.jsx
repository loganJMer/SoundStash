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
	
        const res = await axios.get('/api/checkUserExists', {
            params: {
            username: username,
            email: email,
            },
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
        <div style={{ maxWidth: '450px' }}>
            <style>
            {`
                input {
                    width: 100%;
                    padding: 8px;
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
                    padding: 10px 15px;
                    background-color: #e37609;
                    color: #fff;
                    border-width: 1px;
                    border-color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }
                button:hover {
                    background-color: #c65d07;
                    border-color: white;
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }

                a:hover {
                    text-decoration: underline;
                }
            `}
            </style>
            <img src="FullLogo.png" alt="Logo" /><br></br>

            <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px', backgroundColor: '#e68230', borderWidth: "4px", borderColor: "#FFF", borderStyle: "double", borderRadius: "40px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <h2>Sign Up</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
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
                <a href='/signin' style={{ color: 'white'}} class>Click here to sign in</a>
            </div>
        </div>
    );
};

export default Signup;