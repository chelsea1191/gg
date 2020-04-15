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

app.get('/api/users', (req, res, next) => {
  db.getUsers()
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/getMessages/:chatid/:userid', (req, res, next) => {
  db.getMessage(req.params.chatid, req.params.userid).then((response) => {
    res.send(response);
  });
});

app.get('/api/favoritegames', (req, res, next) => {
  db.models.favoriteGames
    .read()
    .then((response) => res.send(response))
    .catch(next);
});

//////////////////post////////////////////

app.post('/api/createUser', (req, res, next) => {
  db.models.users
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});
app.post('/api/chat', (req, res, next) => {
  db.getChat(req.body[0], req.body[1]).then((response) => res.send(response));
});

app.post('/api/createchat', (req, res, next) => {
  db.createChat(req.body[0], req.body[1])
    .then((chatCreatedResponse) => {
      db.createMessage(
        chatCreatedResponse.id,
        chatCreatedResponse.creator_id
      ).then((messageCreatedResponse) => {
        res.send([chatCreatedResponse, messageCreatedResponse]);
      });
    })
    .catch(next);
});

app.post('/api/favoritegames', (req, res, next) => {
  db.models.favoriteGames
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});

app.post('/api/sendMessages', (req, res, next) => {
  console.log(req.body[0]);
  db.putMessage(req.body[0], req.body[1], req.body[2], req.body[3]);
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
