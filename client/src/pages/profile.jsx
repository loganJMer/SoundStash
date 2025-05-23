import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
//import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Profile = () => {

    const {username} = useParams();
    const [maxAlbums, setMaxAlbums] = useState(0)
    const [collection, setCollection] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    //const { loggedIn , loading} = useContext(AuthContext);
    const albumsRowRef = React.useRef(null)

    const navigate = useNavigate();

    //  useEffect(() => {
    // if (!loading && !loggedIn) {
    //   navigate('/signin');
    // }
    // }, [loading, loggedIn]);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get(`/api/getCollectionPublic/${encodeURIComponent(username)}`);
                console.log('Collection:', response.data.collection);
                setCollection(response.data.collection);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };
        const fetchWishlist = async () => {
            try {
                const response = await axios.get(`/api/getWishlistPublic/${encodeURIComponent(username)}`);
                console.log('Wishlist:', response.data.wishlist);
                setWishlist(response.data.wishlist);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchCollection();
        fetchWishlist();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (albumsRowRef.current) {
                const containerWidth = albumsRowRef.current.offsetWidth;
                const itemWidth = 6.25 + 1; // 6.25rem image + 1rem gap
                const count = Math.floor(containerWidth / itemWidth);
                setMaxAlbums(count > 0 ? count : 1);
            }
        };
        setTimeout(() => {
            handleResize();
        }, 1000);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [collection.length]);

    return (
        <div
            style={{
                background: 'rgb(243, 189, 127)',
                minHeight: '100vh',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box',
                margin: 0,
                position: 'absolute',
                top: '2.5rem',
                left: 0,
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
            {collection.length > 0  ? (
                <a href={`/collection/${encodeURIComponent(username)}/Collection`} style={{}}>
                <div style={{ marginTop: '6rem', background: '#fff', padding: '1rem 1rem 0.01rem 1rem', borderRadius: '0.5rem', boxShadow: '0 0.125rem 0.375rem rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' }}>
                    <div
                        ref={albumsRowRef}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        {collection.slice(0, maxAlbums).map((album) => (
                            <div key={album.id} style={{
                                width: '6.25rem',
                                height: '6.25rem',
                                flex: '0 0 6.25rem',
                                justifySelf: 'center'
                            }}>
                                <img
                                    src={album.primaryImage || '/logo.png'}
                                    alt={"Master Cover Not Found"}
                                    style={{
                                        width: '6.25rem',
                                        height: '6.25rem',
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem',
                                        display: 'block',
                                        boxShadow: '0 0.125rem 0.375rem rgba(0,0,0,0.1)',
                                        transition: 'box-shadow 0.2s, transform 0.2s'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <h3 style={{color: "blue"}}>Click to view the entire collection</h3>
                </div>
                </a>
            ) : (
                <p>No albums in this collection yet!</p>
            )}

            {wishlist.length > 0  ? (
                <a href={`/collection/${encodeURIComponent(username)}/Wishlist`} style={{}}>
                <div style={{ marginTop: '6rem', background: '#fff', padding: '1rem 1rem 0.01rem 1rem', borderRadius: '0.5rem', boxShadow: '0 0.125rem 0.375rem rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' }}>
                    <div
                        ref={albumsRowRef}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        {wishlist.slice(0, maxAlbums).map((album) => (
                            <div key={album.id} style={{
                                width: '6.25rem',
                                height: '6.25rem',
                                flex: '0 0 6.25rem',
                                justifySelf: 'center'
                            }}>
                                <img
                                    src={album.primaryImage || '/logo.png'}
                                    alt={"Master Cover Not Found"}
                                    style={{
                                        width: '6.25rem',
                                        height: '6.25rem',
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem',
                                        display: 'block',
                                        boxShadow: '0 0.125rem 0.375rem rgba(0,0,0,0.1)',
                                        transition: 'box-shadow 0.2s, transform 0.2s'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <h3 style={{color: "blue"}}>Click to view the entire wishlist</h3>
                </div>
                </a>
            ) : (
                <p>No albums in this wishlist yet!</p>
            )}
        </div>
    );
};

export default Profile;