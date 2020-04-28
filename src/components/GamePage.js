import React from 'react';
import Rating from './Rating';
import Axios from 'axios';

const GamePage = ({ game, favoriteGames, auth, setFavoriteGames }) => {
  console.log('path: ', window.location.pathname);

  let rating = game.average_user_rating;

  const addFavorite = async () => {
    const favoriteGamesCopy = [...favoriteGames];
    await Axios.post('/api/favoritegames', {
      userId: auth.id,
      gameId: game.id,
    })
      .then((res) => {
        console.log(res);
        setFavoriteGames([...favoriteGamesCopy, res.data]);
        console.log('favorited!');
        alert('favorited! :)');
      })
      .catch((err) => alert('you have already favorited this game!'));
    // const newFavoriteGame = await Axios.post('/api/favoritegames', {
    //   userId: auth.id,
    //   gameId: game.id,
    // }).data;
    // setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
  };

  return (
    <div id='gamePage'>
      <img className='gameImage' src={game.image_url} />
      <h4>
        <b>{game.name}</b>
      </h4>
      <hr className='hr' />
      <h6>
        <Rating rating={rating} />
        <span>average rating: {rating}</span> <br />
        <i>
          {game.min_players} - {game.max_players} Players
        </i>
        <br />
        <i> ages {game.min_age} +</i> <br />
        <i>
          {game.min_playtime} - {game.max_playtime} minutes playtime
        </i>
        <br />
        <i>
          Published by: {game.primary_publisher} in {game.year_published}
        </i>
      </h6>

      <button type='button' onClick={addFavorite}>
        <h5>Favorite</h5>
      </button>
      <hr className='hr' />
      <h6>
        <i>{game.description}</i>
      </h6>
      <h6>
        Learn more about this game
        <a href={game.url} target='_blank'>
          {' '}
          here
        </a>
      </h6>
    </div>
  );
};

export default GamePage;
