const express = require("express");
const app = express();
const User = require('./collections/Users');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function initializeAuth() {
  app.post("/signup", (req, res) => {
    const form = req.body;
    User.findOne({ username: form.username }, (err, user) => {
      if (user) {
        res.status(409).send({ message: 'username ' + form.username + ' is already taken'});
      } else {
        const newUser = new User({
          username: form.username,
          name: form.name,
          password: form.password,
          role: form.role,
        });
        newUser.save().then(() => {
          res.status(201).send({ message: 'account created' });
        });
      }
    })
  });

  app.post("/login", (req, res) => {
    const form = req.body;
    User.findOne({ username: form.username, password: form.password }, (err, user) => {
      if (user) {
        res.send({ message: 'login successful', user });
      } else {
        res.status(401).send({ message: 'Username or password is incorrect' });
      }
    });
  });

  app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(500).send({ message: 'request unsuccessful'})
      } else {
        res.send({ users: users.map(user => ({
          name: user.name,
          username: user.username,
          role: user.role,
        }))});
      }
    })
  });

  app.put("/editUser", (req, res) => {
    const form = req.body;
    
    User.updateOne({
      username: form.username,
    }, {
      ...form.name ? {name: form.name} : {},
      ...form.role ? {role: form.role} : {},
    }, (err, user) => {
      if (user) {
        res.send({ message: 'update successful' });
      } else {
        res.status(500).send(err);
      }
    })
  });

  app.delete("/deleteUser", (req, res) => {
    const form = req.body;
    
    User.deleteOne({
      username: form.username,
    }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ message: 'delete successful' });
      }
    })
  });
}

initializeAuth();

module.exports = app;
