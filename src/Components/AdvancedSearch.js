import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AdvancedSearch = ({ allGames }) => {
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
              <label className='checkbox' htmlFor='advPlayers1checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers1checkbox'
                  name='advPlayersNumber'
                  value='1'
                />
                <h6>1</h6>
              </label>
              <label className='checkbox' htmlFor='advPlayers2checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers2checkbox'
                  name='advPlayersNumber'
                  value='2'
                />
                <h6>2</h6>
              </label>

              <label className='checkbox' htmlFor='advPlayers3checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers3checkbox'
                  name='advPlayersNumber'
                  value='3'
                />
                <h6>3</h6>
              </label>
              <label className='checkbox' htmlFor='advPlayers4checkbox'>
                <input
                  type='checkbox'
                  id='advPlayers4checkbox'
                  name='advPlayersNumber'
                  value='4'
                />
                <h6>4+</h6>
              </label>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    // <Accordion>
    //   <Card>
    //     <Card.Header>
    //       <Accordion.Toggle as={Button} variant='link' eventKey='0'>
    //         Advanced Search
    //       </Accordion.Toggle>
    //     </Card.Header>
    //     <Accordion.Collapse eventKey='0'>
    //       <Card.Body>search params here</Card.Body>
    //     </Accordion.Collapse>
    //   </Card>
    // </Accordion>
  );
};
export default AdvancedSearch;
