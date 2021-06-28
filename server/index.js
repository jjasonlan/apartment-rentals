const mongoose = require('mongoose');
const app = require("./server");
const User = require('./collections/Users');
const Apartment = require('./collections/Apartments');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

async function main() {
  mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function() {
    console.log('we\'re in');
    createAdminUser();
    createRealtor();
    createDefaultListings();
  });

  function createAdminUser () {
    User.find({}, (err, users) => {
      if (users && users.length) return;
      console.log('adding admin user');
      const adminUser = new User({
        username: 'admin',
        name: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      adminUser.save();
    });
  }

  function createRealtor () {
    User.findOne({ username: 'realtor' }, (err, user) => {
      if (user) return;
      console.log('adding sample realtor');
      const realtor = new User({
        username: 'realtor',
        name: 'John Doe',
        password: 'realtor123',
        role: 'realtor',
      });
      realtor.save();
    });
  }

  function createDefaultListings () {
    Apartment.find({}, (err, apartments) => {
      if (apartments && apartments.length) return;
      console.log('adding sample listings');
      const listings = [{
        name: '4076 17th St. 1 bedroom',
        description: 'Franciscana Apartments, 1 bed',
        size: 500,
        price: 2000,
        rooms: 1,
        location: [37.767940, -122.425590],
        created_date: new Date(),
        realtor_name: 'John Doe',
        realtor: 'realtor',
        rented: false,
      }, {
        name: '4076 17th St. Studio',
        description: 'Franciscana Apartments, Studio',
        size: 350,
        price: 2000,
        rooms: 1,
        location: [37.767940, -122.425590],
        created_date: new Date(),
        realtor_name: 'John Doe',
        realtor: 'realtor',
        rented: false,
      }, {
        name: '70 Buena Vista Terrace',
        description: 'Comfy small luxury apartment, 4 bed',
        size: 3000,
        price: 6000,
        rooms: 4,
        location: [37.767460, -122.438460],
        created_date: new Date(),
        realtor_name: 'John Doe',
        realtor: 'realtor',
        rented: false,
      }, {
        name: '209 States Ave.',
        description: 'Apartment, 2 bed',
        size: 750,
        price: 3500,
        rooms: 2,
        location: [37.763680, -122.439780],
        created_date: new Date(),
        realtor_name: 'John Doe',
        realtor: 'realtor',
        rented: false,
      }, {
        name: 'Dolores Park',
        description: 'Park in Sunny San Francisco',
        size: 1000,
        price: 4000,
        rooms: 6,
        location: [37.759703, -122.428093],
        created_date: now,
        realtor_name: 'Mr. Landlord',
        realtor: 'admin',
        rented: true,
      }];
      listings.forEach(listing => {
        const newListing = new Apartment(listing);
        newListing.save();
      });
    })
  }

}

main().catch(console.error);
