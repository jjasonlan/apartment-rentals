const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');
const User = require('./collections/Users');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

async function main() {
  mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('we\'re in');
    initialize();

  });


}

function createAdminUser() {
  User.find({}, (err, users) => {
    if (users.length) return;
    console.log('adding admin user');
    const adminUser = new User({
      username: 'admin',
      name: 'admin',
      password: 'admin123',
      role: 'admin',
    });
    adminUser.save();
  });

  User.find({}, (err, users) => {
    console.log('users ' + users);
  });
}

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
        newUser.save();
        res.status(201).send({ message: 'account created' });
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
  })
}

function initialize() {
  createAdminUser();
  initializeAuth();
}

main().catch(console.error);