import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';

const GamesPage = ({
  auth,
  allGames,
  setGameView,

  favoriteGames,
  setFavoriteGames,
}) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [advancedSearchIsClicked, setAdvancedSearchIsClicked] = useState(false);

  const onChange = (search) => {
    let filtered = allGames.filter((each) => {
      let uppercaseName = each.name.toUpperCase();
      let uppercaseSearchInput = search[0].name.toUpperCase();
      return uppercaseName.includes(uppercaseSearchInput);
    });
    if (filtered.length > 0) {
      setFiltered(filtered);
    } else {
      alert('no matches found');
    }
  };

  return (
    <div id="gamesPage">
      <form id="searchGamesForm">
        <h3>Games</h3>
        <div>
          <Fragment>
            <Typeahead
              allowNew
              newSelectionPrefix="search for: "
              id="basic-typeahead-example"
              labelKey="name"
              onChange={onChange}
              options={allGames}
              placeholder="Search for a Game..."
              selected={selected}
            />
          </Fragment>
        </div>

        <Accordion id="advSearchForm">
          <Card id="advSearchCard">
            <Card.Header id="advSearchHeader">
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Advanced Search
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <div className="advGameType">
                  <h5>Game Type</h5>
                  <label className="checkbox" htmlFor="advVideogamesCheckbox">
                    <input
                      type="checkbox"
                      id="advVideogamesCheckbox"
                      name="advGameTypes"
                      value="Video Games"
                    />
                    <h6>Video Games</h6>
                  </label>
                  <label className="checkbox" htmlFor="advBoardgamesCheckbox">
                    <input
                      type="checkbox"
                      id="advBoardgamesCheckbox"
                      name="advGameTypes"
                      value="Board Games"
                    />
                    <h6>Board Games</h6>
                  </label>
                  <label className="checkbox" htmlFor="advTabletopCheckbox">
                    <input
                      type="checkbox"
                      id="advTabletopCheckbox"
                      name="advGameTypes"
                      value="Tabletop Games & RPGs"
                    />
                    <h6>Tabletop Games & RPGs</h6>
                  </label>
                  <label className="checkbox" htmlFor="advSportsCheckbox">
                    <input
                      type="checkbox"
                      id="advSportsCheckbox"
                      name="advGameTypes"
                      value="Sport & Field Games"
                    />
                    <h6>Sport & Field Games</h6>
                  </label>
                </div>
                <hr />
                <div className="advPlayesrNumber">
                  <h5>Players</h5>
                  <label className="checkbox" htmlFor="advPlayers1checkbox">
                    <input
                      type="checkbox"
                      id="advPlayers1checkbox"
                      name="advPlayersNumber"
                      value="1"
                    />
                    <h6>1</h6>
                  </label>
                  <label className="checkbox" htmlFor="advPlayers2checkbox">
                    <input
                      type="checkbox"
                      id="advPlayers2checkbox"
                      name="advPlayersNumber"
                      value="2"
                    />
                    <h6>2</h6>
                  </label>

                  <label className="checkbox" htmlFor="advPlayers3checkbox">
                    <input
                      type="checkbox"
                      id="advPlayers3checkbox"
                      name="advPlayersNumber"
                      value="3"
                    />
                    <h6>3</h6>
                  </label>
                  <label className="checkbox" htmlFor="advPlayers4checkbox">
                    <input
                      type="checkbox"
                      id="advPlayers4checkbox"
                      name="advPlayersNumber"
                      value="4"
                    />
                    <h6>4+</h6>
                  </label>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

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
          <i>Can't find your favorite game? </i>
          <a href="" style={greentext}>
            Let Us Know!
          </a>
        </h6>
      </form>
      <ul id="gamesList">
        {filtered.length > 0 &&
          filtered.map((game) => {
            return (
              <li key={game.id} className="gamesListItem">
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}
                >
                  <img className="gameListItemImage" src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>
              </li>
            );
          })}
        {filtered.length === 0 &&
          allGames.map((game) => {
            const addFavorite = async () => {
              const favoriteGamesCopy = [...favoriteGames];
              const newFavoriteGame = await Axios.post('/api/favoritegames', {
                userId: auth.id,
                gameId: game.id,
              }).data;

              setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
            };
            return (
              <li key={game.id} className="gamesListItem">
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}
                >
                  <img className="gameListItemImage" src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>

                <button type="button" onClick={addFavorite}>
                  Favorite
                </button>
                <hr className="hr" />
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
