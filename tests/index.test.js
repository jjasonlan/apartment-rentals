const app = require("../server/server");
const mongoose = require("mongoose");
const User = require('../server/collections/Users');
const supertest = require("supertest");

beforeEach((done) => {
  mongoose.createConnection("mongodb://localhost:27017/JestDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

test("GET /users", async () => {
  const defaultAdminUser = {
    name: 'admin',
    username: 'admin',
    role: 'admin',
  };

  await supertest(app).get("/users")
    .expect(200)
    .then((response) => {
      // Check type and length
      const users = response.body.users;
      expect(Array.isArray(users)).toBeTruthy();

      // Check data
      expect(users[0]).toEqual(defaultAdminUser);
    });
});
