import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Album = () => {

    const { id } = useParams()
    const [albumData, setAlbumData] = useState(null)
    const [artistOtherAlbums, setArtistOtherAlbums] = useState([])
    const [masters, setMasters] = useState([])
    const [primaryImage, setPrimaryImage] = useState('/logo.png')
    const [maxMasters, setMaxMasters] = useState(0)
    const mastersRowRef = React.useRef(null)

    //gets album info and primary image
    useEffect(() => {
        if (!id) return
        const fetchAlbum = async () => {
            try {
                const res = await axios.get(`/api/search/${id}`)
                setAlbumData(res.data)

                const images = res.data.images || []

                const primaryImage = images.find(image => image.type === 'primary') || images[0]
                if(primaryImage) {
                    setPrimaryImage(primaryImage.uri)
                }
            } catch (error) {
                console.error('Error fetching album:', error)
            }
        };
        fetchAlbum()
    }, [id])

    useEffect(() => {
    
        if (!albumData) return
        const fetchArtistOtherAlbums = async () => {
            try {
                const res = await axios.get(`/api/searchArtist/${albumData.artists[0].id}`)
                setArtistOtherAlbums(res.data.images)
            } catch (error) {
                console.error('Error fetching artist albums:', error)
            }
        };
        fetchArtistOtherAlbums()
    }, [albumData])


    //gets some versions of album to display
    useEffect(() => {
        if(!id) return
        const fetchMasters = async () => {
            try {
                const res = await axios.get(`/api/searchVersions/${id}`)
                for (let i = 0; i < 15; i++) {
                    res.data.versions.push({ id: `placeholder-${i}`, thumb: '/logo.png' });
                }
                setMasters(res.data.versions)
            } catch (error) {
                console.error('Error fetching versions:', error)
            }
        };
        fetchMasters()
    }, [id]);

    // Calculate how many masters fit in one row
    useEffect(() => {
        const handleResize = () => {
            if (mastersRowRef.current) {
                const containerWidth = mastersRowRef.current.offsetWidth;
                const itemWidth = 100 + 16; // 100px image + 16px gap
                const count = Math.floor(containerWidth / itemWidth);
                setMaxMasters(count > 0 ? count : 1);
            }
        };
        setTimeout(() => {
            handleResize();
        }, 1000);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [masters.length]);

    return (
        <div style={{
            background: 'rgb(243, 189, 127)',
            minHeight: '100vh',
            width: '100%',
            padding: '2rem',
            boxSizing: 'border-box',
            margin: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            color: '#000'
        }}>
            {albumData ? (
                <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'flex-start', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', maxWidth: '800px', color: '#000', width: '100%', maxHeight: '400px' }}>
                    <img
                        src={primaryImage}
                        alt={"Album Cover Not Found"}
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            background: '#f3f3f3',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.12)',
                            transform: 'translateY(-6px) scale(1.03)',
                            transition: 'box-shadow 0.2s, transform 0.2s'
                        }}
                    />
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        marginLeft: '2rem',
                        maxWidth: '500px',
                        color: '#000'
                    }}>
                        <h2>{albumData.title || 'Unknown Title'}</h2>
                        <p><strong>Artist:</strong> {albumData.artists[0].name || 'Unknown Artist'}</p>
                        <p><strong>Year:</strong> {albumData.year || 'Unknown Year'}</p>
                        {/* add more info later */}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {artistOtherAlbums && artistOtherAlbums.length > 0 && albumData && (
                <a href={`/search?artist=${encodeURIComponent(albumData.artists[0].name)}`} style={{}}>
                <div style ={{
                        position : 'absolute',
                        top: '6rem',
                        right: '4rem',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 18px rgba(0,0,0,0.13)',
                        padding: '2rem 2rem 0.5rem 2rem',
                        gap: '1.5rem',
                        width: 'auto',
                        minHeight: '180px',
                        alignItems: 'center',
                        justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 130px)',
                        gridTemplateRows: 'repeat(2, 130px)',
                        gap: '1.5rem',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {artistOtherAlbums.slice(0, 4).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Album image ${idx + 1}`}
                                style={{
                                    width: '130px',
                                    height: '130px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.12)',
                                    background: '#f3f3f3',
                                    transform: 'translateY(-4px) scale(1.04)',
                                    transition: 'box-shadow 0.2s, transform 0.2s'
                                }}
                            />
                        ))}
                    </div>
                    <p style={{color: "blue"}}>
                        <strong>
                            Click to view more releases from {albumData.artists[0].name}
                        </strong>
                    </p>
                </div>
                </a>
            )}

            {masters.length > 0 && albumData && albumData.artists && albumData.artists[0] && albumData.title ? (
                <a href={`/search?artist=${encodeURIComponent(albumData.artists[0].name)}&release_title=${encodeURIComponent(albumData.title)}&type=releases`} style={{}}>
                <div style={{ marginTop: '6rem', background: '#fff', padding: '1rem 1rem 0.01rem 1rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' }}>
                    <div
                        ref={mastersRowRef}
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
                        {masters.slice(0, maxMasters).map((master) => (
                            <div key={master.id} style={{
                                width: '100px',
                                height: '100px',
                                flex: '0 0 100px',
                                justifySelf: 'center'
                            }}>
                                <img
                                    src={master.thumb || '/logo.png'}
                                    alt={"Master Cover Not Found"}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        display: 'block',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                        transition: 'box-shadow 0.2s, transform 0.2s'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <h3 style={{color: "blue"}}>Click here to view individual releases of this album</h3>
                </div>
                </a>
            ) : (
                <p>No masters found.</p>
            )}

        </div>
        
    );
}



export default Album;
