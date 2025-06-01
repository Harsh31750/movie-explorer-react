import React, { useContext, useState } from 'react';
import { MovieContext } from '../MovieContext';
import '../styles/SearchBar.css';


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchMovies, initialMovies, setMovies } = useContext(MovieContext);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      searchMovies(trimmedQuery);
    } else {
      setMovies(initialMovies);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setMovies(initialMovies);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        className="search-input"
        type="text"
        placeholder="Search for a movie..."
        aria-label="Search for a movie"
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-btn" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
