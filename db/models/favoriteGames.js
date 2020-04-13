const client = require('../client');

const favoriteGames = {
  read: async () => {
    const response = await client.query('SELECT * FROM favoritegames');
    return response.rows;
  },

  create: async (favoriteGame) => {
    const SQL = `INSERT INTO favoritegames ("userId", "gameId") values($1, $2) returning *`;
    return (await client.query(SQL, [favoriteGame.userId, favoriteGame.gameId]))
      .rows[0];
  },
};

module.exports = favoriteGames;
