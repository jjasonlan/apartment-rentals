const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');

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

    const userSchema = new mongoose.Schema({
      username: String,
      name: String,
      password: String,
      role: {
        type: String,
        enum: ['admin', 'client', 'realtor'],
      },
    });
    
    const User = mongoose.model('Users', userSchema);

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
      console.log('users ' + users[0]);
    });

    app.get("/api", (req, res) => {
      res.json({ message: "Hello from server!" });
    });

    app.post("/signup", (req, res) => {
      const form = req.body;
      User.findOne({ username: form.username }, (err, user) => {
        if (user) {
          res.send({ message: 'username ' + form.username + ' is already taken'});
        } else {
          const newUser = new User({
            username: form.username,
            name: form.name,
            password: form.password,
            role: form.role,
          });
          newUser.save();
          res.send({ message: 'account created' });
        }
      })
    });


  });


}

main().catch(console.error);
