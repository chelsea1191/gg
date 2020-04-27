const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async ({
    username,
    firstname,
    lastname,
    password,
    role,
    email,
    bio,
    latitude,
    longitude,
    avatar,
  }) => {
    const SQL = `INSERT INTO users(username, firstname, lastname, password, role, email, bio, "isBlocked", latitude, longitude, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`;
    return (
      await client.query(SQL, [
        username,
        firstname,
        lastname,
        await hash(password),
        role,
        email,
        bio,
        'false',
        latitude,
        longitude,
        avatar,
      ])
    ).rows[0];
  },
  update: async ({ userId, password }) => {
    const SQL = `UPDATE users SET password=$2 WHERE id=$1 returning *`;
    return (await client.query(SQL, [userId, await hash(password)])).rows[0];
  },
  logout: async (id) => {
    const response = await client.query(
      `UPDATE users SET "isOnline" = false WHERE id = $1 returning *`,
      [id]
    );
    return response.rows[0];
  },
  delete: async (id) => {
    const SQL = `DELETE FROM users WHERE (id) = ($1);`;
    await client.query(SQL, [id]);
  },
  avatar: async ({ id, avatar }) => {
    const SQL = `UPDATE users SET avatar=$2 WHERE id=$1 returning *`;
    const response = await client.query(SQL, [id, avatar]);
    return response.rows[0];
  },
};

module.exports = users;
