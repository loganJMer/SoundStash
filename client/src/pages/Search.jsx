import axios from 'axios';
import React, { useState, useEffect } from 'react';


//implement caching
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    
    const searchDiscogs = async () => {
        try {
        
        const res = await axios.get(`/api/search`, {
            params: {artist: searchTerm.artist, release_title: searchTerm.release_title, genre: searchTerm.genre },
        });
        console.log(res.data.results)
        setResults(res.data.results);
        } catch (error) {
        console.error('Error fetching from backend:', error);
        }
    };

    return (
        <div style={{
            background: 'rgb(243, 189, 127)',
            minHeight: '100vh',
            width: '100vw',
            padding: '2rem',
            boxSizing: 'border-box',
            margin: 0,
            position: 'absolute',
            top: 44,
            left: 0,
        }}>
            <style>
                {`
                    input {
                        margin-right: 0.5rem;
                        width: 25%;
                        min-width: 100px;
                        max-width: 300px;
                        padding: 0.6rem 0.5rem;
                        background: #fff;
                        color: #000;
                        border: 1px solid #d3d3d3;
                        border-radius: 10px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                        outline: none;
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
                    a.result-link {
                        text-decoration: none;
                        color: inherit;
                    }
                `}
            </style>
            <br></br>
            <div
                style={{
                    background: '#f5b547',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.08)',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: 'none',
                    margin: '0 auto 2rem auto',
                    boxSizing: 'border-box'
                }}
            >
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        searchDiscogs();
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: 0,
                        maxWidth: '100%',
                        justifyContent: 'flex-start'
                    }}
                >
                    <input
                        type="text"
                        value={searchTerm.artist || ''}
                        onChange={e => setSearchTerm(prev => ({ ...prev, artist: e.target.value }))}
                        placeholder="Artist"
                    />  
                    <input
                        type="text"
                        value={searchTerm.release_title || ''}
                        onChange={e => setSearchTerm(prev => ({ ...prev, release_title: e.target.value }))}
                        placeholder="Release Title"
                    />
                    <select
                        value={searchTerm.genre || ''}
                        onChange={e => setSearchTerm(prev => ({ ...prev, genre: e.target.value }))}
                        style={{
                            marginRight: '0.5rem',
                            width: '20%',
                            minWidth: '100px',
                            maxWidth: '200px',
                            padding: '0.6rem 0.5rem',
                            background: '#fff',
                            color: '#000',
                            border: '1px solid #d3d3d3',
                            borderRadius: '10px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            outline: 'none'
                        }}
                    >
                        <option value="All genres">All Genres</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Classical">Classical</option>
                        <option value="Folk">Folk</option>
                        <option value="Reggae">Reggae</option>
                        <option value="Blues">Blues</option>
                        <option value="Funk / Soul">Funk / Soul</option>
                        <option value="Country">Country</option>
                        <option value="Latin">Latin</option>
                        <option value="Stage & Screen">Stage & Screen</option>
                        <option value="Children's">Children's</option>
                    
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    marginTop: '2rem',
                }}
            >
                {results && results.length > 0 ? (
                    results.map((item, idx) => (
                        <a
                            href={`/album/${item.master_id || idx}`}
                            className="result-link"
                            key={item.id || idx}
                            style={{ display: 'block' }}
                        >
                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minHeight: '260px',
                                }}
                            >
                                <img
                                    src={item.cover_image || "logo.png"}
                                    alt={item.title}
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
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center', color: '#000'}}>
                                    {item.title}
                                </div>
                                <div style={{ color: '#888', fontSize: '0.9em', textAlign: 'center' }}>
                                    {item.genre && Array.isArray(item.genre) ? item.genre.join(', ') : item.genre}
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: '1.1em' }}>
                        No results found. Try searching for something!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;