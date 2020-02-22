const pg = require("pg")
const { Client } = pg
const uuid = require("uuid/v4")
const client = new Client("postgres://localhost/acme_dictionary")
const faker = require("faker")

client.connect()

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS table_name;
  CREATE TABLE table_name
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );
  INSERT INTO table_name (name) VALUES ('word');
  `
  await client.query(SQL)
}

module.exports = {
  sync
}
