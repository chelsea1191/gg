import React from 'react';

const GamePage = ({ game }) => {
  return (
    <div id='gamePage'>
      <img className='gameImage' src={game.image_url} />
      <h4>{game.name}</h4>
      <h6># Players MAX: {game.max_players}</h6>
      <h6># Players MIN: {game.min_players}</h6>
      <br />
      <h6>Description {game.description}</h6>
      <button type='button'>Add to Favorites</button>
    </div>
  );
};

export default GamePage;
