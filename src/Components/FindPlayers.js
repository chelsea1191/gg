import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
const geolib = require('geolib');
import SearchDropdown from './SearchDropdown';
import AdvancedSearch from './AdvancedSearch';
import UserProfile from './UserProfile';

const FindPlayers = ({
  allGames,
  users,
  user,
  setUser,
  auth,
  setUserView,
  setGameView,
}) => {
  // REQUIRED VARIABLES: USERS, GAMES...
  // WHEN TEXT INPUT OR FAVORITE SELECTOR/ADVANCED SEARCH IS CHANGED,
  // SEARCH MUST BE ALTERED TO FORMAT FOR SEARCH PARAMETERS
  // ON FORM SUBMIT, RETURNS LIST OF ALL USERS THAT MATCH SEARCH
  const greentext = { color: 'rgb(0, 200, 0)' };

  const [filtered, setFiltered] = useState([]);
  const authLocation = { latitude: auth.latitude, longitude: auth.longitude };

  const findDistance = (player) => {
    return (
      geolib.getDistance(authLocation, {
        latitude: player.latitude,
        longitude: player.longitude,
      }) / 1609.344
    ).toFixed(0);
  };

  if (auth.id) {
    return (
      <div className='findPlayersPage'>
        <form id='findPlayersForm'>
          <h3>Find Players</h3>

          <hr className='hr' />

          <h5>
            <b>What do you want to play?</b>
          </h5>
          <div>
            <SearchDropdown allGames={allGames} setFiltered={setFiltered} />
          </div>
          {filtered.length > 0 && <p>game selected: {filtered[0].name}</p>}
          <div>
            <AdvancedSearch allGames={allGames} />
          </div>

          {/*
          INPUT NEEDS AUTO-SUGGEST/COMPLETE DROPDOWN OPTIONS BASED ON ALL GAME NAMES THAT MATCH FIELD INPUT;
          */}
          <h6>-- or --</h6>
          <select>
            <option>Pick a Favorite Game</option>
            {/*
          LIST OF OPTIONS BASED ON TITLES OF USER'S FAVORITE GAMES
          */}
          </select>
          <select className='select' id='distance-options' name='Distance'>
            <option>Search Distance</option>
            <option>5 miles</option>
            <option>10 miles</option>
            <option>25 miles</option>
            <option>50 miles</option>
            <option>100 miles</option>
            {/*
          LIST OF OPTIONS FOR VARYING DISTANCES
          */}
          </select>

          <button className='searchButton'>
            <h5>Search</h5>
          </button>
        </form>
        {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}

        <ul id='playersList'>
          {/*
          LIST OF PLAYERS THAT MATCH SEARCH PARAMETERS.
          INCLUDES PROFILE IMAGE, USERNAME, DISTANCE FROM USER, MUTUAL FRIENDS/GAMES, AND 'ADD FRIEND' BUTTON
          LIST ITEMS LINK TO USER PROFILES
          */}

          {users.map((user) => {
            if (user.id !== auth.id) {
              //console.log(user);
              return (
                <li key={user.id} className='userResults'>
                  <h4>
                    {user.username} - {findDistance(user)} miles away
                  </h4>
                  <span>
                    {' '}
                    <Link to='/chat' onClick={() => setUser(user)}>
                      Send a Chat
                    </Link>
                    {' - '}
                    <Link
                      to={`/users/${user.id}`}
                      onClick={(ev) => setUserView(user)}>
                      View Profile
                    </Link>
                  </span>
                </li>
              );
            }
          })}
          {/*
          {users.map((mapUser) => {
            if (mapUser.id != auth.id) {
              return (
                <li key={mapUser.id}>
                  <Link to="/chat" onClick={() => setUser(mapUser)}>
                    {mapUser.firstname + mapUser.lastname}
                  </Link>
                  is {findDistance(mapUser)} miles away
                </li>
              );
            }
          })} */}
        </ul>
        {/* <ul id='gameList'>
          {filtered.length > 0 &&
            filtered.map((game) => {
              return (
                <li key={game.id} className='gamesListItem'>
                  <Link
                    to={`/games/${game.id}`}
                    onClick={(ev) => setGameView(game)}>
                    <img className='gameListItemImage' src={game.image_url} />

                    <h5>{game.name}</h5>
                  </Link>
                </li>
              );
            })}
        </ul> */}
      </div>
    );
  } else {
    return (
      <div id='guestRestricted'>
        <h3>Not a Member?</h3> <hr className='hr' />
        <p>
          <b style={greentext}>gg</b> works best with lots of active users.
        </p>
        <p>
          {' '}
          <Link className='link' to='/register'>
            Create a Profile{' '}
          </Link>
          and start finding people to play with!{' '}
        </p>
      </div>
    );
  }
};

export default FindPlayers;
