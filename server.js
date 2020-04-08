const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const db = require('./db/db');
const models = db.models;
const bodyParser = require('body-parser');

//to change git remote: git remote set-url origin (new.git.url/here)

//////////////////use///////////////////
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

var myLogger = function (req, res, next) {
  console.log(req.body);
  next();
};
app.use(myLogger);

//////////////////auth//////////////////
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error('not authorized');
    error.status = 401;
    return next(error);
  }
  next();
};
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(Error('not authorized'));
  }
  next();
};
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  db.findUserFromToken(token)
    .then((auth) => {
      req.user = auth;
      next();
    })
    .catch((ex) => {
      const error = Error('not authorized');
      error.status = 401;
      next(error);
    });
});
app.post('/api/auth', (req, res, next) => {
  db.authenticate(req.body)
    .then((token) => {
      res.send({ token });
    })
    .catch(() => {
      const error = Error('not authorized');
      error.status = 401;
      next(error);
    });
});
app.get('/api/auth', isLoggedIn, (req, res, next) => {
  res.send(req.user);
});
app.put('/api/auth/:id', (req, res, next) => {
  db.models.users
    .update(req.body)
    .then((response) => res.send(response))
    .catch(next);
});

//////////////////get////////////////////
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/api/games', (req, res, next) => {
  db.getAllGames()
    .then((response) => res.send(response))
    .catch(next);
});
// app.get('/api/games/:id', (req, res, next) => {
//   console.log('server: ', req.body);
//   db.getGameById(req.body)
//     .then((response) => res.send(response))
//     .catch(next);
// });

//////////////////post////////////////////

app.post('/api/createUser', (req, res, next) => {
  db.models.users
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});

///////////////////put////////////////////
// app.put("/api/user_things/:id", (req, res, next) => {
//   db.updateUserThings(req.body)
//     .then(userThing => res.send(userThing))
//     .catch(next);
// });

//////////////////delete////////////////////
// app.delete("/api/users/:id", (req, res, next) => {
//   db.deleteUser(req.params.id)
//     .then(() => res.sendStatus(204)) //since no return
//     .catch(next);
// });

/////////////////errors/////////////////
app.get('/*', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);
app.use((req, res, next) => {
  const error = {
    message: `page not found ${req.url} for ${req.method}`,
    status: 404,
  };
  next(error);
});

app.use((err, req, res, next) => {
  console.log('error:', err.status);
  res.status(err.status || 500).send({ message: err.message });
});

const port = process.env.PORT || 3000;
db.sync()
  .then(() => {
    console.log('db synced');
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch((ex) => console.log(ex));
