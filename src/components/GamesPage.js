import React, { useState, useEffect, Fragment } from 'react';
import SearchDropdown from './SearchDropdown';
import AdvancedSearch from './AdvancedSearch';
import { ToastContainer, toast } from 'react-toastify';

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

  const notifySuccess = (id) => {
    toast.success('Success! Added to Favorites', {
      containerId: id,
      className: 'createUserToastSuccess',
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: false,
      autoClose: 1000,
    });
  };
  const notifyFailure = (id) => {
    toast.success('Error- this game was already in your Favorites', {
      containerId: id,
      className: 'createUserToastFailure',
      position: 'bottom-center',
      //hideProgressBar: false,
    });
  };

  useEffect(() => {
    let filteredItemIfPresent = JSON.parse(localStorage.getItem('filtered'));
    if (filteredItemIfPresent) {
      setFiltered(filteredItemIfPresent);
    }
  }, [setFiltered]);
  useEffect(() => {
    if (filtered.length === 0) {
      setFiltered(allGames);
    }
  });

  return (
    <div id='gamesPage'>
      <form id='searchGamesForm'>
        <h3>Games</h3>
        <hr className="hr"></hr>
        <div id="dropdownDiv">
          <SearchDropdown
            allGames={allGames}
            setFiltered={setFiltered}
            auth={auth}
            link={'allGames'}
          />
        </div>
        <br />
        <h6>
          <i>Can't find your favorite game? </i>
          <a
            href='mailto:support@gg-connect.com?Subject=Game%20Support'
            target='_top'
            style={greentext}>
            Let Us Know!
          </a>
        </h6>
      </form>
      <br />
      <h4>
        <b>Displaying {filtered.length} Games</b>
      </h4>
      <br />
      <ul id='gamesList'>
        {filtered.length > 0 &&
          filtered.map((game) => {
            const addFavorite = async () => {
              const favoriteGamesCopy = [...favoriteGames];
              await Axios.post('/api/favoritegames', {
                userId: auth.id,
                gameId: game.id,
              })
                .then((res) => {
                  notifySuccess(game.id);
                  setFavoriteGames([...favoriteGamesCopy, res.data]);
                })
                .catch((err) => notifyFailure(game.id));
            };
            const players = favoriteGames.filter(
              (favorite) => favorite.gameId === game.id
            );
          })}
      </ul>
    </div>
  );
};

export default GamesPage;
