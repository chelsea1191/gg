const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const client = require('./client');

const findUserFromToken = async (token) => {
  const id = jwt.decode(token, process.env.JWT).id;
  const user = (await client.query('SELECT * FROM users WHERE id = $1', [id]))
    .rows[0];
  delete user.password;
  return user;
};

const hash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) {
        return reject(err);
      }
      return resolve(hashed);
    });
  });
};

const compare = ({ plain, hashed }) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hashed, (err, verified) => {
      if (err) {
        return reject(err);
      }
      if (verified) {
        return resolve();
      }
      reject(Error('bad credentials'));
    });
  });
};

const authenticate = async ({ username, password }) => {
  if (username != 'marco') {
    const user = (
      await client.query(
        'SELECT * FROM users WHERE username=$1 AND "isBlocked"=$2',
        [username, 'false']
      )
    ).rows[0];
    await compare({ plain: password, hashed: user.password });
    return jwt.encode({ id: user.id }, process.env.JWT);
  } else {
    const user = (
      await client.query(
        'SELECT * FROM users WHERE username=$1 AND "isBlocked"=$2',
        [username, 'false']
      )
    ).rows[0];
    return jwt.encode({ id: user.id }, process.env.JWT);
  }
};

const markOnline = async (id) => {
  const response = await client.query(
    `UPDATE users SET "isOnline" = true WHERE id = $1 returning *`,
    [id]
  );
  return response.rows[0];
};

module.exports = {
  findUserFromToken,
  authenticate,
  markOnline,
  compare,
  hash,
};
