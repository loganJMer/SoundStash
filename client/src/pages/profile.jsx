import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Profile = () => {

    const {collection, setCollection} = useState([]);
    const {username, setUsername} = useState("");

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get('/api/getCollection');
                setCollection(response.data);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };


        fetchCollection();
    }, []);

    return (
        <div style={{
            background: '#fff',
            minHeight: '100vh',
            width: '100%',
            padding: '4rem',
            boxSizing: 'border-box',
            margin: 0,
            position: 'fixed',
            top: 0,
            left: 0
        }}>
        </div>
    );
};

export default Profile;
