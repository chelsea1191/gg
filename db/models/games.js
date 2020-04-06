const client = require('../client');

const games = {
  read: async () => {
    return (await client.query('SELECT * from game')).rows;
  },
  create: async (each) => {
    const SQL = `INSERT INTO game(id, name, description, image_url, min_players, max_players) values($1, $2, $3, $4, $5, $6) returning *`;
    return (
      await client.query(SQL, [
        each.id,
        each.name,
        each.description,
        each.image_url,
        each.min_players,
        each.max_players,
      ])
    ).rows[0];
  },
};

module.exports = games;
