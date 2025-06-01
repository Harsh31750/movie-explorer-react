import React from 'react';
import '../styles/Header.css';
import SearchBar from './SearchBar';


const Header = () => (
  <header className="app-header" role="banner">

    <h1 className="header-title" aria-label="Movie Search Heading">
      Search Your Movies Here!
    </h1>

    <SearchBar />

  </header>
);

export default Header;
