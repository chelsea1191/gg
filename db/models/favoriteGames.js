const client = require('../client');

const favoriteGames = {
  read: async () => {
    return (await client.query('SELECT * from "favoriteGame"')).rows;
  },
  create: async (favoriteGame) => {
    const SQL = `INSERT INTO "favoriteGame" ("userId", "gameId") values($1, $2) returning *`;
    return (await client.query(SQL, [favoriteGame.userId, favoriteGame.gameId]))
      .rows[0];
  },
};

module.exports = favoriteGames;
