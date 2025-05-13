import axios from 'axios';
import React, { useState, useEffect } from 'react';


//implement caching
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    
    const searchDiscogs = async () => {
        try {
        
        const res = await axios.get(`/api/search`, {
            params: { artist: searchTerm.artist, release_title: searchTerm.release_title, genre: searchTerm.genre },
        });
        console.log(res.data.results)
        setResults(res.data.results);
        } catch (error) {
        console.error('Error fetching from backend:', error);
        }
    };

    return (
        <div style={{
            background: '#fff',
            minHeight: '100vh',
            width: '100vw',
            padding: '2rem',
            boxSizing: 'border-box',
            margin: 0,
            position: 'fixed',
            top: 44,
            left: 0
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
                `}
            </style>
            <div
                style={{
                    background: '#f6b648',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.08)',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: 'none',
                    margin: '0 auto 2rem auto',
                    border: '1px solid #e0e0e0',
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
            
        </div>
    );
};

export default Search;