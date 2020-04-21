import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
const geolib = require('geolib');
import SearchDropdown from './SearchDropdown';
import AdvancedSearch from './AdvancedSearch';
import UserProfile from './UserProfile';
import axios from 'axios';

const FindPlayers = ({
  allGames,
  users,
  user,
  setUser,
  auth,
  setUserView,
  setGameView,
  chat,
  setChat,
  favoriteGames,
}) => {
  // REQUIRED VARIABLES: USERS, GAMES...
  // WHEN TEXT INPUT OR FAVORITE SELECTOR/ADVANCED SEARCH IS CHANGED,
  // SEARCH MUST BE ALTERED TO FORMAT FOR SEARCH PARAMETERS
  // ON FORM SUBMIT, RETURNS LIST OF ALL USERS THAT MATCH SEARCH
  const greentext = { color: 'rgb(0, 200, 0)' };
  const link = 'findPlayers';
  const [distance, setDistance] = useState();
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const authLocation = { latitude: auth.latitude, longitude: auth.longitude };

  useEffect(() => {
    const results = JSON.parse(window.localStorage.getItem('results'));
    if (results) {
      setResults(results);
    }
  }, []);

  const findDistance = (player) => {
    return (
      geolib.getDistance(authLocation, {
        latitude: player.latitude,
        longitude: player.longitude,
      }) / 1609.344
    ).toFixed(0);
  };

  const handleChatClick = async (user) => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      })
    );
    const response = await axios.get(`/api/chat/${user.id}/${auth.id}`);
    if (!response.data) {
      axios.post('/api/createchat', [auth.id, user.id]).then((response) => {
        window.localStorage.setItem('chat', JSON.stringify(response.data));
      });
    } else {
      window.localStorage.setItem('chat', JSON.stringify(response.data));
    }
  };

  const handleDistance = (e) => {
    e.preventDefault();
    //console.log(e.target.value);
    if (e.target.value === 'any') {
      setDistance(Number.MAX_VALUE);
    } else {
      setDistance(e.target.value * 1);
    }
  };

  const handleSelectFavorite = (e) => {
    const selection = allGames.filter((each) => {
      if (each.id === e.target.value) {
        return each;
      }
    });
    setFiltered(selection);
  };

  const searchForUsers = (e) => {
    e.preventDefault();
    console.log(filtered);
    let arrayOfFilteredFavGames = [];
    let arrayOfFavUserIds = [];
    let arrayOfUniqueFavUserIds = [];
    filtered.forEach((filteredGame) => {
      favoriteGames.forEach((favGame) => {
        if (filteredGame.id === favGame.gameId) {
          arrayOfFilteredFavGames.push(favGame);
        }
      });
    });
    arrayOfFilteredFavGames.forEach((filteredFavGame) => {
      arrayOfFavUserIds.push(filteredFavGame.userId);
    });
    arrayOfUniqueFavUserIds = arrayOfFavUserIds.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    const otherUsers = arrayOfUniqueFavUserIds.filter(
      (userId) => userId !== auth.id
    );
    const arrayOfOtherUserObjs = [];
    users.forEach((user) => {
      otherUsers.forEach((otherUser) => {
        if (otherUser === user.id) {
          arrayOfOtherUserObjs.push(user);
        }
      });
    });
    arrayOfOtherUserObjs.forEach((otherUser) => {
      otherUser.distanceFromAuth = findDistance(otherUser) * 1;
    });
    const userResults = arrayOfOtherUserObjs.filter(
      (u) => u.distanceFromAuth < distance
    );
    console.log('users after filtering for selected distance is', userResults);
    setResults(userResults);
    window.localStorage.setItem('results', JSON.stringify(userResults));
  };
  //console.log(auth);

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
          {filtered.length === 1 && <p>game selected: {filtered[0].name}</p>}
          <div>
            <AdvancedSearch
              link={link}
              filtered={filtered}
              allGames={allGames}
              setFiltered={setFiltered}
            />
          </div>
          <h6>-- or --</h6>
          <select
            className='select'
            id='fav-game-options'
            name='Favorited Game'
            onChange={(e) => handleSelectFavorite(e)}>
            <option value='default'>Pick a Favorite Game</option>
            {favoriteGames.map((eachFavGame) => {
              if (eachFavGame.userId === auth.id) {
                return (
                  <option key={eachFavGame.id} value={eachFavGame.gameId}>
                    {allGames.map((each) => {
                      if (each.id === eachFavGame.gameId) {
                        return each.name;
                      }
                    })}
                  </option>
                );
              }
            })}
          </select>
          <select
            className='select'
            id='distance-options'
            name='Distance'
            onChange={(e) => {
              handleDistance(e);
            }}>
            <option value='default'>Select a Distance</option>
            <option value='any'>Any</option>
            <option value='5'>5 miles</option>
            <option value='10'>10 miles</option>
            <option value='25'>25 miles</option>
            <option value='50'>50 miles</option>
            <option value='100'>100 miles</option>
          </select>
          <button className='searchButton' onClick={(e) => searchForUsers(e)}>
            <h5>Search</h5>
            {/* Can we/should we gray out/inactivate this button if no search parameters were selected?*/}
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
          {results.length === 0 && (
            <p>no results found- please widen your search area</p>
          )}
          {results.map((user) => {
            if (user.id !== auth.id) {
              //console.log(user);
              return (
                <li key={user.id} className='userResults'>
                  <h4>
                    {user.username} - {user.distanceFromAuth} miles away
                  </h4>
                  <span>
                    {' '}
                    <Link
                      to='/chat'
                      onClick={() => {
                        setUser(user);
                        handleChatClick(user);
                      }}>
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
