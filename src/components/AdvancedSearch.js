import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const greentext = { color: 'rgb(0, 200, 0)' };

const AdvancedSearch = ({ allGames, setFiltered, filtered, link }) => {
  const [playerSelections, setPlayerSelections] = useState([]); //array of checkbox selections
  const [gameTypeSelections, setGameTypeSelections] = useState([]); //array of game type selections

  const handleSubmit = (ev) => {
    ev.preventDefault();
    let arrayOfGamesFilteredByPlayers = []; //array of games that includes duplicates
    let arrayOfGamesFilteredByGameType = [];
    if (playerSelections.length === 0) {
      //if no players were selected then just search allgames
      arrayOfGamesFilteredByPlayers = [...allGames];
    } else {
      //filtering by player numbers
      playerSelections.map((filterNum) => {
        //map over selections
        allGames.map((game) => {
          //for each game, if the minimum is <= filterNum, push into array
          if (game.min_players <= filterNum && game.max_players >= filterNum) {
            arrayOfGamesFilteredByPlayers.push(game);
          }
        });
      });
    }
    if (gameTypeSelections.length === 0) {
      arrayOfGamesFilteredByGameType = [...arrayOfGamesFilteredByPlayers];
    } else {
      //filtering by gametype
      gameTypeSelections.map((filterType) => {
        //map over selections
        arrayOfGamesFilteredByPlayers.map((game) => {
          //for each game, if the game.gameTypeID === the filterType, push into arrayOfGamesFilteredByGameType
          if (game.gameTypeID == filterType) {
            arrayOfGamesFilteredByGameType.push(game);
          }
        });
      });
    }
    const uniqueArrayOfGames = new Set(arrayOfGamesFilteredByGameType);
    const finalArrayOfGames = [...uniqueArrayOfGames];
    setFiltered(finalArrayOfGames);
  };

  const updatePlayerState = (ev) => {
    const indexOfNum = playerSelections.indexOf(ev.target.value);
    if (indexOfNum > -1) {
      //if it already exists, take it out
      const oldArray = playerSelections;
      oldArray.splice(indexOfNum, 1);
      setPlayerSelections(oldArray);
    } else {
      setPlayerSelections([...playerSelections, ev.target.value]);
    }
  };

  const updateGameTypeState = (ev) => {
    const indexOfNum = gameTypeSelections.indexOf(ev.target.value);
    if (indexOfNum > -1) {
      //if it already exists, take it out
      const oldArray = gameTypeSelections;
      oldArray.splice(indexOfNum, 1);
      setGameTypeSelections(oldArray);
    } else {
      setGameTypeSelections([...gameTypeSelections, ev.target.value]);
    }
  };

  return (
    <Accordion id="advSearchForm">
      <Card id="advSearchCard">
        <Card.Header id="advSearchHeader">
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            <h5>
              <b style={greentext}>Advanced Search</b>
            </h5>
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body id="advSearchBody">
            <h6>
              <i>Search by Game Category</i>
            </h6>
            <br />
            <hr className="hr" />
            <div className="advGameType">
              <h5>Game Type</h5>
              <label className="checkbox" htmlFor="advBoardgamesCheckbox">
                <input
                  type="checkbox"
                  id="advBoardgamesCheckbox"
                  name="advGameTypes"
                  value="1"
                  onClick={(ev) => updateGameTypeState(ev)}
                />
                <h6>Board Games</h6>
              </label>
              <label className="checkbox" htmlFor="advTabletopCheckbox">
                <input
                  type="checkbox"
                  id="advTabletopCheckbox"
                  name="advGameTypes"
                  value="3"
                  onClick={(ev) => updateGameTypeState(ev)}
                />
                <h6>Tabletop Games & RPGs</h6>
              </label>
              <label className="checkbox" htmlFor="advCardCheckbox">
                <input
                  type="checkbox"
                  id="advCardCheckbox"
                  name="advGameTypes"
                  value="2"
                  onClick={(ev) => updateGameTypeState(ev)}
                />
                <h6>Card Games</h6>
              </label>
            </div>
            <hr />
            <div className="advPlayersNumber">
              <h5>Players</h5>
              <div id="advSearchNumBoxes">
                <label className="checkbox" htmlFor="advPlayers2checkbox">
                  <input
                    type="checkbox"
                    id="advPlayers2checkbox"
                    name="advPlayersNumber"
                    value="2"
                    onClick={(ev) => updatePlayerState(ev)}
                  />
                  <h6>2</h6>
                </label>
                <label className="checkbox" htmlFor="advPlayers3checkbox">
                  <input
                    type="checkbox"
                    id="advPlayers3checkbox"
                    name="advPlayersNumber"
                    value="3"
                    onClick={(ev) => updatePlayerState(ev)}
                  />
                  <h6>3</h6>
                </label>
                <label className="checkbox" htmlFor="advPlayers4checkbox">
                  <input
                    type="checkbox"
                    id="advPlayers4checkbox"
                    name="advPlayersNumber"
                    value="4"
                    onClick={(ev) => updatePlayerState(ev)}
                  />
                  <h6>4</h6>
                </label>
                <label className="checkbox" htmlFor="advPlayers5checkbox">
                  <input
                    type="checkbox"
                    id="advPlayers4checkbox"
                    name="advPlayersNumber"
                    value="5"
                    onClick={(ev) => updatePlayerState(ev)}
                  />
                  <h6>5+</h6>
                </label>
              </div>
              <button
                className="searchButton"
                type="submit"
                onClick={(ev) => handleSubmit(ev)}
              >
                <h5>Apply</h5>
              </button>
              {link === 'findPlayers' && <p>{filtered.length} results</p>}
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
export default AdvancedSearch;
