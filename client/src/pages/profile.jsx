import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Profile = () => {

    const [collection, setCollection] = useState([]);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get('/api/getCollection');
                console.log('Collection:', response.data.collection);
                setCollection(response.data.collection);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        fetchCollection();
    }, []);

    return (
        <div
            style={{
                background: 'rgb(243, 189, 127)',
                minHeight: '100vh',
                width: '100%',
                padding: '2rem 0',
                boxSizing: 'border-box',
                margin: 0,
                position: 'absolute',
                top: 44,
                left: 0,
                right: 0,
                overflowX: 'hidden',
            }}
        >
            <style>
                {`
                    html, body, #root {
                        width: 100%;
                        overflow-x: hidden;
                        margin: 0;
                        padding: 0;
                    }
                `}
            </style>
            <br />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '1rem auto 0 auto',
                    boxSizing: 'border-box',
                    paddingLeft: 0,
                    paddingRight: 0,
                }}
            >
                {collection && collection.length > 0 ? (
                    collection.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minHeight: '120px',
                                maxWidth: '110px',
                            }}
                        >
                            <img
                                src={item.primaryImage || "logo.png"}
                                alt={item.title}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    marginBottom: '0.3rem',
                                    background: '#f3f3f3',
                                    display: 'block',
                                }}
                            />
                            <div style={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                color: '#222',
                                wordBreak: 'break-word',
                                lineHeight: 1.1,
                                marginTop: 0,
                            }}>
                                {item.title}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: '1.1em' }}>
                        No albums in your collection yet. Go get some!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;