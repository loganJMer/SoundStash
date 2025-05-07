import axios from 'axios';
import React, { useState, useEffect } from 'react';


//implement caching
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    
    const searchDiscogs = async () => {
        try {
        const res = await axios.get(`/api/search`, {
            params: { artist: searchTerm.artist, release_title: searchTerm.release_title },
        });
        console.log(res.data.results)
        setResults(res.data.results);
        } catch (error) {
        console.error('Error fetching from backend:', error);
        }
    };

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    searchDiscogs();
                }}
                style={{ marginBottom: '1rem' }}
            >
                <input
                    type="text"
                    value={searchTerm.artist || ''}
                    onChange={e => setSearchTerm(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder="Artist"
                    style={{ marginRight: '0.5rem' }}
                />
                <input
                    type="text"
                    value={searchTerm.release_title || ''}
                    onChange={e => setSearchTerm(prev => ({ ...prev, release_title: e.target.value }))}
                    placeholder="Release Title"
                    style={{ marginRight: '0.5rem' }}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default Search;