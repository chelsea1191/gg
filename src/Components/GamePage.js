import React from 'react';

const GamePage = ({ currentGame }) => {
  return (
    <div className="gamePage">
      <img src={currentGame.image_url} className="gameImage"></img>
      <h4>{currentGame.name}</h4>
      <h6>
        <i>
          {currentGame.min_players} - {currentGame.max_players} Players
        </i>
      </h6>
      <button>
        <h5>
          <b>Favorite</b>
        </h5>
      </button>
    </div>
  );
};

export default GamePage;
