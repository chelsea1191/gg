import React, { useState, useEffect, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
const geolib = require('geolib')
import SearchDropdown from './SearchDropdown'
import AdvancedSearch from './AdvancedSearch'
import UserProfile from './UserProfile'
import axios from 'axios'

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
  //favoriteGames,
}) => {
  // REQUIRED VARIABLES: USERS, GAMES...
  // WHEN TEXT INPUT OR FAVORITE SELECTOR/ADVANCED SEARCH IS CHANGED,
  // SEARCH MUST BE ALTERED TO FORMAT FOR SEARCH PARAMETERS
  // ON FORM SUBMIT, RETURNS LIST OF ALL USERS THAT MATCH SEARCH
  const greentext = { color: 'rgb(0, 200, 0)' }
  const link = 'findPlayers'
  const [distance, setDistance] = useState()
  const [results, setResults] = useState([])
  const [filtered, setFiltered] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [favoriteGames, setFavoriteGames] = useState([])

  const authLocation = { latitude: auth.latitude, longitude: auth.longitude }

  useEffect(() => {
    const results = JSON.parse(window.localStorage.getItem('results'))
    if (results) {
      setResults(results)
    }
  }, [])
  useEffect(() => {
    axios.get('/api/favoritegames').then((response) => {
      setFavoriteGames(response.data)
    })
  }, [])

  const findDistance = (player) => {
    return (
      geolib.getDistance(authLocation, {
        latitude: player.latitude,
        longitude: player.longitude,
      }) / 1609.344
    ).toFixed(0)
  }

  const handleChatClick = async (user) => {}

  const handleDistance = (e) => {
    e.preventDefault()
    setIsSubmitted(false)
    //console.log(e.target.value);
    if (e.target.value === 'any') {
      setDistance(Number.MAX_VALUE)
    } else {
      setDistance(e.target.value * 1)
    }
  }

  const handleSelectFavorite = (e) => {
    setIsSubmitted(false)
    const selection = allGames.filter((each) => {
      if (each.id === e.target.value) {
        return each
      }
    })
    setFiltered(selection)
  }

  const searchForUsers = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    let arrayOfFilteredFavGames = []
    let arrayOfFavUserIds = []
    let arrayOfUniqueFavUserIds = []
    filtered.forEach((filteredGame) => {
      favoriteGames.forEach((favGame) => {
        if (filteredGame.id === favGame.gameId) {
          arrayOfFilteredFavGames.push(favGame)
        }
      })
    })
    arrayOfFilteredFavGames.forEach((filteredFavGame) => {
      arrayOfFavUserIds.push(filteredFavGame.userId)
    })
    arrayOfUniqueFavUserIds = arrayOfFavUserIds.filter(
      (v, i, a) => a.indexOf(v) === i
    )
    const otherUsers = arrayOfUniqueFavUserIds.filter(
      (userId) => userId !== auth.id
    )
    const arrayOfOtherUserObjs = []
    users.forEach((user) => {
      otherUsers.forEach((otherUser) => {
        if (otherUser === user.id) {
          arrayOfOtherUserObjs.push(user)
        }
      })
    })
    arrayOfOtherUserObjs.forEach((otherUser) => {
      otherUser.distanceFromAuth = findDistance(otherUser) * 1
    })
    const userResults = arrayOfOtherUserObjs.filter(
      (u) => u.distanceFromAuth < distance
    )
    setResults(userResults)
    window.localStorage.setItem('results', JSON.stringify(userResults))
  }
  //console.log(auth);

  if (auth.id) {
    return (
      <div className="findPlayersPage">
        <form id="findPlayersForm">
          <h3>Find Players</h3>
          <hr className="hr" />
          <h5>
            <b>What do you want to play?</b>
          </h5>
          <div id="dropdownDiv">
            <SearchDropdown allGames={allGames} setFiltered={setFiltered} />
          </div>
          {filtered.length === 1 && (
            <p>
              <i>Selected: {filtered[0].name}</i>
            </p>
          )}
          <div>
            <AdvancedSearch
              link={link}
              filtered={filtered}
              allGames={allGames}
              setFiltered={setFiltered}
            />
          </div>
          {favoriteGames.length > 0 && <h6>-- or --</h6>}
          <select
            className="select"
            id="fav-game-options"
            name="Favorited Game"
            onChange={(e) => handleSelectFavorite(e)}
          >
            <option value="default">Pick a Favorite Game</option>
            {/* the below function is slower than the page loading.... so it creates an error sometimes that reads Cannot read property 'userId' of undefined*/}
            {favoriteGames.map((eachFavGame) => {
              if (eachFavGame.userId === auth.id) {
                return (
                  <option key={eachFavGame.id} value={eachFavGame.gameId}>
                    {allGames.map((each) => {
                      if (each.id === eachFavGame.gameId) {
                        return each.name
                      }
                    })}
                  </option>
                )
              }
            })}
          </select>
          <hr className="hr" />
          <select
            className="select"
            id="distance-options"
            name="Distance"
            onChange={(e) => {
              handleDistance(e)
            }}
          >
            <option value="default">Select a Distance</option>
            <option value="any">Any</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
          <button className="searchButton" onClick={(e) => searchForUsers(e)}>
            <h5>Search</h5>
            {/* Can we/should we gray out/inactivate this button if no search parameters were selected?*/}
          </button>
        </form>

        <div id="resultsHeader">
          {isSubmitted === true && results.length === 1 && (
            <h4>
              <b>{results.length} Player in the Area</b>
            </h4>
          )}

          {isSubmitted === true && results.length > 1 && (
            <h4>
              <b>{results.length} Players in the Area</b>
            </h4>
          )}
        </div>
        {isSubmitted === true && (
          <ul id="playersList">
            {isSubmitted === true && results.length === 0 && (
              <p>no results found- please widen your search area</p>
            )}
            {isSubmitted === true &&
              results.map((user) => {
                if (user.id !== auth.id) {
                  //console.log(user);
                  return (
                    <li key={user.id} className="userResults">
                      <img src={`${user.avatar}`} className="userListImage" />
                      <div className="userListInfo">
                        <h5>
                          <b>{user.username}</b>{' '}
                          {user.isOnline ? (
                            <span class="dot-green"></span>
                          ) : (
                            <span class="dot-red"></span>
                          )}
                        </h5>
                        <h6>
                          <i>{user.distanceFromAuth} miles away</i>
                        </h6>

                        <span>
                          {' '}
                          <Link
                            to={`/chat/${user.id}`}
                            onClick={() => {
                              setUser(user)
                              handleChatClick(user)
                            }}
                          >
                            <b style={greentext}>Send Chat</b>
                          </Link>
                          <br />
                          <Link
                            to={`/users/${user.id}`}
                            onClick={(ev) => setUserView(user)}
                          >
                            <b style={greentext}>View Profile</b>
                          </Link>
                        </span>
                      </div>
                    </li>
                  )
                }
              })}
          </ul>
        )}
      </div>
    )
  } else {
    return <div id="guestRestricted">waiting</div>
  }
}

export default FindPlayers
