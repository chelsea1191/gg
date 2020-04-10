import React from 'react';

const GamePage = ({ game }) => {
  return (
    <div id="gamePage">
      <img className="gameImage" src={game.image_url} />
      <h4>
        <b>{game.name}</b>
      </h4>
      <h6>
        <i>
          {game.min_players} - {game.max_players} Players
        </i>
      </h6>

      <button type="button">Add to Favorites</button>
      <h6>
        <i>{game.description}</i>
      </h6>
    </div>
  );
};

export default GamePage;
