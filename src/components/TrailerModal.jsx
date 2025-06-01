import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../MovieContext';
import '../styles/TrailerModal.css';


const TrailerModal = () => {
  const { trailerTitle, closeTrailer } = useContext(MovieContext);
  const [videoId, setVideoId] = useState(null);

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeTrailer();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeTrailer]);

  useEffect(() => {
    const fetchVideoId = async () => {
      if (!trailerTitle) return;

      try {
        const searchQuery = encodeURIComponent(`${trailerTitle} official trailer`);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${searchQuery}&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        const id = data?.items?.[0]?.id?.videoId;
        setVideoId(id);
      } catch (error) {
        console.error('Failed to fetch trailer:', error);
        setVideoId(null);
      }
    };

    fetchVideoId();
  }, [trailerTitle, YOUTUBE_API_KEY]);

  if (!trailerTitle || !videoId) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="trailer-modal-overlay"
      onClick={closeTrailer}
      role="dialog"
      aria-modal="true"
      aria-label="Trailer Modal"
    >
      <div className="trailer-modal-content" onClick={stopPropagation}>
        <button
          onClick={closeTrailer}
          className="trailer-close-btn"
          aria-label="Close trailer modal"
        >
          &times;
        </button>

        <iframe
          title="Movie Trailer"
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerModal;
