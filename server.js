const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const db = require('./db/db');
const models = db.models;
const bodyParser = require('body-parser');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const server = require('http').Server(app);
const io = require('socket.io')(server);

//to change git remote: git remote set-url origin (new.git.url/here)

//////////////////use///////////////////
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(express.static('./public'));
app.use(fileUpload());

var myLogger = function (req, res, next) {
  next();
};
app.use(myLogger);

/**
 * Chat
 *
 */

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    const req = JSON.parse(msg);
    io.emit('chat message', msg);
    db.putMessage(
      req.chat_id,
      req.sender_id,
      req.message,
      req.time
    ).then((response) => io.emit('response', response));

    //socket.broadcast.emit('is typing', msg.typing);
  });
  // socket.on('typing', (dots) => {
  //   console.log(dots)
  //   socket.broadcast.emit('hi')
  // })
});

///////////// MULTER ////////////

//set storage engine//

// const storage = multer.diskStorage({
//   destination: './public/uploads',
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     )
//   },
// })

// initilize upload//

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10000000 },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb)
//   },
// }).single('avatar')

// check file type //

// const checkFileType = (file, cb) => {
//   // allowed extensions
//   const fileTypes = /jpeg|jpg|png|gif/
//   //check ext
//   const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
//   //check mime
//   const mimetype = fileTypes.test(file.mimetype)

//   if (mimetype && extName) {
//     return cb(null, true)
//   } else {
//     cb('Error: Images only')
//   }
// }

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
  db.markOnline(req.user.id).then((response) => {
    res.send(response);
  });
});
app.put('/api/auth/:id', (req, res, next) => {
  db.models.users
    .update(req.body)
    .then((response) => res.send(response))
    .catch(next);
});
app.put('/api/auth/logout/:id', (req, res, next) => {
  db.models.users
    .logout(req.params.id)
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

app.get('/api/getMessages/:chatid', (req, res, next) => {
  db.getMessage(req.params.chatid)
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/favoritegames', (req, res, next) => {
  db.models.favoriteGames
    .read()
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/chatuser/:userid', (req, res, next) => {
  db.getUser(req.params.userid)
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/friendships', (req, res, next) => {
  db.models.friendships
    .read()
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/chat/:authId', (req, res, next) => {
  db.getChats(req.params.authId)
    .then((response) => res.send(response))
    .catch(next);
});

app.get('/api/chat/:userId/:authId', (req, res, next) => {
  db.getChat(req.params.userId, req.params.authId)
    .then((response) => {
      res.send(response);
    })
    .catch(next);
});

//////////////////post////////////////////

// app.post('/upload', (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(err.status || 500);
//       res.json({
//         message: err.message,
//         error: err,
//       });
//     } else {
//         res.send({ msg: 'File uploaded!' });
//         res.sendFile(`uploads/${req.file.filename}`);
//       }
//     }
//   });
// });

app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.post('/api/createUser', (req, res, next) => {
  db.models.users
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});
// app.post('/api/chat', (req, res, next) => {
//   db.getChat(req.body[0], req.body[1]).then((response) => res.send(response));
// });

app.post('/api/createchat', (req, res, next) => {
  db.createChat(req.body[0], req.body[1])
    .then((chatCreatedResponse) => {
      db.createMessage(
        chatCreatedResponse.id,
        chatCreatedResponse.creator_id
      ).then(res.send(chatCreatedResponse));
    })
    .catch(next);
});

app.post('/api/favoritegames', (req, res, next) => {
  db.models.favoriteGames
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});

app.post('/api/friendships', (req, res, next) => {
  db.models.friendships
    .create(req.body)
    .then((user) => res.send(user))
    .catch(next);
});

app.post('/api/sendMessages', (req, res, next) => {
  db.putMessage(
    req.body[0],
    req.body[1],
    req.body[2],
    req.body[3]
  ).then((response) => res.send(response));
});

///////////////////put////////////////////
// app.put("/api/user_things/:id", (req, res, next) => {
//   db.updateUserThings(req.body)
//     .then(userThing => res.send(userThing))
//     .catch(next);
// });

app.put('/api/friendships/:id', (req, res, next) => {
  const id = req.params.id;
  db.models.friendships
    .update(req.body)
    .then((friendship) => res.send(friendship))
    .catch(next);
});

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
    server.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch((ex) => console.log(ex));
