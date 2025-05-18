import axios from 'axios';
import React, { useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';

const Album = () => {

    const { id } = useParams()
    const [albumData, setAlbumData] = useState(null)
    const [primaryImage, setPrimaryImage] = useState('/logo.png')
    
    

    useEffect(() => {
        if (!id) return
        const fetchAlbum = async () => {
            try {
                const res = await axios.get(`/api/search/${id}`)
                console.log(res.data)
                setAlbumData(res.data)

                const images = res.data.images || []
                console.log(images)
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
        console.log(albumData)
    }, [albumData])
    
    return (
        <div style={{
            background: '#fff',
            minHeight: '100vh',
            width: '100vw',
            padding: '2rem',
            boxSizing: 'border-box',
            margin: 0,
            position: 'absolute',
            top: 44,
            left: 0
        }}>
        {albumData ? (
            <div>     
                <img
                    src={primaryImage}
                    alt={"Album Cover Not Found"}
                    style={{
                        width: '100%',
                        maxWidth: '180px',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        background: '#f3f3f3'
                    }}
                />
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
    );
};

export default Album;
