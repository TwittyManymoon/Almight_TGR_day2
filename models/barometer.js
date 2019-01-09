let mongoose = require("mongoose");

//Article Schema
let barometerSchema = mongoose.Schema({
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

let Barometer = (module.exports = mongoose.model("Barometer", barometerSchema));
