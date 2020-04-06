const pg = require('pg');
const uuid = require('uuid/v4');
const client = require('./client');
const faker = require('faker');
const axios = require('axios');
const { authenticate, compare, findUserFromToken, hash } = require('./auth');
const models = ({ users, games } = require('./models'));
const { getAllGames } = require('./userMethods');
const client_id = '8fCeoX8wuW';

const allDataFromAPI = axios
  .get(`https://www.boardgameatlas.com/api/search?client_id=${client_id}`)
  .then((response) => {
    return response.data.games;
  });

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS chat;
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
    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE game_type (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gametype VARCHAR
  );
  CREATE TABLE game (
    id VARCHAR PRIMARY KEY UNIQUE,
    name VARCHAR,
    "gameTypeID" UUID REFERENCES users(id),
    description VARCHAR,
    image_url VARCHAR,
    min_players INT,
    max_players INT
  );
  CREATE TABLE user_game (
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
    "userId" UUID REFERENCES users(id) NOT NULL,
    "userId2" UUID REFERENCES users(id) NOT NULL,
    messages VARCHAR
  );

  INSERT INTO users (username, firstname, lastname, password, role, email) VALUES('admin', 'ad', 'min','password','ADMIN','admin@admin.com');
  `;
  await client.query(SQL);

  const _games = await allDataFromAPI;
  const [foo, bar, baz] = await Promise.all(
    Object.values(_games).map((each) => games.create(each))
  );
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
};
