import React, { useState, useEffect } from 'react';
import GamePage from './GamePage';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const GamesPage = ({ allGames, setView }) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const [searchInput, setSearchInput] = useState('');
  const [filtered, setFiltered] = useState([]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setSearchInput(ev.target.value);
    let filtered = allGames.filter((each) => {
      let uppercaseName = each.name.toUpperCase();
      let uppercaseSearchInput = searchInput.toUpperCase();
      return uppercaseName.includes(uppercaseSearchInput);
    });
    if (filtered.length > 0) {
      setFiltered(filtered);
    }
  };

  return (
    <div id="gamesPage">
      <form id="searchGamesForm">
        <h3>Games</h3>
        <input
          type="text"
          placeholder="Search for a Game"
          value={searchInput}
          onChange={(ev) => onSubmit(ev)}
        />
        {/*
          INPUT NEEDS AUTO-SUGGEST/COMPLETE DROPDOWN OPTIONS BASED ON ALL GAME NAMES THAT MATCH FIELD INPUT
          AS USER TYPES, LIST OF GAMES NARROWS BASED ON MATCHING TITLE
          WHEN DROPDOWN OPTION IS CLICKED, LINKS TO GAME PAGE
          IF NO INPUT, LIST IS TOP GAMES BY POPULARITY
          */}
        <h6>
          <a href="">Advanced Search</a>
        </h6>
        {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}
        <button
          className="searchButton"
          onSubmit={(ev) => onSubmit(ev.target.value)}
        >
          <h5>Search</h5>
        </button>
        <h6>
          <i>Is your favorite game unsupported?</i>
        </h6>
        <h6>
          <a href="" style={greentext}>
            Contact Us!
          </a>
        </h6>
      </form>
      <ul id="gamesList">
        {filtered.length > 0 &&
          filtered.map((game) => {
            return (
              <li key={game.id} className="gamesListItem">
                <Link to={`/games/${game.id}`} onClick={(ev) => setView(game)}>
                  <img className="gameListItemImage" src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>
              </li>
            );
          })}
        {filtered.length === 0 &&
          allGames.map((game) => {
            return (
              <li key={game.id} className="gamesListItem">
                <Link to={`/games/${game.id}`} onClick={(ev) => setView(game)}>
                  <img className="gameListItemImage" src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>
              </li>
            );
          })}
        {/*
          LIST OF GAMES THAT MATCH SEARCH PARAMETERS
           INCLUDES COVER IMAGE, TITLE, NUMBER OF USERS, FRIENDS THAT PLAY, AVERAGE RATING, AND 'ADD FAVORITE GAME' BUTTON
           LIST ITEMS LINK TO GAME PAGES
          */}
      </ul>
    </div>
  );
};

export default GamesPage;
