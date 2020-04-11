import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';

const GamesPage = ({ allGames, setGameView }) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);

  const onChange = (selection) => {
    setSelected(selection);
    let filtered = allGames.filter((each) => {
      return each.id === selection[0].id;
    });
    setFiltered(filtered);
  };

  return (
    <div id='gamesPage'>
      <form id='searchGamesForm'>
        <h3>Games</h3>
        <div>
          <Fragment>
            <Typeahead
              id='basic-typeahead-example'
              labelKey='name'
              onChange={onChange}
              options={allGames}
              placeholder='Choose a game...'
              selected={selected}
            />
          </Fragment>
        </div>
        <h6>
          <a href=''>Advanced Search</a>
        </h6>
        {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}
        <button
          className='searchButton'
          onSubmit={(ev) => onSubmit(ev.target.value)}>
          <h5>Search</h5>
        </button>
        <h6>
          <i>Is your favorite game unsupported?</i>
        </h6>
        <h6>
          <a href='' style={greentext}>
            Contact Us!
          </a>
        </h6>
      </form>
      <ul id='gamesList'>
        {filtered.length > 0 &&
          filtered.map((game) => {
            return (
              <li key={game.id} className='gamesListItem'>
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}>
                  <img className='gameListItemImage' src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>
              </li>
            );
          })}
        {filtered.length === 0 &&
          allGames.map((game) => {
            return (
              <li key={game.id} className='gamesListItem'>
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}>
                  <img className='gameListItemImage' src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>

                <button type='button'>Favorite</button>
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
