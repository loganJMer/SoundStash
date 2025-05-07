import axios from 'axios';
import React, { useState, useEffect } from 'react';


//implement caching
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('release_title');
    const [results, setResults] = useState([]);
    
    const searchDiscogs = async () => {
        try {
        const response = await axios.get(`/api/search`, {
            params: { searchTerm: searchTerm, searchType: searchType },
        });
        setResults(response.data.results);
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
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    style={{ marginRight: '0.5rem' }}
                />
                <select
                    value={searchType}
                    onChange={e => setSearchType(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                >
                    <option value="release_title">Title</option>
                    <option value="artist">Artist</option>
                    <option value="release_year">Release Year</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default Search;