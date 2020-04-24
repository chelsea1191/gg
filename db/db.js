const pg = require('pg');
const uuid = require('uuid/v4');
const client = require('./client');
const faker = require('faker');
const axios = require('axios');
const {
  authenticate,
  compare,
  findUserFromToken,
  hash,
  markOnline,
} = require('./auth');
const models = ({
  users,
  games,
  gameTypes,
  favoriteGames,
  friendships,
  hardcodedGames,
} = require('./models'));
const {
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getChats,
  getUsers,
  getUser,
  createMessage,
  getMessage,
  putMessage,
} = require('./userMethods');
const client_id = 'u7xbcBEfgP';
//we can also use axios.all to get data from multiple endpoints
const allDataFromAPI = axios
  .get(`https://www.boardgameatlas.com/api/search?client_id=${client_id}`)
  .then((response) => {
    return response.data.games;
  })
  .catch((error) => {
    if (error.response) {
      // server responded with status code outside of 2xx
      console.log('error.response.data: ', error.response.data);
      console.log('error.response.status: ', error.response.status);
      console.log('error.response.headers: ', error.response.headers);
    } else if (error.request) {
      // no response received
      console.log('error.request: ', error.request);
    } else {
      // something happened in setting up the request and triggered an Error
      console.log('Error', error.message);
    }
    console.log('error.config: ', error.config);
  });

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS message;
  DROP TABLE IF EXISTS chat;
  DROP TABLE IF EXISTS favoritegames;
  DROP TABLE IF EXISTS friendships;
  DROP TABLE IF EXISTS user_game;
  DROP TABLE IF EXISTS user_group;
  DROP TABLE IF EXISTS game;
  DROP TABLE IF EXISTS game_type;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'player',
    email VARCHAR(100) NOT NULL UNIQUE,
    "isBlocked" BOOLEAN DEFAULT false,
    "isOnline" BOOLEAN DEFAULT false,
    CHECK (char_length(username) > 0),
    photo VARCHAR,
    bio VARCHAR(300),
    latitude VARCHAR,
    longitude VARCHAR,
    "gameTypes" TEXT [],
    date_created TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE game_type (
    id SERIAL PRIMARY KEY,
    gametype VARCHAR
  );
  CREATE TABLE game (
    id VARCHAR PRIMARY KEY UNIQUE,
    name VARCHAR,
    "gameTypeID" INT,
    description VARCHAR,
    image_url VARCHAR,
    min_players INT,
    max_players INT,
    url VARCHAR,
    primary_publisher VARCHAR,
    min_age INT,
    year_published INT,
    min_playtime INT,
    max_playtime INT,
    average_user_rating DECIMAL
  );
  CREATE TABLE favoritegames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "gameId" VARCHAR REFERENCES game(id)
  );
  CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "friendId" UUID REFERENCES users(id),
    status VARCHAR DEFAULT 'unsent'
  );
  CREATE TABLE user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    "gameTypeID" INT REFERENCES game_type(id) NOT NULL
  );
  CREATE TABLE chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP,
    render_creator_messages BOOLEAN DEFAULT true,
    render_user_messages BOOLEAN DEFAULT true,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chat(id) NOT NULL,
    sender_id UUID REFERENCES users(id) NOT NULL,
    message VARCHAR,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );
  INSERT INTO users (id, username, firstname, lastname, password, email, latitude, longitude) VALUES ('b8e0d399-cc1b-4c08-9ef3-2da124ac481b', 'marco', 'marco', 'polo', 'marco', 'marcopolo@gmail.com', '30.305340', '-81.594540');
  INSERT INTO game (id, name, min_players, max_players) VALUES ('1', 'TEST GAME', '1', '30');
  INSERT INTO favoritegames (id, "userId", "gameId") VALUES ('edb68390-fdd2-4b80-9921-398d2d554ad4', 'b8e0d399-cc1b-4c08-9ef3-2da124ac481b', '1');
  `;
  await client.query(SQL);

  await Promise.all(
    Object.values(hardcodedGames).map((each) => games.create(each))
  );

  const _games = await allDataFromAPI;
  await Promise.all(Object.values(_games).map((each) => games.create(each)));
  const _gameTypes = [
    { gametype: 'board' },
    { gametype: 'card' },
    { gametype: 'tabletop rpg' },
  ];
  await Promise.all(
    Object.values(_gameTypes).map((each) => gameTypes.create(each))
  );

  const _users = {
    admin: {
      username: 'admin',
      firstname: 'ad',
      lastname: 'min',
      password: 'admin',
      role: 'ADMIN',
      email: 'admin@gmail.com',
      bio: 'admin here',
      latitude: '30.055760',
      longitude: '-81.500880',
    },
    friend: {
      username: 'friend',
      firstname: 'fr',
      lastname: 'iend',
      password: 'friend',
      role: 'PLAYER',
      email: 'friend@gmail.com',
      bio: 'friend here',
      latitude: '30.280240',
      longitude: '-81.724630',
    },
    buddy: {
      username: 'buddy',
      firstname: 'bud',
      lastname: 'dy',
      password: 'buddy',
      role: 'PLAYER',
      email: 'buddy@gmail.com',
      bio: 'buddy here',
      latitude: '30.303406',
      longitude: '-81.469178',
    },
  };

  await Promise.all(Object.values(_users).map((user) => users.create(user)));

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});

  return {
    users: userMap,
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  markOnline,
  findUserFromToken,
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getChats,
  getUsers,
  getUser,
  createMessage,
  getMessage,
  putMessage,
};

// INSERT INTO game(id, name, "gameTypeID", description, image_url, min_players, max_players, url, primary_publisher, min_age, year_published, min_playtime, max_playtime, average_user_rating) VALUES ('2', 'Dungeons & Dragons (5th edition)', '3', 'Dungeons & Dragons (abbreviated as D&D or DnD) is a fantasy tabletop role-playing game (RPG) originally designed by Gary Gygax and Dave Arneson, and first published in 1974 by Tactical Studies Rules, Inc.. The game has been published by Wizards of the Coast (now a subsidiary of Hasbro) since 1997. It was derived from miniature wargames with a variation of the Chainmail game serving as the initial rule system. D&D‍‍s publication is widely regarded as the beginning of modern role-playing games and the role-playing game industry.', 'https://static0.srcdn.com/wordpress/wp-content/uploads/2019/09/Dungeons-and-Dragons-Alignments.jpg', '3', '5', 'https://dnd.wizards.com/', 'TSR, Inc., Wizards of the Coast', '8', '2014', '120', '600', '4.5');
