import React from 'react';

const GamesPage = () => {
  return (
    <div id="gamesPage">
      <form id="searchGamesForm">
        <h3>Games</h3>
        <input type="text" placeholder="Search for a Game" />
        {/*
          INPUT NEEDS AUTO-SUGGEST/COMPLETE DROPDOWN OPTIONS BASED ON ALL GAME NAMES THAT MATCH FIELD INPUT
          AS USER TYPES, LIST OF GAMES NARROWS BASED ON MATCHING TITLE
          WHEN DROPDOWN OPTION IS CLICKED, LINKS TO GAME PAGE
          IF NO INPUT, LIST IS TOP GAMES BY POPULARITY
          */}
        <h6>
          <a href="">Advanced Search</a>
        </h6>
        {/*
          ADVANCED SEARCH FORM DISPLAYS WHEN PROMPT IS CLICKED
          FORM CONTAINS VARIOUS SELECTORS, CHECKBOXES, RADIOS, ETC TO ALLOW THE USER TO ADJUST SEARCH PARAMETERS BASED ON GAME TYPE, GENRE, PLAYER NUMBERS, ETC
          */}
        <button className="searchButton">
          <h5>Search</h5>
        </button>
      </form>
      <ul id="gamesList">
        {/*
          LIST OF GAMES THAT MATCH SEARCH PARAMETERS
           INCLUDES COVER IMAGE, TITLE, NUMBER OF USERS, FRIENDS THAT PLAY, AVERAGE RATING, AND 'ADD FAVORITE GAME' BUTTON
           LIST ITEMS LINK TO GAME PAGES
          */}
      </ul>
      <h6>Is your favorite game unsupported?</h6>
      <h6>
        <a href="">Contact Us!</a>
      </h6>
    </div>
  );
};

export default GamesPage;
