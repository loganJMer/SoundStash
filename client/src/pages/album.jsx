import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Album = () => {

    const { id } = useParams()
    const [isMaster, setIsMaster] = useState(false)
    const [albumData, setAlbumData] = useState(null)
    const [inCollection, setInCollection] = useState(false)
    const [artistOtherAlbums, setArtistOtherAlbums] = useState([])
    const [masters, setMasters] = useState([])
    const [primaryImage, setPrimaryImage] = useState('/logo.png')
    const [maxMasters, setMaxMasters] = useState(0)
    const mastersRowRef = React.useRef(null)

    const addToCollection = async () => {
        try {
            const res = await axios.patch('/api/addAlbum', {
                albumData: albumData,
                primaryImage: primaryImage,
                master: isMaster, 
            })
            if (res.data.success) {
                setInCollection(true)
            } else {
                console.error('Error adding album to collection:', res.data.message)
            }
        } catch (error) {
            console.error('Error adding album to collection:', error)
            if(error.response.data.error === 'Unauthorized'){
                window.location.href = '/signin';
            }
        }
    }

    const removeFromCollection = async () => {
        try {
            const res = await axios.patch('/api/removeAlbum', {
                albumId: albumData.id,
            })
            if (res.data.success) {
                setInCollection(false)
            } else {
                console.error('Error removing album from collection:', res.data.message)
            }
        } catch (error) {
            console.error('Error removing album from collection:', error)
            if(error.response.data.error === 'Unauthorized'){
                window.location.href = '/signin';
            }
        }
    }



    //gets album info and primary image
    useEffect(() => {
        if (!id) return
        const fetchAlbum = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const isMaster = params.get('master') === 'true';
                let res;
                if(isMaster) {
                    setIsMaster(true)
                    res = await axios.get(`/api/masterSearch/${id}`)
                } else{
                    res = await axios.get(`/api/search/${id}`)
                }
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

    //check if album is in collection
    useEffect(() => {
        if (!albumData) return
        const checkAlbumInCollection = async () => {
            try {
                console.log(albumData.id)
                const res = await axios.get('/api/checkAlbumInCollection', {
                    params: { albumId: albumData.id }
                })
                if (res.data.albumInCollection) {
                    setInCollection(true)
                } else {
                    setInCollection(false)
                }
            } catch (error) {
                console.error('Error checking album in collection:', error)
            }
        }
        checkAlbumInCollection()
    }, [albumData])


    //get other albums from artist
    //if artist is Various, do not fetch other albums
    useEffect(() => {
    
        if (!albumData) return
        if(albumData.artists[0].name === 'Various') return
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
        if(!albumData) return
        const fetchVersions = async () => {
            try {
                if (isMaster) {
                    var masterId = id
                } else{
                    var masterId = albumData.master_id
                }
                const res = await axios.get(`/api/searchVersions/${masterId}`)
                for (let i = 0; i < 15; i++) {
                    res.data.versions.push({ id: `placeholder-${i}`, thumb: '/logo.png' });
                }
                setMasters(res.data.versions)
            } catch (error) {
                console.error('Error fetching versions:', error)
            }
        };
        fetchVersions()
    }, [albumData, isMaster, id]);

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
                <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'flex-start', background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', maxWidth: '800px', color: '#000', width: '100%', maxHeight: '400px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                        {!isMaster && albumData && albumData.master_id ? (
                            <a href={`/album/${albumData.master_id}?master=true`} style={{ textDecoration: 'none' }}>
                                <button style={{
                                    marginTop: '0.5rem',
                                    background: '#1976d2',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                    transition: 'background 0.2s'
                                }}>
                                    View Master Release
                                </button>
                            </a>
                        ) : null}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10rem'}}>
                        <div style={{
                            display: 'inline-block',
                            verticalAlign: 'top',
                            marginLeft: '2rem',
                            color: '#000'
                        }}>
                            <h2>{albumData.title || 'Unknown Title'}</h2>
                            <p><strong>Artist:</strong> {albumData.artists[0].name || 'Unknown Artist'}</p>
                            <p><strong>Year:</strong> {albumData.year || 'Unknown Year'}</p>
                            {/* add more info later */}
                            <div style={{ marginTop: '1.5rem' }}>
                                {inCollection ? (
                                    <button
                                        onClick={removeFromCollection}
                                        style={{
                                            background: '#d32f2f',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '0.5rem 1rem',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            marginBottom: '0.5rem',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        Remove from Collection
                                    </button>
                                ) : (
                                    <button
                                        onClick={addToCollection}
                                        style={{
                                            background: '#388e3c',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '0.5rem 1rem',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            marginBottom: '0.5rem',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        Add to Collection
                                    </button>
                                )}
                            </div>
                        </div>
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
