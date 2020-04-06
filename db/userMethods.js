const client = require('./client');

const getAllGames = async () => {
  let response = await client.query(`SELECT * from game`);
  return response.rows;
};

module.exports = {
  getAllGames,
};
