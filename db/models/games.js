const client = require('../client');

const games = {
  read: async () => {
    return (await client.query('SELECT * from games')).rows;
  },
  create: async (each) => {
    const SQL = `INSERT INTO game(id, name, description, image_url, min_players, max_players, url, primary_publisher, min_age, year_published, min_playtime, max_playtime) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`;
    return (
      await client.query(SQL, [
        each.id,
        each.name,
        each.description_preview,
        each.image_url,
        each.min_players,
        each.max_players,
        each.url,
        each.primary_publisher,
        each.min_age,
        each.year_published,
        each.min_playtime,
        each.max_playtime,
      ])
    ).rows[0];
  },
};

module.exports = games;
