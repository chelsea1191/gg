const pg = require('pg');
const uuid = require('uuid/v4');
const client = require('./client');
const faker = require('faker');
const axios = require('axios');
const { authenticate, compare, findUserFromToken, hash } = require('./auth');
const models = ({
  users,
  games,
  gameTypes,
  favoritegames,
} = require('./models'));
const {
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getUsers,
  createMessage,
  getMessage,
  putMessage,
} = require('./userMethods');
const client_id = 'u7xbcBEfgP';

const allDataFromAPI = axios
  .get(`https://www.boardgameatlas.com/api/search?client_id=${client_id}`)
  .then((response) => {
    return response.data.games;
  });

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS message;
  DROP TABLE IF EXISTS chat;
  DROP TABLE IF EXISTS favoritegames;
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
    CHECK (char_length(username) > 0),
    photo VARCHAR,
    bio VARCHAR(300),
    location VARCHAR,
    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE game_type (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gametype VARCHAR
  );
  CREATE TABLE game (
    id VARCHAR PRIMARY KEY UNIQUE,
    name VARCHAR,
    "gameTypeID" INTEGER,
    description VARCHAR,
    image_url VARCHAR,
    min_players INT,
    max_players INT,
    url VARCHAR,
    primary_publisher VARCHAR,
    min_age INT,
    year_published INT,
    min_playtime INT,
    max_playtime INT
  );
  CREATE TABLE favoritegames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "gameId" VARCHAR REFERENCES game(id)
  );
  CREATE TABLE user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    "gameTypeID" UUID REFERENCES game_type(id) NOT NULL
  );

  CREATE TABLE chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );

  CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chat(id) NOT NULL,
    sender_id UUID REFERENCES users(id) NOT NULL,
    message VARCHAR,
    date_updated TIMESTAMP default CURRENT_TIMESTAMP
  );

  `;
  await client.query(SQL);

  const _games = await allDataFromAPI;
  const [foo, bar, baz] = await Promise.all(
    Object.values(_games).map((each) => games.create(each))
  );
  const _gameTypes = [
    { gametype: 'board' },
    { gametype: 'sport' },
    { gametype: 'video' },
  ];
  const [board, sport, video] = await Promise.all(
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
    },
    friend: {
      username: 'friend',
      firstname: 'fr',
      lastname: 'iend',
      password: 'friend',
      role: 'PLAYER',
      email: 'friend@gmail.com',
      bio: 'friend here',
    },
    buddy: {
      username: 'buddy',
      firstname: 'bud',
      lastname: 'dy',
      password: 'buddy',
      role: 'PLAYER',
      email: 'buddy@gmail.com',
      bio: 'buddy here',
    },
  };

  const [admin, friend] = await Promise.all(
    Object.values(_users).map((user) => users.create(user))
  );

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});

  return {
    users: userMap,
  };
};
//////////////////get///////////////////
// const readUsers = async () => {
//   const SQL = `SELECT * FROM users;`;
//   const response = await client.query(SQL);
//   return response.rows;
// };

//////////////////put///////////////////
// const updateUserThing = async ({ isFavorite, id }) => {
//   const SQL = `UPDATE user_things SET (isFavorite) = ($1) WHERE (id) = ($2) returning *`;
//   const response = await client.query(SQL, [isFavorite, id]);
//   return response.rows[0];
// };

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getUsers,
  createMessage,
  getMessage,
  putMessage,
};
