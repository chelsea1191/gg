const pg = require('pg');
const uuid = require('uuid/v4');
const client = require('./client');
const faker = require('faker');
const axios = require('axios');
require('dotenv').config();
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

const client_id = process.env.CLIENT_ID;

const allDataFromAPI = axios
  .get(`https://www.boardgameatlas.com/api/search?client_id=${client_id}`)
  .then((response) => {
    return response.data.games;
  })
  .catch((error) => {
    if (error.response) {
      console.log('error.response.data: ', error.response.data);
      console.log('error.response.status: ', error.response.status);
      console.log('error.response.headers: ', error.response.headers);
    } else if (error.request) {
      console.log('error.request: ', error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log('error.config: ', error.config);
  });

const ipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada, lacus at blandit rutrum, enim sapien pulvinar quam, vel euismod neque lectus eu ante. Ut vel congue justo, eget pharetra orci. Proin sagittis tortor elementum nunc tristique mattis.';

const sync = async () => {
  // if (process.env.NODE_ENV == 'production') {
  //   //**********************************  PRODUCTION ******************************* */
  //   console.log('environment is: ', process.env.NODE_ENV);
  //   const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  // CREATE TABLE IF NOT EXISTS users (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   username VARCHAR(100) NOT NULL UNIQUE,
  //   firstname VARCHAR(100) NOT NULL,
  //   lastname VARCHAR(100) NOT NULL,
  //   password VARCHAR(100) NOT NULL,
  //   role VARCHAR(20) DEFAULT 'player',
  //   email VARCHAR(100) NOT NULL UNIQUE,
  //   "isBlocked" BOOLEAN DEFAULT false,
  //   "isOnline" BOOLEAN DEFAULT false,
  //   CHECK (char_length(username) > 0),
  //   photo VARCHAR,
  //   bio VARCHAR(300),
  //   latitude VARCHAR,
  //   longitude VARCHAR,
  //   "gameTypes" TEXT [],
  //   date_created TIMESTAMP default CURRENT_TIMESTAMP,
  //   avatar VARCHAR
  // );
  // CREATE TABLE IF NOT EXISTS game_type (
  //   id SERIAL PRIMARY KEY,
  //   gametype VARCHAR
  // );
  // CREATE TABLE IF NOT EXISTS game (
  //   id VARCHAR PRIMARY KEY UNIQUE,
  //   name VARCHAR,
  //   "gameTypeID" INT,
  //   description VARCHAR,
  //   image_url VARCHAR,
  //   min_players INT,
  //   max_players INT,
  //   url VARCHAR,
  //   primary_publisher VARCHAR,
  //   min_age INT,
  //   year_published INT,
  //   min_playtime INT,
  //   max_playtime INT,
  //   average_user_rating DECIMAL
  // );
  // CREATE TABLE IF NOT EXISTS favoritegames (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   "userId" UUID REFERENCES users(id),
  //   "gameId" VARCHAR REFERENCES game(id),
  //   UNIQUE ("userId", "gameId")
  // );
  // CREATE TABLE IF NOT EXISTS friendships (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   "userId" UUID REFERENCES users(id),
  //   "friendId" UUID REFERENCES users(id),
  //   "sendStatus" VARCHAR NOT NULL,
  //   UNIQUE ("userId", "friendId")
  // );
  // CREATE TABLE IF NOT EXISTS user_group (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   "userId" UUID REFERENCES users(id) NOT NULL,
  //   "gameTypeID" INT REFERENCES game_type(id) NOT NULL
  // );
  // CREATE TABLE IF NOT EXISTS chat (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   creator_id UUID REFERENCES users(id) NOT NULL,
  //   creator_username VARCHAR(100) REFERENCES users(username) NOT NULL,
  //   user_id UUID REFERENCES users(id) NOT NULL,
  //   user_username VARCHAR(100) REFERENCES users(id) NOT NULL,
  //   date_create TIMESTAMP default CURRENT_TIMESTAMP,
  //   render_creator_messages BOOLEAN DEFAULT true,
  //   render_user_messages BOOLEAN DEFAULT true,
  //   date_updated TIMESTAMP default CURRENT_TIMESTAMP
  // );

  // CREATE TABLE IF NOT EXISTS message (
  //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //   chat_id UUID REFERENCES chat(id) NOT NULL,
  //   sender_id UUID REFERENCES users(id) NOT NULL,
  //   message VARCHAR,
  //   date_updated TIMESTAMP default CURRENT_TIMESTAMP
  // );
  // `;
  //   await client.query(SQL);
  // } else {
  /**********************************  DEVELOPMENT *******************************/
  console.log('environment is: development');
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

  CREATE TABLE IF NOT EXISTS users (
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
    date_created TIMESTAMP default CURRENT_TIMESTAMP,
    avatar VARCHAR
  );
  CREATE TABLE IF NOT EXISTS game_type (
    id SERIAL PRIMARY KEY,
    gametype VARCHAR
  );
  CREATE TABLE IF NOT EXISTS game (
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
  CREATE TABLE IF NOT EXISTS favoritegames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "gameId" VARCHAR REFERENCES game(id),
    UNIQUE ("userId", "gameId")
  );
  CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "friendId" UUID REFERENCES users(id),
    "sendStatus" VARCHAR NOT NULL,
    UNIQUE ("userId", "friendId")
  );
  CREATE TABLE IF NOT EXISTS user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    "gameTypeID" INT REFERENCES game_type(id) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) NOT NULL,
    creator_username VARCHAR(100) REFERENCES users(username) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    user_username VARCHAR(100) REFERENCES users(username) NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP,
    render_creator_messages BOOLEAN DEFAULT true,
    render_user_messages BOOLEAN DEFAULT true,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chat(id) NOT NULL,
    sender_id UUID REFERENCES users(id) NOT NULL,
    message VARCHAR,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );
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
      bio: ipsum,
      latitude: '30.055760',
      longitude: '-81.500880',
      avatar: '/assets/avatar.png',
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
      avatar: '/assets/avatar.png',
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
      avatar: '/assets/avatar.png',
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
  //}
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
