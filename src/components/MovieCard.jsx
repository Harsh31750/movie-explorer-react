import React, { useContext } from 'react';
import { MovieContext } from '../MovieContext';
import '../styles/MovieCard.css';
import errorImage from '../assets/errorImage.png';


const MovieCard = ({ movie }) => {
  const { openModal, toggleFavorite, showTrailer, isFavorite } = useContext(MovieContext);

  const genreText = movie.Genre || 'N/A';
  const rating = movie.imdbRating !== 'N/A' ? movie.imdbRating : 'Not Rated';

  const votes = movie.imdbVotes && movie.imdbVotes !== 'N/A'
    ? Number(movie.imdbVotes.replace(/,/g, ''))
    : null;


  return (
    <div className="movie-card" onClick={() => openModal(movie.imdbID)} tabIndex={0} role="button" aria-pressed="false">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : errorImage}
        alt={movie.Title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = errorImage;
        }}
      />

      <div className="movie-card-content">

        <h2 title={movie.Title}>
          {movie.Title} <span className="movie-year-inline">({movie.Year || 'N/A'})</span>
        </h2>

        <p className="rating">⭐ IMDB: {rating}</p>

        <p className="type-genre">
          Type: {movie.Type || 'Movie'}<br />
          Genre: {genreText}
        </p>

        {votes !== null && (
          <p className="likes">
            <i className="fas fa-heart" aria-hidden="true"></i> {votes.toLocaleString('en-IN')} votes
          </p>
        )}

      </div>


      <div className="modal-btn">
        <button
          className="Fav"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
          aria-label={isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(movie.imdbID) ? '💔 Remove Favorite' : '❤️ Add Favorite'}
        </button>

        <button
          className="WT"
          onClick={(e) => {
            e.stopPropagation();
            showTrailer(movie.Title);
          }}
          aria-label={`Watch trailer for ${movie.Title}`}
        > ▶️ Watch Trailer </button>
      </div>
    </div>
  );
};

export default MovieCard;
