import React, { useContext, useState, useEffect, useRef } from 'react';
import { MovieContext } from '../MovieContext';
import MovieCard from './MovieCard';
import Spinner from './Spinner';
import '../styles/MovieGrid.css';


const MovieGrid = () => {
  const { filteredMovies, isLoading } = useContext(MovieContext);
  const [showNoResults, setShowNoResults] = useState(false);
  const wasLoading = useRef(false);


  useEffect(() => {
    let timer;

    if (wasLoading.current && !isLoading) {

      timer = setTimeout(() => {
        if (filteredMovies.length === 0) {
          setShowNoResults(true);
        }
      }, 2000);
    }

    if (isLoading || filteredMovies.length > 0) {
      setShowNoResults(false);
    }

    wasLoading.current = isLoading;

    return () => clearTimeout(timer);
  }, [isLoading, filteredMovies]);


  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }


  if (showNoResults) {
    return (
      <div className="no-results">
        <h2> Oops! </h2>
        <p> No movies found </p>
      </div>
    );
  }


  return (
    <div className="movie-grid-container">
      {filteredMovies.slice(0, 50).map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
