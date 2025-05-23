import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Collection = () => {

    const {username} = useParams();
    const {collectionType} = useParams();
    const [collection, setCollection] = useState([]);

    useEffect(() => {
        const fetchCollection = async () => {
            console.log(collectionType);
            try {
                if(collectionType !== 'Collection' && collectionType !== 'Wishlist') {
                    console.error('Invalid collection type:', collectionType);
                }
                
                if (collectionType === 'Collection') {
                    const response = await axios.get(`/api/getCollectionPublic/${encodeURIComponent(username)}`);
                    setCollection(response.data.collection);
                } else if (collectionType === 'Wishlist') {
                    const response = await axios.get(`/api/getWishlistPublic/${encodeURIComponent(username)}`);
                    setCollection(response.data.wishlist);
                }
                
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
                top: '2.5rem',
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(6.875rem, 1fr))',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '75rem',
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
                                borderRadius: '0.5rem',
                                boxShadow: '0 0.0625rem 0.25rem rgba(0,0,0,0.06)',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minHeight: '7.5rem',
                                maxWidth: '6.875rem',
                            }}
                        >
                            <img
                                src={item.primaryImage || "logo.png"}
                                alt={item.title}
                                style={{
                                    width: '6.25rem',
                                    height: '6.25rem',
                                    objectFit: 'cover',
                                    borderRadius: '0.375rem',
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
                        No albums in your  yet. Go get some!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;