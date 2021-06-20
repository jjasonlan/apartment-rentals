const app = require("../server/server");
const mongoose = require("mongoose");
const User = require('../server/collections/Users');
const supertest = require("supertest");

beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/JestDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

test("GET /users", async () => {
  const defaultAdminUser = new User({
    name: 'admin',
    username: 'admin',
    role: 'admin',
    password: 'admin123',
  });
  await defaultAdminUser.save();

  await supertest(app).get("/users")
    .expect(200)
    .then((response) => {
      // Check type and length
      const users = response.body.users;
      expect(Array.isArray(users)).toBeTruthy();

      // Check data
      expect(users[0]).toEqual({
        name: 'admin',
        username: 'admin',
        role: 'admin',
      });
    });
});

describe("POST /signup", () => {
  test("sign up client", async () => {
    const newClient = {
      name: 'client',
      username: 'client',
      role: 'client',
      password: 'clientabc',
    };

    await supertest(app).post("/signup")
      .send(newClient)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('account created');
      })
      .catch(err => {
        throw new Error(err)
      });
  });

  test("sign up realtor", async () => {
    const newRealtor = {
      name: 'realtor',
      username: 'realtor',
      role: 'realtor',
      password: 'realtorabc',
    };

    await supertest(app).post("/signup")
      .send(newRealtor)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('account created');
      })
      .catch(err => {
        throw new Error(err)
      });
  });
});
