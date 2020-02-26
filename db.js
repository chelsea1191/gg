const pg = require("pg");
const { Client } = pg;
const uuid = require("uuid/v4");
const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost/boilerplatedb"
);
const faker = require("faker");

client.connect();

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS user_things;
  DROP TABLE IF EXISTS things;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP,
    CHECK (char_length(name) > 0)
  );
  CREATE TABLE things (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    CHECK (char_length(name) > 0)
  );
  CREATE TABLE user_things (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "thingId" UUID REFERENCES things(id),
    "userId" UUID REFERENCES users(id),
    "isFavorite" BOOLEAN DEFAULT FALSE
  );
  CREATE UNIQUE INDEX ON user_things("thingId", "userId");
  INSERT INTO users (name) VALUES ('userName');
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
