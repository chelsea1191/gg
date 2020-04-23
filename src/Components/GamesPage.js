import React, { useState, useEffect, Fragment } from 'react';
import SearchDropdown from './SearchDropdown';
import AdvancedSearch from './AdvancedSearch';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Axios from 'axios';

const GamesPage = ({
  auth,
  allGames,
  setGameView,
  favoriteGames,
  setFavoriteGames,
}) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const link = 'gamesPage';
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let filteredItemIfPresent = JSON.parse(localStorage.getItem('filtered'));
    if (filteredItemIfPresent) {
      setFiltered(filteredItemIfPresent);
    }
  }, [setFiltered]);
  // useEffect(() => {
  //   if (filtered.length === 0) {
  //     setFiltered(allGames);
  //   }
  // });

  return (
    <div id='gamesPage'>
      <form id='searchGamesForm'>
        <h3>Games</h3>
        <div>
          <SearchDropdown allGames={allGames} setFiltered={setFiltered} />
        </div>
        <h6>
          <AdvancedSearch
            filtered={filtered}
            link={link}
            setFiltered={setFiltered}
            allGames={allGames}
          />
        </h6>
        {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}
        <h6>
          <i>Can't find your favorite game? </i>
          <a
            href='mailto:support@gg-connect.com?Subject=Game%20Support'
            target='_top'>
            Let Us Know!
          </a>
        </h6>
      </form>
      <p>displaying {filtered.length} games</p>
      <ul id='gamesList'>
        {filtered.length > 0 &&
          filtered.map((game) => {
            const addFavorite = async () => {
              const favoriteGamesCopy = [...favoriteGames];
              const newFavoriteGame = await Axios.post('/api/favoritegames', {
                userId: auth.id,
                gameId: game.id,
              }).data;

              setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
            };
            return (
              <li key={game.id} className='gamesListItem'>
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}>
                  <img className='gameListItemImage' src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>

                <button type='button' onClick={addFavorite}>
                  <h5>Favorite</h5>
                </button>
                <hr className='hr' />
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

//chelsea still working on advanced search
