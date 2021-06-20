const mongoose = require('mongoose');
const app = require("./server");
const User = require('./collections/Users');

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
  });

  function createAdminUser() {
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
  
    User.find({}, (err, users) => {
      console.log('users ' + users);
    });
  }

}

main().catch(console.error);
