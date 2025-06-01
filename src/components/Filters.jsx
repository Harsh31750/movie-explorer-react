import React, { useContext } from 'react';
import { MovieContext } from '../MovieContext';
import '../styles/Filters.css';


const Filters = () => {

  const {
    filters,
    updateFilter,
    sortOrder,
    updateSortOrder,
    showFavourites,
    setShowFavourites,
  } = useContext(MovieContext);

  return (
    <div className="filters-favourites-wrapper" role="form" aria-label="Filter and Sort Movies">

      {showFavourites ? (
        <div className="favourites-header">

          <h2>Your Favourite Movies</h2>
          <button
            className="back-btn"
            onClick={() => setShowFavourites(false)}
            aria-label="Back to Home"
          > ← Back </button>

        </div>) : (
        <>

          <div className="filters-section">
            <select
              className="Genre"
              value={filters.genre}
              onChange={(e) => updateFilter('genre', e.target.value)}
              aria-label="Filter by Genre"
            >
              <option value="">Filter by Genre</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Thriller">Thriller</option>
            </select>

            <input
              className="number"
              type="number"
              placeholder="Year (e.g. 2023)"
              value={filters.year}
              onChange={(e) => updateFilter('year', e.target.value)}
              aria-label="Filter by Year"
            />

            <select
              className="Sort"
              value={sortOrder}
              onChange={(e) => updateSortOrder(e.target.value)}
              aria-label="Sort by"
            >
              <option value="">Sort By</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="year-desc">Year: New to Old</option>
              <option value="year-asc">Year: Old to New</option>
            </select>
          </div>

          <div className="favourites-button-section">
            <button
              className="favourite-movies-btn"
              onClick={() => setShowFavourites(true)}
              aria-label="Show Favourite Movies"
            > ❤️ Favourite Movies </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;
