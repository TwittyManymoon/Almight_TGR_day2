let mongoose = require("mongoose");

//Article Schema
let accelerometerSchema = mongoose.Schema({
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
  valueX: {
    type: String,
    required: true
  },
  valueY: {
    type: String,
    required: true
  },
  valueZ: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

let Accelerometer = (module.exports = mongoose.model(
  "Accelerometer",
  accelerometerSchema
));
