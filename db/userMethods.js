const client = require('./client');

const getAllGames = async () => {
  let response = await client.query(`SELECT * from game`);
  return response.rows;
};
const getUsers = async () => {
  const response = await client.query(`SELECT * FROM users`);
  return response.rows;
};

const createChat = async (userid1, userid2) => {
  const response = await client.query(
    `INSERT INTO chat (creator_id, user_id) VALUES ($1, $2) returning *`,
    [userid1, userid2]
  );
  console.log(response.rows[0], 'my db response for createChat');
  return response.rows[0];
};

const getChat = async (userId1, userId2) => {
  console.log(userId1, userId2, 'db params');
  const response = await client.query(
    `SELECT * FROM chat WHERE creator_id = $1 and user_id = $2 ORDER BY date_updated DESC`,
    [userId1, userId2]
  );
  return response.rows[0];
};
const updateChat = async (chatId, updatedTime) => {
  const response = await client.query(
    `INSERT INTO chat (date_updated) VALUES ($2) WHERE id = $1`,
    [chatId, updatedTime]
  );
  return response.rows[0];
};

const createMessage = async (chatId, userId) => {
  const response = await client.query(
    `INSERT INTO message (chat_id, sender_id) VALUES ($1, $2) returning *`,
    [chatId, userId]
  );
  console.log(response.rows[0], 'my db response for createMessage');
  return response.rows[0];
};

const getMessage = async (chatId, userId) => {
  const response = await client.query(
    `SELECT * from message WHERE chat_id = $1 and sender_id = $2 ORDER BY date_create DESC `,
    [chatId, userId]
  );
  return response.rows[0];
};

const putMessage = async (chatID, userId, message, time) => {
  const response = await client.query(
    `INSERT INTO message (message, date_updated) VALUES ($3, $4) WHERE chat_id = $1 and sender_id = $2 returning *`
  );
  return response.rows[0];
};

module.exports = {
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getUsers,
  createMessage,
  getMessage,
  putMessage,
};
