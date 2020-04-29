import React from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const UserGamesPage = ({
  user,
  allGames,
  favoriteGames,
  setFavoriteGames,
  auth,
  setGameView,
}) => {
  const notifySuccess = (id) => {
    toast.success('Success! Added to Favorites', {
      containerId: id,
      className: 'createUserToastSuccess',
      position: 'bottom-center',
    });
  };
  const notifyFailure = (id) => {
    toast.success('Error- this game was already in your Favorites', {
      containerId: id,
      className: 'createUserToastFailure',
      position: 'bottom-center',
    });
  };
  const userFavorites = favoriteGames.filter((game) => {
    if (game) {
      return game.userId === user.id;
    }
  });
  const userFavoritesList = userFavorites.map((favorite) => {
    const userFavorite = allGames.find((game) => game.id === favorite.gameId);
    const addFavorite = async () => {
      const favoriteGamesCopy = [...favoriteGames];
      await Axios.post('/api/favoritegames', {
        userId: auth.id,
        gameId: userFavorite.id,
      })
        .then((res) => {
          notifySuccess(userFavorite.id);
          setFavoriteGames([...favoriteGamesCopy, res.data]);
        })
        .catch((err) => notifyFailure(userFavorite.id));
    };
    return (
      <li key={userFavorite.id} className='gamesListItem'>
        <Link
          to={`/games/${userFavorite.id}`}
          onClick={(ev) => setGameView(userFavorite)}>
          <img className='gameListItemImage' src={userFavorite.image_url} />{' '}
        </Link>
        <h5>{userFavorite.name}</h5>

        <button type='button' onClick={addFavorite}>
          <h5>Favorite</h5>
        </button>
        <ToastContainer
          closeButton={false}
          enableMultiContainer
          containerId={userFavorite.id}
        />
        <hr className='hr' />
      </li>
    );
  });

  return (
    <div id='userGamesPage'>
      <h3>{user.username}'s Favorite Games</h3>
      {userFavoritesList}
    </div>
  );
};

export default UserGamesPage;
