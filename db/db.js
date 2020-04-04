const pg = require('pg');
const uuid = require('uuid/v4');
const client = require('./client');
const faker = require('faker');
const { authenticate, compare, findUserFromToken, hash } = require('./auth');
const models = ({ users } = require('./models'));

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR,
    "gameTypeID" UUID REFERENCES users(id) NOT NULL,
    about VARCHAR,
    "playerLimit" INT
  );
  CREATE TABLE user_game (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    "gameId" UUID REFERENCES game(id)
  );
  CREATE TABLE user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    "gameTypeID" UUID REFERENCES game_type(id) NOT NULL
  );
  `;
  await client.query(SQL);
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
  findUserFromToken
};
