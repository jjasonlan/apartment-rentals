const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  location: {
    type: [Number],
    validate: [arrayExpectation, '{PATH} should contain exactly two coordinates'],
    required: true,
  },
  realtor: {
    type: String,
    required: true,
  },
  realtor_name: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
  },
  rented: {
    type: Boolean,
    required: true,
  }
});

function arrayExpectation (val) {
  return val.length === 2;
}

const Apartment = mongoose.model('Apartments', apartmentSchema);
module.exports = Apartment;
