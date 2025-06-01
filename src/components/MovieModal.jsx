import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../MovieContext';
import errorImage from '../assets/errorImage.png';
import '../styles/MovieModal.css';


const MovieModal = () => {
  const {
    modalMovie,
    closeModal,
    addFavorite,
    removeFavorite,
    favorites,
    showTrailer,
  } = useContext(MovieContext);

  const [showFullPlot, setShowFullPlot] = useState(false);


  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
  
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeModal]);

  if (!modalMovie) return null;

  const posterSrc =
    modalMovie.Poster && modalMovie.Poster !== 'N/A'
      ? modalMovie.Poster
      : errorImage;

  const handleImgError = (e) => {
    e.target.src = errorImage;
    e.target.onerror = null;
  };

  const togglePlot = () => setShowFullPlot(!showFullPlot);

  const isFavourite = favorites.some(
    (favMovie) => favMovie.imdbID === modalMovie.imdbID
  );

  const handleFavouriteClick = () => {
    if (isFavourite) {
      removeFavorite(modalMovie.imdbID);
    } else {
      addFavorite(modalMovie);
    }
  };

  const handleWatchTrailer = () => {
    showTrailer(modalMovie.Title);
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={closeModal} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            {modalMovie.Title} <span>({modalMovie.Year})</span>
          </h2>
        </div>

        <div className="modal-body">
          <img
            src={posterSrc}
            alt={`${modalMovie.Title} Poster`}
            className="modal-poster"
            onError={handleImgError}
          />

          <div className="modal-info">
            <p><strong>Genre:</strong> {modalMovie.Genre || 'N/A'}</p>
            <p><strong>Director:</strong> {modalMovie.Director || 'N/A'}</p>
            <p><strong>Actors:</strong> {modalMovie.Actors || 'N/A'}</p>

            <p className="plot-text">
              <strong>Plot:</strong>{' '}
              {modalMovie.Plot
                ? showFullPlot
                  ? modalMovie.Plot
                  : `${modalMovie.Plot.slice(0, 160)}...`
                : 'N/A'}
              {modalMovie.Plot && modalMovie.Plot.length > 160 && (
                <button className="see-more-btn" onClick={togglePlot}>
                  {showFullPlot ? 'See Less' : 'See More'}
                </button>
              )}
            </p>

            <p><strong>IMDB Rating:</strong> ⭐ {modalMovie.imdbRating || 'N/A'}</p>
            <p><strong>Box Office:</strong> {modalMovie.BoxOffice || 'Not Available'}</p>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn favorite-btn" onClick={handleFavouriteClick}>
            {isFavourite ? '💔 Remove from Favourites' : '💖 Add to Favourites'}
          </button>

          <button className="btn trailer-btn" onClick={handleWatchTrailer}>
            🎬 Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
