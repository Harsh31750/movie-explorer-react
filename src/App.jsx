import React, { useContext } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import TrailerModal from './components/TrailerModal';
import FavoriteMovieGrid from './components/FavoriteMovieGrid';
import { MovieProvider, MovieContext } from './MovieContext';
import './styles/App.css';

const MainContent = () => {
  const { showFavourites } = useContext(MovieContext);

  return (
    <>
      {!showFavourites && <Filters />}

      {showFavourites ? <FavoriteMovieGrid /> : <MovieGrid />}

      <MovieModal />
      <TrailerModal />
    </>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <Header />
      <main>
        <MainContent />
      </main>
    </MovieProvider>
  );
};

export default App;
