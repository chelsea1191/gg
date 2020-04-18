import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AdvancedSearch = ({ allGames, setFiltered }) => {
  const [playerSelections, setPlayerSelections] = useState([]); //array of checkbox selections

  const handleSubmit = (ev) => {
    //lord have mercy with this searching function
    ev.preventDefault();
    //console.log('player Selections: ', playerSelections);
    const arrayOfGames = []; //array of games that includes duplicates
    const uniqueObj = new Set(playerSelections); //creates unique object
    const uniqueSet = [...uniqueObj]; //converts to array of unique selections
    //need to return all games where minimum is less than or equal to filterNum
    uniqueSet.map((filterNum) => {
      //map over selections
      allGames.map((game) => {
        //for each game, if the minimum is <= filterNum, push into array
        if (game.min_players <= filterNum && game.max_players >= filterNum) {
          arrayOfGames.push(game);
        }
      });
    });
    const uniqueArrayOfGames = new Set(arrayOfGames);
    const finalArrayOfGames = [...uniqueArrayOfGames];
    setFiltered(finalArrayOfGames);
  };

  const updatePlayerState = (ev) => {
    const indexOfNum = playerSelections.indexOf(ev.target.value);
    if (indexOfNum > -1) {
      const oldArray = playerSelections;
      oldArray.splice(indexOfNum, 1);
      setPlayerSelections(oldArray);
    } else {
      setPlayerSelections([...playerSelections, ev.target.value]);
    }
  };

  return (
    <Accordion id='advSearchForm'>
      <Card id='advSearchCard'>
        <Card.Header id='advSearchHeader'>
          <Accordion.Toggle as={Button} variant='link' eventKey='0'>
            Advanced Search
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>
            <div className='advGameType'>
              <h5>Game Type</h5>
              <label className='checkbox' htmlFor='advVideogamesCheckbox'>
                <input
                  type='checkbox'
                  id='advVideogamesCheckbox'
                  name='advGameTypes'
                  value='Video Games'
                />
                <h6>Video Games</h6>
              </label>
              <label className='checkbox' htmlFor='advBoardgamesCheckbox'>
                <input
                  type='checkbox'
                  id='advBoardgamesCheckbox'
                  name='advGameTypes'
                  value='Board Games'
                />
                <h6>Board Games</h6>
              </label>
              <label className='checkbox' htmlFor='advTabletopCheckbox'>
                <input
                  type='checkbox'
                  id='advTabletopCheckbox'
                  name='advGameTypes'
                  value='Tabletop Games & RPGs'
                />
                <h6>Tabletop Games & RPGs</h6>
              </label>
              <label className='checkbox' htmlFor='advSportsCheckbox'>
                <input
                  type='checkbox'
                  id='advSportsCheckbox'
                  name='advGameTypes'
                  value='Sport & Field Games'
                />
                <h6>Sport & Field Games</h6>
              </label>
            </div>
            <hr />
            <div className='advPlayesrNumber'>
              <h5>Players</h5>
              <label className='checkbox' htmlFor='advPlayers2checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers2checkbox'
                  name='advPlayersNumber'
                  value='2'
                  onClick={(ev) => updatePlayerState(ev)}
                />
                <h6>2</h6>
              </label>
              <label className='checkbox' htmlFor='advPlayers3checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers3checkbox'
                  name='advPlayersNumber'
                  value='3'
                  onClick={(ev) => updatePlayerState(ev)}
                />
                <h6>3</h6>
              </label>
              <label className='checkbox' htmlFor='advPlayers4checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers4checkbox'
                  name='advPlayersNumber'
                  value='4'
                  onClick={(ev) => updatePlayerState(ev)}
                />
                <h6>4+</h6>
              </label>
              <button
                className='searchButton'
                type='submit'
                onClick={(ev) => handleSubmit(ev)}>
                <h5>Search</h5>
              </button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
export default AdvancedSearch;
