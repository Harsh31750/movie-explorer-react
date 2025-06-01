import React, { useContext } from 'react';
import { MovieContext } from '../MovieContext';
import MovieCard from './MovieCard';
import '../styles/MovieGrid.css';
import '../styles/Favourites.css';


const FavoriteMovieGrid = () => {
  const { favorites, setShowFavourites } = useContext(MovieContext);

  return (
    <div className="favourites-container">

      <div className="favourites-header">

        <h2>Your Favourite Movies</h2>
        <button
          className="back-btn"
          onClick={() => setShowFavourites(false)}
          aria-label="Back to All Movies"
        > ← Back </button>

      </div>

      {favorites.length === 0 ? (
        <p className="no-favourites-text">No favourites Movies</p>
      ) : (

        <div className="favourites-grid">

          {favorites.map(movie => (
            <MovieCard key={movie.imdbID} movie={movie} />

          ))}

        </div>

      )}
    </div>
  );
};

export default FavoriteMovieGrid;
