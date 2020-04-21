const client = require('../client');

const games = {
  read: async () => {
    return (await client.query('SELECT * from games')).rows;
  },
  create: async (each) => {
    const SQL = `INSERT INTO game(id, name, "gameTypeID", description, image_url, min_players, max_players, url, primary_publisher, min_age, year_published, min_playtime, max_playtime, average_user_rating) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`;
    return (
      await client.query(SQL, [
        each.id,
        each.name,
        1, //default board game
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
        each.average_user_rating,
      ])
    ).rows[0];
  },
};

module.exports = games;
