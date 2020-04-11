const client = require('../client');

const gameTypes = {
  read: async () => {
    return (await client.query('SELECT * from game_type')).rows;
  },
  create: async (each) => {
    const SQL = `INSERT INTO game_type(gametype) values($1) returning *`;
    return (await client.query(SQL, [each.gametype])).rows[0];
  },
};

module.exports = gameTypes;
