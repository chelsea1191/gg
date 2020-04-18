import React from 'react';
import Rating from './Rating';

const GamePage = ({ game }) => {
  console.log('path: ', window.location.pathname);

  let rating = game.average_user_rating;

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
        </i>{' '}
        <br />
        <i>
          Published by: {game.primary_publisher} in {game.year_published}
        </i>
      </h6>

      <button type='button'>Add to Favorites</button>
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
