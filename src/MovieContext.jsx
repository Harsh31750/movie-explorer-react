import React, { createContext, useState, useEffect, useCallback } from 'react';


export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [initialMovies, setInitialMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({ genre: '', year: '' });
  const [sortOrder, setSortOrder] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [modalMovie, setModalMovie] = useState(null);
  const [trailerTitle, setTrailerTitle] = useState(null);
  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [showFavourites, setShowFavourites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const searchTerms = ['action', 'comedy', 'drama', 'adventure', 'thriller', 'fantasy'];
  const MAX_MOVIES = 250;


  const fetchFullMovieDetails = async (imdbID) => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
    return await res.json();
  };


  const fetchMoviesByTermPage = async (term, page) => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}&page=${page}`);
    const data = await res.json();
    return data.Search || [];
  };


  const loadInitialMovies = useCallback(
    async (searchTerm = '') => {
      setIsLoading(true);
      try {
        if (searchTerm.trim() === '') {
          let allMoviesBasic = [];

          for (const term of searchTerms) {
            let page = 1;
            let totalPagesReached = false;

            while (!totalPagesReached && allMoviesBasic.length < MAX_MOVIES) {
              const moviesPage = await fetchMoviesByTermPage(term, page);
              if (moviesPage.length === 0) break;

              allMoviesBasic = allMoviesBasic.concat(moviesPage);
              page++;

              if (moviesPage.length < 10 || allMoviesBasic.length >= MAX_MOVIES) {
                totalPagesReached = true;
              }
            }

            if (allMoviesBasic.length >= MAX_MOVIES) break;
          }



          const uniqueMoviesMap = {};
          allMoviesBasic.forEach((m) => {
            if (m?.imdbID) uniqueMoviesMap[m.imdbID] = m;
          });
          const uniqueMovies = Object.values(uniqueMoviesMap).slice(0, MAX_MOVIES);

          const fullMovies = await Promise.all(
            uniqueMovies.map(async (movie) => {
              try {
                const details = await fetchFullMovieDetails(movie.imdbID);
                return details?.Response === 'True' ? details : null;
              } catch {
                return null;
              }
            })
          );


          const validMovies = fullMovies.filter(Boolean);
          setMovies(validMovies);
          setInitialMovies(validMovies);
        } else {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
          const data = await res.json();

          if (data.Response === 'True') {
            const fullMovies = await Promise.all(
              data.Search.map(async (movie) => {
                const details = await fetchFullMovieDetails(movie.imdbID);
                return details?.Response === 'True' ? details : null;
              })
            );

            const validMovies = fullMovies.filter(Boolean);
            setMovies(validMovies);
          } else {
            setMovies([]);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setMovies([]);
      }

      setIsLoading(false);
    },
    [API_KEY, fetchFullMovieDetails, fetchMoviesByTermPage, searchTerms]
  );





  const updateFilter = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };


  const updateSortOrder = (order) => {
    setSortOrder(order);
  };


  useEffect(() => {
    const applyFilters = () => {
      let temp = [...movies];

      if (filters.year) {
        temp = temp.filter((m) => m.Year === filters.year);
      }

      if (filters.genre) {
        temp = temp.filter((m) => {
          const genres = m.Genre ? m.Genre.split(', ') : [];
          return genres.includes(filters.genre);
        });
      }

      if (sortOrder.includes('rating')) {
        temp.sort((a, b) =>
          sortOrder === 'rating-desc' ? b.imdbRating - a.imdbRating : a.imdbRating - b.imdbRating
        );
      } else if (sortOrder.includes('year')) {
        temp.sort((a, b) =>
          sortOrder === 'year-desc' ? b.Year - a.Year : a.Year - b.Year
        );
      }

      setFilteredMovies(temp);
    };

    if (movies.length === 0) {
      loadInitialMovies();
    } else {
      applyFilters();
    }
  }, [movies, filters, sortOrder, loadInitialMovies]);



  const addFavorite = (movie) => {
    if (!favorites.some((m) => m.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (imdbID) => {
    setFavorites(favorites.filter((m) => m.imdbID !== imdbID));
  };

  const toggleFavorite = (movie) => {
    isFavorite(movie.imdbID) ? removeFavorite(movie.imdbID) : addFavorite(movie);
  };

  const isFavorite = (id) => favorites.some((m) => m.imdbID === id);

  const openModal = (id) => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => setModalMovie(data));
  };

  const closeModal = () => setModalMovie(null);



  const fetchTrailerVideoId = async (title) => {
    try {
      const query = encodeURIComponent(`${title} official trailer`);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&maxResults=1&q=${query}`
      );
      const data = await res.json();
      return data?.items?.[0]?.id?.videoId || null;
    } catch (err) {
      console.error('YouTube fetch error:', err);
      return null;
    }
  };


  const showTrailer = async (title) => {
    setTrailerTitle(title);
    const videoId = await fetchTrailerVideoId(title);
    setTrailerVideoId(videoId);
  };

  const closeTrailer = () => {
    setTrailerTitle(null);
    setTrailerVideoId(null);
  };



  return (
    <MovieContext.Provider
      value={{
        filteredMovies,
        filters,
        sortOrder,
        favorites,
        modalMovie,
        trailerTitle,
        trailerVideoId,
        searchMovies: loadInitialMovies,
        updateFilter,
        updateSortOrder,
        toggleFavorite,
        isFavorite,
        openModal,
        closeModal,
        showTrailer,
        closeTrailer,
        addFavorite,
        removeFavorite,
        showFavourites,
        setShowFavourites,
        initialMovies,
        setMovies,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
