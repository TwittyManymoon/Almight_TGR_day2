let mongoose = require("mongoose");

//Article Schema
let digitalinputSchema = mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  teamID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

let Digitalinput = (module.exports = mongoose.model(
  "Digitalinput",
  digitalinputSchema
));
