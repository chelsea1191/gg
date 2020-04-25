const client = require('../client');

const friendships = {
  read: async () => {
    const response = await client.query('SELECT * FROM friendships');
    return response.rows;
  },

  create: async (friendship) => {
    const SQL = `INSERT INTO friendships ("userId", "friendId", "sendStatus") values($1, $2, $3) returning *`;
    return (
      await client.query(SQL, [
        friendship.userId,
        friendship.friendId,
        friendship.sendStatus,
      ])
    ).rows[0];
  },

  update: async (friendship) => {
    const SQL = `UPDATE friendships SET (sendStatus) = ($1) WHERE id = ($2)`;
    return (await client.query(SQL, [friendship.sendStatus, friendship.id]))
      .rows[0];
  },
};

module.exports = friendships;
