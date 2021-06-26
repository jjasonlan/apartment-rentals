const app = require("../server/server");
const mongoose = require("mongoose");
const Apartment = require('../server/collections/Apartments');
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

describe("GET /apartments", () => {
  test("returns list of apartments", async () => {
    const now = new Date();
    const newAprt = new Apartment({
      name: 'Dolores Park',
      description: 'Park in Sunny San Francisco',
      size: 1000,
      price: 4000,
      rooms: 6,
      location: [37.759703, -122.428093],
      created_date: now,
      realtor_name: 'Mr. Landlord',
      realtor: 'landlord',
    });
    await newAprt.save();

    await supertest(app).get("/apartments")
      .expect(200)
      .then((response) => {
        // Check type and length
        const users = response.body.apartments;
        expect(Array.isArray(apartments)).toBeTruthy();

        // Check data
        expect(apartments[0]).toEqual({
          name: 'Dolores Park',
          description: 'Park in Sunny San Francisco',
          size: 1000,
          price: 4000,
          rooms: 6,
          location: [37.759703, -122.428093],
          created_date: now,
        });
      });
  });
});

describe("POST /addListing", () => {
  test("add apartment listing", async () => {
    const now = new Date();
    const newAprt = {
      name: 'Dolores Park',
      description: 'Park in Sunny San Francisco',
      size: 1000,
      price: 4000,
      rooms: 6,
      location: [37.759703, -122.428093],
      created_date: now,
      realtor_name: 'Mr. Landlord',
      realtor: 'landlord',
    };

    await supertest(app).post("/addListing")
      .send(newAprt)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('apartment listing created');
        await Apartment.count({}, (req, res) => {
          expect(res).toBe(1);
        });
      })
      .catch(err => {
        throw new Error(err)
      });
  });

  test("prevent duplicates", async () => {
    const now = new Date();
    const newAprt = {
      name: 'Dolores Park',
      description: 'Park in Sunny San Francisco',
      size: 1000,
      price: 4000,
      rooms: 6,
      location: [37.759703, -122.428093],
      created_date: now,
      realtor_name: 'Mr. Landlord',
      realtor: 'landlord',
    };

    await supertest(app).post("/addListing")
      .send(newAprt)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('apartment listing created');
        expect(Apartment.find().count()).toBe(1);
      })
      .catch(err => {
        throw new Error(err)
      });

    await supertest(app).post("/addListing")
      .send(newAprt)
      .expect(409)
      .then(res => {
        expect(res.body.message).toBe('name Dolores Park is already taken');
      })
      .catch(err => {
        throw new Error(err)
      });
  })
});

describe("PUT /editListing", () => {
  test("updates listing name", async () => {
    const now = new Date();
    const newAprt = new Apartment({
      name: 'Dolores Park',
      description: 'Park in Sunny San Francisco',
      size: 1000,
      price: 4000,
      rooms: 6,
      location: [37.759703, -122.428093],
      created_date: now,
      realtor_name: 'Mr. Landlord',
      realtor: 'landlord',
    });
    await newAprt.save();
    
    await supertest(app).put("/editListing")
      .send({
        realtor: 'landlord_son',
        realtor_name: 'Mr. Landlord Jr.',
      })
      .expect(200)
      .then((response) => {
        const { message, apartment } = response.body;
        expect(message).toBe('update successful');
        expect(typeof(apartment) === "object").toBeTruthy();
        expect(apartment).toEqual({
          name: 'Dolores Park',
          description: 'Park in Sunny San Francisco',
          size: 1000,
          price: 4000,
          rooms: 6,
          location: [37.759703, -122.428093],
          created_date: now,
          realtor: 'landlord_son',
          realtor_name: 'Mr. Landlord Jr.',
        });
      })
      .catch(err => {
        throw new Error(err)
      });
      const apartment = await Apartment.findOne({name: ''});
      expect(apartment.realtor).toBe('landlord_son');
      expect(apartment.realtor_name).toBe('Mr. Landlord Jr.');
    });
});


describe("DELETE /deleteListing", () => {
  test("removes an apartment", async () => {
    const now = new Date();
    const newAprt = new Apartment({
      name: 'Dolores Park',
      description: 'Park in Sunny San Francisco',
      size: 1000,
      price: 4000,
      rooms: 6,
      location: [37.759703, -122.428093],
      created_date: now,
      realtor_name: 'Mr. Landlord',
      realtor: 'landlord',
    });
    await newAprt.save();

    await supertest(app).delete("/deleteListing")
      .send({
        name: 'Dolores Park',
      })
      .expect(200)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe('delete successful');
      })
      .catch(err => {
        throw new Error(err)
      });
      const apartments = await Apartment.find({});
      expect(Array.isArray(apartments)).toBeTruthy();
      expect(apartments.length).toBe(0);
    });
});
