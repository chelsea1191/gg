const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async ({ username, firstname, lastname, password, email, bio }) => {
    const SQL = `INSERT INTO users(username, firstname, lastname, password, email, bio, "isBlocked") values($1, $2, $3, $4, $5, $6, $7) returning *`;
    return (
      await client.query(SQL, [
        username,
        firstname,
        lastname,
        await hash(password),
        email,
        bio,
        'false'
      ])
    ).rows[0];
  },
  update: async ({ userId, password }) => {
    const SQL = `UPDATE users SET password=$2 WHERE id=$1 returning *`;
    return (await client.query(SQL, [userId, await hash(password)])).rows[0];
  },
  delete: async (id) => {
    const SQL = `DELETE FROM users WHERE (id) = ($1);`;
    await client.query(SQL, [id]);
  }
};

module.exports = users;
