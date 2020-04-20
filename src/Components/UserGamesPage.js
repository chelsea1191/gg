import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const UserGamesPage = ({ user, allGames, favoriteGames }) => {
  const userFavorites = favoriteGames.filter((game) => {
    if (game) {
      return game.userId === user.id;
    }
  });
  const userFavoritesList = userFavorites.map((favorite) => {
    const userFavorite = allGames.find((game) => game.id === favorite.gameId);
    const addFavorite = async () => {
      const favoriteGamesCopy = [...favoriteGames];
      const newFavoriteGame = await Axios.post('/api/favoritegames', {
        userId: auth.id,
        gameId: userFavorite.id,
      }).data;

      setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
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
          Favorite
        </button>
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
