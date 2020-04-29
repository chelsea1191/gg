const client = require('./client')

const getAllGames = async () => {
  let response = await client.query(`SELECT * FROM game`)
  return response.rows
}
const getUsers = async () => {
  const response = await client.query(`SELECT * FROM users`)
  return response.rows
}

const getUser = async (userId) => {
  const response = await client.query(`SELECT * from users WHERE id = $1`, [
    userId,
  ])
  return response.rows[0]
}

const createChat = async (userid1, username1, userid2, username2) => {
  const response = await client.query(
    `INSERT INTO chat (creator_id, creator_username, user_id, user_username) VALUES ($1, $2, $3, $4) returning *`,
    [userid1, username1, userid2, username2]
  )
  console.log(response.rows[0], 'my db response for createChat')
  return response.rows[0]
}

const getChat = async (userId1, userId2) => {
  const response = await client.query(
    `SELECT * FROM chat WHERE creator_id = $1 AND user_id = $2 OR creator_id = $2 AND user_id = $1 ORDER BY date_updated DESC`,
    [userId1, userId2]
  )
  return response.rows[0]
}

const getChats = async (authId) => {
  const response = await client.query(
    `SELECT * FROM chat WHERE creator_id = $1 OR user_id =$1 ORDER BY date_updated DESC`,
    [authId]
  )
  console.log(response.rows, 'this is my db reponse')
  return response.rows
}

const updateChat = async (chatId, updatedTime) => {
  const response = await client.query(
    `INSERT INTO chat (date_updated) VALUES ($2) WHERE id = $1`,
    [chatId, updatedTime]
  )
  return response.rows[0]
}

const createMessage = async (chatId, userId, message) => {
  const response = await client.query(
    `INSERT INTO message (chat_id, sender_id, message) VALUES ($1, $2, $3) returning *`,
    [chatId, userId, message]
  )
  console.log(response.rows[0], 'my db response for createMessage')
  return response.rows[0]
}

const getMessage = async (chatId) => {
  const response = await client.query(
    `SELECT * from message WHERE chat_id = $1 `,
    [chatId]
  )
  console.log(response.rows, 'my db response to get messages')
  return response.rows
}

const putMessage = async (chatId, userId, message, time) => {
  const response = await client.query(
    `INSERT INTO message (chat_id, sender_id, message, date_updated) VALUES ($1, $2, $3, $4) returning *`,
    [chatId, userId, message, time]
  )
  return response.rows[0]
}

module.exports = {
  getAllGames,
  createChat,
  updateChat,
  getChat,
  getChats,
  getUsers,
  getUser,
  createMessage,
  getMessage,
  putMessage,
}
