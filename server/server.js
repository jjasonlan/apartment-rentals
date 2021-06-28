const express = require("express");
const app = express();
const User = require('./collections/Users');
const Apartment = require('./collections/Apartments');
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
        newUser.save().then((doc) => {
          res.status(201).send({ message: 'account created', user: doc });
        });
      }
    })
  });

  app.post("/login", (req, res) => {
    const form = req.body;
    User.findOne({ username: form.username, password: form.password }, (err, user) => {
      if (user) {
        res.send({
          message: 'login successful',
          user: {
            username: user.username,
            name: user.name,
            role: user.role,
          },
        });
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

  app.get("/realtors", (req, res) => {
    User.find({role: 'realtor'}, (err, users) => {
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

  app.put("/editUser", async (req, res) => {
    const form = req.body;
    
    const user = await User.findOne({
      username: form.username,
    });

    if (user) {
      user.name = form.name;
      user.role = form.role;
      user.save().then(doc => {
        res.send({ message: 'update successful', user: { username: doc.username } });
      });
    } else {
      res.status(500).send(err);
    }

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

function initializeApartments() {
  app.post("/addListing", (req, res) => {
    const form = req.body;
    Apartment.findOne({ name: form.name }, (err, apartment) => {
      if (apartment) {
        res.status(409).send({ message: 'name ' + form.name + ' is already taken'});
      } else {
        const newApartment = new Apartment({
          name: form.name,
          description: form.description,
          size: form.size,
          price: form.price,
          rooms: form.rooms,
          location: form.location,
          created_date: form.created_date,
          realtor_name: form.realtor_name,
          realtor: form.realtor,
          rented: form.rented,
        });
        newApartment.save().then(() => {
          res.status(201).send({ message: 'apartment listing created' });
        }).catch(err => res.status(400).send({ message: err.message }));
      }
    })
  });

  app.get("/apartments", (req, res) => {
    Apartment.find({}, (err, apartments) => {
      if (err) {
        res.status(500).send({ message: 'request unsuccessful'})
      } else {
        res.send({ apartments: apartments.map(apartment => ({
          _id: apartment._id,
          name: apartment.name,
          description: apartment.description,
          size: apartment.size,
          price: apartment.price,
          rooms: apartment.rooms,
          location: apartment.location,
          created_date: apartment.created_date,
          realtor_name: apartment.realtor_name,
          realtor: apartment.realtor,
          rented: apartment.rented,
        }))});
      }
    })
  });

  app.put("/editListing", async (req, res) => {
    const form = req.body;
    
    const apartment = await Apartment.findOne({_id: form.id});
    const nameIsUsed = await Apartment.findOne({name: form.name});

    if (nameIsUsed && !nameIsUsed._id.equals(apartment._id)) {
      res.status(400).send({ message: 'name ' + form.name + ' is in use' });
    }

    if (apartment) {
      apartment.name = form.name || apartment.name,
      apartment.description = form.description || apartment.description,
      apartment.size = form.size || apartment.size,
      apartment.price = form.price || apartment.price,
      apartment.rooms = form.rooms || apartment.rooms,
      apartment.location = form.location || apartment.location,
      apartment.created_date = form.created_date || apartment.created_date,
      apartment.realtor_name = form.realtor_name || apartment.realtor_name,
      apartment.realtor = form.realtor || apartment.realtor,
      apartment.rented = form.rented === undefined ? apartment.rented : form.rented,
      apartment.save().then(doc => {
        res.send({ message: 'update successful', apartment: { _id: doc._id } });
      }).catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(500).send({ message: 'update failed' });
    }

  });

  app.delete("/deleteListing", (req, res) => {
    const form = req.body;
    
    Apartment.findOneAndRemove({
      _id: form.id,
    }, (err, apartment) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ message: 'delete successful' });
      }
    }, {useFindAndModify: false})
  });
}

initializeAuth();
initializeApartments();

module.exports = app;
