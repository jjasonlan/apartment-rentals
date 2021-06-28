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
      rented: false,
    });
    await newAprt.save();

    await supertest(app).get("/apartments")
      .expect(200)
      .then((response) => {
        // Check type and length
        const apartments = response.body.apartments;
        expect(Array.isArray(apartments)).toBeTruthy();

        const apartmentData = apartments[0];
        delete apartmentData._id;
        // Check data
        expect(apartmentData).toEqual({
          name: 'Dolores Park',
          description: 'Park in Sunny San Francisco',
          size: 1000,
          price: 4000,
          rooms: 6,
          location: [37.759703, -122.428093],
          created_date: now.toISOString(),
          realtor_name: 'Mr. Landlord',
          realtor: 'landlord',
          rented: false,
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
      rented: false,
    };

    await supertest(app).post("/addListing")
      .send(newAprt)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('apartment listing created');
      })
      .catch(err => {
        throw new Error(err)
      });
    await Apartment.count({}, (req, res) => {
      expect(res).toBe(1);
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
      rented: false,
    };

    await supertest(app).post("/addListing")
      .send(newAprt)
      .expect(201)
      .then(res => {
        expect(res.body.message).toBe('apartment listing created');
      })
      .catch(err => {
        throw new Error(err)
      });
    await Apartment.count({}, (req, res) => {
      expect(res).toBe(1);
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
  test("updates realtor", async () => {
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
      rented: false,
    });
    let aprtID = '';
    await newAprt.save().then(doc => aprtID = doc._id);
    
    await supertest(app).put("/editListing")
      .send({
        id: aprtID,
        realtor: 'landlord_son',
        realtor_name: 'Mr. Landlord Jr.',
      })
      .expect(200)
      .then((response) => {
        const { message, apartment } = response.body;
        expect(message).toBe('update successful');
        expect(typeof(apartment) === "object").toBeTruthy();
        expect(apartment).toEqual({
          _id: aprtID.toString(),
        });
      })
      .catch(err => {
        throw new Error(err)
      });
      const apartment = await Apartment.findOne({_id: aprtID});
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
      rented: false,
    });
    let aprtID = '';
    await newAprt.save().then(doc => aprtID = doc._id);

    await supertest(app).delete("/deleteListing")
      .send({
        id: aprtID,
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
