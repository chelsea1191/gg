import React from 'react';

const FindPlayers = () => {
  // WHEN TEXT INPUT OR FAVORITE SELECTOR/ADVANCED SEARCH IS CHANGED,
  // SEARCH MUST BE ALTERED TO FORMAT FOR SEARCH PARAMETERS
  return (
    <div className="findPlayersPage">
      <form id="findPlayersForm">
        <h3>Find Players</h3>
        <input type="text" placeholder="Search for a Game" />
        {/*
          INPUT NEEDS AUTO-SUGGEST/COMPLETE DROPDOWN OPTIONS BASED ON ALL GAME NAMES THAT MATCH FIELD INPUT;
          */}
        <h6>or</h6>
        <select>
          <option>Pick one of your favorite games</option>
          {/*
          LIST OF OPTIONS BASED ON TITLES OF USER'S FAVORITE GAMES
          */}
        </select>
        <select>
          <option>Search Distance</option>
          {/*
          LIST OF OPTIONS FOR VARYING DISTANCES
          */}
        </select>
        <button className="searchButton">Search</button>{' '}
        <h6>
          <a href="">Advanced Search</a>
        </h6>
      </form>
      {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}

      <ul id="playersList">
        <h5>
          {/*
          NUMBER OF MATCHING PLAYERS
          */}# Players in Your
          Area!
        </h5>
        {/*
          LIST OF PLAYERS THAT MATCH SEARCH PARAMETERS.
          INCLUDES PROFILE IMAGE, USERNAME, DISTANCE FROM USER, MUTUAL FRIENDS/GAMES, AND 'ADD FRIEND' BUTTON
          LIST ITEMS LINK TO USER PROFILES
          */}
      </ul>
    </div>
  );
};

export default FindPlayers;
