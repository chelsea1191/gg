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
        <div id='dropdownDiv'>
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
      <p>displaying {filtered.length} games</p>
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
            return (
              <li key={game.id} className='gamesListItem'>
                <Link
                  to={`/games/${game.id}`}
                  onClick={(ev) => setGameView(game)}>
                  <img className='gameListItemImage' src={game.image_url} />{' '}
                </Link>
                <h5>{game.name}</h5>
                {auth && (
                  <div>
                    <button type='button' onClick={addFavorite}>
                      <h5>Favorite</h5>
                    </button>
                    <ToastContainer
                      closeButton={false}
                      enableMultiContainer
                      containerId={game.id}
                    />
                  </div>
                )}
                <hr className='hr' />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default GamesPage;
