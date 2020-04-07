const client = require('./client');

const getAllGames = async () => {
  let response = await client.query(`SELECT * FROM game`);
  return response.rows;
};

module.exports = {
  getAllGames,
};
