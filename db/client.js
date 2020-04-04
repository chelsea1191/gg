const { Client } = require('pg');

const client = new Client(
  process.env.DATABASE_URL || 'postgres://localhost/goodgame'
);
client.connect();

module.exports = client;
