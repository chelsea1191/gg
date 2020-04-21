const client = require('../client');

const friendships = {
  read: async () => {
    const response = await client.query('SELECT * FROM friends');
    return response.rows;
  },

  create: async (friendship) => {
    const SQL = `INSERT INTO friendships ("userId", "friendId") values($1, $2) returning *`;
    return (await client.query(SQL, [friendship.userId, friendship.friendId]))
      .rows[0];
  },
};

module.exports = friendships;
