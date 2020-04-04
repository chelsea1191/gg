const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async ({ username, firstname, lastname, password, role, status }) => {
    const SQL = `INSERT INTO users(username, firstname, lastname, password, role, status) values($1, $2, $3, $4, $5, $6) returning *`;
    return (
      await client.query(SQL, [
        username,
        firstname,
        lastname,
        await hash(password),
        role,
        status
      ])
    ).rows[0];
  },
  update: async ({ userId, password }) => {
    const SQL = `UPDATE users SET password=$2 WHERE id=$1 returning *`;
    return (await client.query(SQL, [userId, await hash(password)])).rows[0];
  }
};

module.exports = users;
