const pg = require('pg');
const { Client } = pg;
const uuid = require('uuid/v4');
const client = new Client(
  process.env.DATABASE_URL || 'postgres://localhost/goodgame'
);
const faker = require('faker');

client.connect();

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
    lastname VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(20) DEFAULT 'player',
    email VARCHAR(100) NOT NULL UNIQUE,
    "isBlocked" BOOLEAN DEFAULT false,
    CHECK (char_length(username) > 0),
    photo VARCHAR NOT NULL,
    bio VARCHAR,
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
//////////////////post///////////////////
// const createUser = async ({ name }) => {
//   const SQL = `INSERT INTO users (name) VALUES ($1) returning *;`;
//   const response = await client.query(SQL, [name]);
//   return response.rows[0];
// };
//////////////////put///////////////////
// const updateUserThing = async ({ isFavorite, id }) => {
//   const SQL = `UPDATE user_things SET (isFavorite) = ($1) WHERE (id) = ($2) returning *`;
//   const response = await client.query(SQL, [isFavorite, id]);
//   return response.rows[0];
// };
//////////////////delete///////////////////
// const deleteUser = async id => {
//   const SQL = `DELETE FROM users WHERE (id) = ($1);`;
//   await client.query(SQL, [id]);
// };

module.exports = {
  sync
};
