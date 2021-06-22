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

describe("GET /users", () => {
  test("returns list of users", async () => {
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

  test("prevent duplicates", async () => {
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

    await supertest(app).post("/signup")
      .send(newRealtor)
      .expect(409)
      .then(res => {
        expect(res.body.message).toBe('username realtor is already taken');
      })
      .catch(err => {
        throw new Error(err)
      });
  });
});

describe("POST /login", () => {
  test("login successful", async () => {
    const defaultAdminUser = new User({
      name: 'admin',
      username: 'admin',
      role: 'admin',
      password: 'admin123',
    });
    await defaultAdminUser.save();
  
    await supertest(app).post("/login")
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(200)
      .then((response) => {
        // Check type and length
        const {user, message} = response.body;
        expect(message).toBe('login successful');
        expect(typeof(user) === "object").toBeTruthy();
        expect(user).toEqual({
          name: 'admin',
          username: 'admin',
          role: 'admin',
        });
      })
      .catch(err => {
        throw new Error(err)
      });
  });
    
  test("validates credentials", async () => {
    const defaultAdminUser = new User({
      name: 'admin',
      username: 'admin',
      role: 'admin',
      password: 'admin123',
    });
    await defaultAdminUser.save();

    await supertest(app).post("/login")
      .send({
        username: 'admin',
        password: 'admin',
      })
      .expect(401)
      .then((response) => {
        // Check type and length
        const {message} = response.body;
        expect(message).toBe('Username or password is incorrect');
      })
      .catch(err => {
        throw new Error(err)
      });
  });
});

describe("PUT /editUser", () => {
  test("updates user name and role", async () => {
    const newRealtor = new User({
      name: 'realtor',
      username: 'realtor',
      role: 'realtor',
      password: 'realtorabc',
    });

    await newRealtor.save();
    await supertest(app).put("/editUser")
      .send({
        username: 'realtor',
        name: 'new client',
        role: 'client',
      })
      .expect(200)
      .then((response) => {
        const { message, user } = response.body;
        expect(message).toBe('update successful');
        expect(typeof(user) === "object").toBeTruthy();
        expect(user).toEqual({
          username: 'realtor',
        });
      })
      .catch(err => {
        throw new Error(err)
      });
      const user = await User.findOne({username: 'realtor'});
      expect(user.name).toBe('new client');
      expect(user.role).toBe('client');
    });
});


describe("DELETE /deleteUser", () => {
  test("removes a user", async () => {
    const newRealtor = new User({
      name: 'realtor',
      username: 'realtor',
      role: 'realtor',
      password: 'realtorabc',
    });

    await newRealtor.save();
    await supertest(app).delete("/deleteUser")
      .send({
        username: 'realtor',
      })
      .expect(200)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe('delete successful');
      })
      .catch(err => {
        throw new Error(err)
      });
      const users = await User.find({});
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBe(0);
    });
});
