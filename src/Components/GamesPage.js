import React from 'react';

const GamesPage = () => {
  return (
    <div id="gamesPage">
      <form id="searchGamesForm">
        <h3>Games</h3>
        <input type="text" placeholder="Find a Game" />
        <h6>
          <a href="">Advanced Search</a>
        </h6>
      </form>
      <ul id="gamesList">
        <li className="gamesListItem">
          <img className="gameListItemImage" />
          <h5>TITLE</h5>
          <h6>300 Players</h6>
          <button>Add</button>
        </li>
        <li className="gamesListItem">
          <img className="gameListItemImage" />
          <h5>TITLE</h5>
          <h6>350 Players</h6>
          <button>Add</button>
        </li>
      </ul>
    </div>
  );
};

export default GamesPage;
