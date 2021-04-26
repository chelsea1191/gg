const client = require('../client');

const friendships = {
  read: async () => {
    const response = await client.query('SELECT * FROM friendships');
    return response.rows;
  },

  create: async (friendship) => {
    const SQL = `INSERT INTO friendships ("userId", "friendId", "sendStatus") values($1, $2, $3) returning *`;
    return (
      await client.query(SQL, [friendship.userId, friendship.friendId, 'sent'])
    ).rows[0];
  },

  update: async (friendshipId) => {
    const SQL = `UPDATE friendships SET "sendStatus" = $1 WHERE id = $2 returning *`;
    return (await client.query(SQL, ['confirmed', friendshipId])).rows[0];
  },

  verify: async (id) => {
    const SQL = `SELECT * from friendships WHERE "userId" = $1 OR "friendId" = $1`;
    return (await client.query(SQL, [id])).rows;
  },
};

module.exports = friendships;
