const client = require('../client');

const games = {
  read: async () => {
    return (await client.query('SELECT * from game')).rows;
  },
  create: async ({
    id,
    name,
    description,
    image_url,
    min_players,
    max_players,
  }) => {
    const SQL = `INSERT INTO game(id, name, description, image_url, min_players, max_players) values($1, $2, $3, $4, $5, $6) returning *`;
    return (
      await client.query(SQL, [
        id,
        name,
        description,
        image_url,
        min_players,
        max_players,
      ])
    ).rows[0];
  },
};

module.exports = games;
