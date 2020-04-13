const client = require('../client');

const favoritegames = {
  read: async () => {
    const response = await client.query(`SELECT * FROM favoritegames`);
    return response.rows;
  },

  create: async (favoritegame) => {
    const SQL = `INSERT INTO favoritegames ("userId", "gameId") values($1, $2) returning *`;
    return (await client.query(SQL, [favoritegame.userId, favoritegame.gameId]))
      .rows[0];
  },
};

module.exports = favoritegames;
