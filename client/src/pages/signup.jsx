import axios from 'axios';
import React, { useState } from 'react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await axios.post('/api/checkUserExists', {
            username: username,
            email: email,
        });
        let conflict = response.data.conflict
        if(conflict === "username"){
            console.log("Username taken. Redirecting with context")
            setErrorMessage("Username already taken. Please choose another one.")
        } else if(conflict === "email"){
            console.log("Email taken. Redirecting with context")
            setErrorMessage("Email already taken. Please choose another one.")
        } else{
            console.log("Username and email not taken. Creating user")}
            let response2 = await axios.post('/api/addUser', {
                username: username,
                email: email,
                password: password
            });
            let success = response2.data.success
            if(success){
                console.log("User successfully created!")
                const response3 = await axios.post('/api/signin', {
                    username: username,
                    email: email,
                    password: password
        
                });
                if (response3.data.auth === true) {  
                    window.location.href = '/';
                }
            }

    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
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
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;