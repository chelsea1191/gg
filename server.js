const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const db = require("./db");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

//////////////////use///////////////////
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.json());
app.use(express.static("assets"));

//////////////////get////////////////////
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
// app.get("/api/users", async (req, res, next) => {
//   await db
//     .readUsers()
//     .then(users => res.send(users))
//     .catch(next);
// });

//////////////////post////////////////////
// app.post("/api/users", (req, res, next) => {
//   db.createUser(req.body)
//     .then(user => res.send(user))
//     .catch(next);
// });

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

db.sync()
  .then(() => {
    console.log("db synced");
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch(ex => console.log(ex));
