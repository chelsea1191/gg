import React from 'react';
import Rating from './Rating';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const GamePage = ({ game, favoriteGames, auth, setFavoriteGames }) => {
  let rating = game.average_user_rating;

  const greentext = { color: 'rgb(0, 200, 0)' };

  const notifySuccess = () => {
    toast.success('Success! Added to Favorites', {
      className: 'createUserToastSuccess',
      position: 'bottom-center',
      //hideProgressBar: false,
    });
  };
  const notifyFailure = () => {
    toast.success('Error- this game was already in your Favorites', {
      className: 'createUserToastFailure',
      position: 'bottom-center',
      //hideProgressBar: false,
    });
  };

  const addFavorite = async () => {
    const favoriteGamesCopy = [...favoriteGames];
    if (favoriteGames.length > 0) {
      await Axios.post('/api/favoritegames', {
        userId: auth.id,
        gameId: game.id,
      })
        .then((res) => {
          notifySuccess();
          setFavoriteGames([...favoriteGamesCopy, res.data]);
        })
        .catch((err) => notifyFailure());
    }

    // const newFavoriteGame = await Axios.post('/api/favoritegames', {
    //   userId: auth.id,
    //   gameId: game.id,
    // }).data;
    // setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
  };

  return (
    <div id="gamePage">
      <img className="gameImage" src={game.image_url} />
      <h4>
        <b>{game.name}</b>
      </h4>
      <hr className="hr" />
      <Rating rating={rating} />
      <br />
      <h6 className="gameInfo">
        <i>
          <b>Players: </b>
          {game.min_players} - {game.max_players}
        </i>
        <br />
        <i>
          {' '}
          <b>Ages: </b> {game.min_age} +
        </i>{' '}
        <br />
        <i>
          <b>Playtime: </b>
          {game.min_playtime} - {game.max_playtime}
        </i>
        <br />
        <i>
          <b>Publisher: </b>
          {game.primary_publisher}
        </i>
        <br />
        <i>
          <b>Released: </b>
          {game.year_published}
        </i>
      </h6>

      <button type="button" className="favoriteButton" onClick={addFavorite}>
        <h5>Favorite</h5>
      </button>
      <ToastContainer closeButton={false} />
      <hr className="hr" />
      <h6 className="gameBio">
        <i>{game.description}</i>
      </h6>
      <h6>
        <a href={game.url} target="_blank">
          <b style={greentext}>Learn More</b>
        </a>
      </h6>
    </div>
  );
};

export default GamePage;
