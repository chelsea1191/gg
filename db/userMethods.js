const client = require('./client');

const getAllGames = async () => {
  let response = await client.query(`SELECT * from game`);
  return response.rows;
};
const getGameById = async (id) => {
  console.log('db: ', id);
};

module.exports = {
  getAllGames,
  getGameById,
};
